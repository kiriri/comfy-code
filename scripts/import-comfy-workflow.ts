#!/usr/bin/env -S node --loader ts-node/esm --no-warnings

import fs from 'fs';
import path from 'path';
import { program } from 'commander';
import { ComfyInterface } from '../dist/ComfyInterface.js';
import { clean_key, ensure_directory, get_node_path, sort_nodes_topologically, try_all, write_file_with_confirmation } from './shared.js';
import type { JSON_ComfyNodeTypes, JSON_ValueRef, JSON_Workflow, JSON_Workflow_API } from '../dist/JsonTypes';
import ExifReader from 'exifreader';


async function run()
{
    ///
    // Initialize command line args
    ///

    program
        .option('-i, --input <path>', 'Workflow file path')
        .option('-p, --port <number>', 'Port number', '8188')
        .option('-u, --url <string>', 'Server URL', 'http://127.0.0.1')
        .option('-o, --output <path>', 'Output file path', './workflows/workflow.ts')
        .option('-m, --imports <path>', 'Import path (Relative to the workflow file)', '../imports/')
        .option('-f, --full', 'Full template, such that running the resulting file runs the workflow.', false)
        .option('-y, --override', 'Override any existing file without asking.', false)
        .parse(process.argv);

    const options = program.opts();

    console.log(options);

    const PORT: number = Number.parseInt(options.port);
    const URL: string = options.url;
    const output_path: string = options.output;
    const input_path: string = options.input;
    const imports_path: string = options.imports;
    const full_workflow: boolean = options.full;
    const override: boolean = options.override;

    console.log(`Server URL: ${URL}`);
    console.log(`Port: ${PORT}`);
    console.log(`Output path: ${output_path}`);

    const comfy = new ComfyInterface(`${URL}:${PORT}`);
    const all_nodes = await comfy.getNodeTypes();

    ///
    // Parse the workflow file
    ///

    let workflow: JSON_Workflow | JSON_Workflow_API;

    // json workflow files MUST end in a .json extension.
    if(input_path.endsWith(".json"))
        workflow = JSON.parse(fs.readFileSync(input_path, { encoding: "ascii" }));
    // Otherwise it's presumably an image
    else
    {
        if(![".jpg",".jpeg",".png",".tiff",".webp",".gif",".avif",".heic",".heif"].includes(path.extname(input_path).toLowerCase()))
        {
            console.warn("Unsupported input file format. Treating it like an exif image.")
        }
        const tags = await ExifReader.load(input_path);

        workflow = await try_all([
            ()=>JSON.parse(tags.prompt?.value),
            // ()=>JSON.parse(tags.description?.value),
            ()=>JSON.parse(tags.Make?.value?.[0].replace(/^workflow:/,"")),
            ()=>JSON.parse(tags.Model?.value?.[0].replace(/^prompt:/,"")),
        ]);

        if(workflow === null)
        {
            console.log(tags);
            
            console.log("Fatal Error: Failed to find workflow data in the image's metadata.");

            return;
        }
    }

    // These nodes do not contribute to the graph at all (visual / documentation)
    const IGNORE_NODES = new Set(["Note"]);

    function check_if_nodes_installed(nodes: string[])
    {
        // Check if all nodes are installed
        const uninstalled_nodes = nodes
            .filter(node => !all_nodes[node])
            .filter(node=> !IGNORE_NODES.has(node));

        if (uninstalled_nodes.length > 0)
        {
            console.log("ERROR: ");
            console.log("Some of the nodes in this workflow could not be found in your ComfyUI installation. Please make sure everything is installed and loaded correctly.");
            console.log([...new Set(uninstalled_nodes)].join(", "));
            return false;
        }

        return true;
    }

    // All Node names this script will require.
    const imports = new Set<string>();
    // Individual node creation lines.
    let node_creations: string[] = [];


    // Is it an api workflow?
    if (!('version' in workflow))
    {
        // Sort the nodes such that no node is created before all the nodes it depends on were created.
        const sorting = sort_nodes_topologically(workflow);

        const nodes = sorting.map(id=>[id,(workflow as JSON_Workflow_API)[id]] as const).filter(([k,v])=>!IGNORE_NODES.has(v.class_type));


        if (!check_if_nodes_installed(nodes.map(([k, v]) => v.class_type)))
            return;

        // Create placeholder objects for each node.
        // This helps us get type info so we can resolve the name of the
        // output sockets.
        let placeholders = new Map<string, {
            name: string,
            type: JSON_ComfyNodeTypes[string]
        }>();


        // Turn a socket value into javascript.
        // This can be a primitive value or a reference to an output socket.
        function get_value(v:JSON_ValueRef)
        {
            if(!Array.isArray(v))  
                return JSON.stringify(v)

            let target = placeholders.get(v[0]);

            let socket_name = target?.type.output_name[v[1]];
            let target_name = target?.name;

            return `${target_name}.outputs.${socket_name}`
        }
        

        node_creations = nodes.map(([k, node]) =>
        {
            // Generate variable name
            const base_name = clean_key(node.class_type);
            let var_name = `${base_name}${k}`;

            placeholders.set(k, {
                name: var_name,
                type: all_nodes[base_name]
            });

            imports.add(base_name);

            let param_str = Object.entries(node.inputs)
            .map(([k, v]) => `\n\t${k}: ${get_value(v)}`)
            .join(',');

            if(param_str.length > 0)
                param_str += "\n";

            return `const ${var_name} = new ${node.class_type}({${param_str}});`
        });

    }
    // or is it a legacy/ui workflow?
    else
    {
        const nodes = (workflow as JSON_Workflow).nodes.filter((v)=>!IGNORE_NODES.has(v.type));

        // Comfy does the dependency sorting for us. But it won't store them in the correct order for some reason.
        nodes.sort((a, b) => a.order - b.order);

        if (!check_if_nodes_installed(nodes.map(node => node.type)))
            return;

        ensure_directory(path.dirname(output_path));

        // Phase 1: Create link mapping and variable names
        const link_map = new Map<number, { node_id: number; output_name: string }>();
        const node_vars = new Map<number, string>();
        const used_names = new Set<string>();

        // Create link map and variable names.
        // (The ids are not in order)
        nodes.forEach(node =>
        {
            // Create link map entries for outputs.
            node.outputs.forEach(output =>
            {
                output.links?.forEach(linkId =>
                {
                    link_map.set(linkId, { node_id: node.id, output_name: output.name });
                });
            });

            // Generate variable name
            const base_name = clean_key(node.type);
            let var_name = `${base_name}${node.id}`;
            let counter = 1;
            while (used_names.has(var_name))
            {
                var_name = `${base_name}${node.id}_${counter++}`;
            }
            used_names.add(var_name);
            node_vars.set(node.id, var_name);
        });

        // Generate code for each node
        nodes.forEach(node =>
        {
            const class_name = node.type;
            const var_name = node_vars.get(node.id)!;
            imports.add(class_name);

            const params: Record<string, string> = {};

            const nodeType = all_nodes[class_name];

            // All inputs the base Node Class contains.
            let all_inputs = [...(nodeType.input_order?.required ?? {}), ...(nodeType.input_order?.optional ?? [])];

            // Remember which inputs were connected to sockets via the instance's inputs array.
            // What remains will be filled with widget values.
            const possible_inputs = new Set(all_inputs)


            // Process inputs
            node.inputs.forEach(input =>
            {
                if (!possible_inputs.has(input.name))
                {
                    console.error(`Failed Sanity Check! Node ${class_name} does not have an input named ${input.name}. Make sure your imports are up to date!`);
                }
                possible_inputs.delete(input.name);
                console.log("Checking ", input)
                if ((input.link !== undefined) && (input.link !== null))
                {
                    // Handle linked input.
                    const source = link_map.get(input.link);
                    if (!source){
                        console.log("No source");
                        return;
                    }
                    const sourceVar = node_vars.get(source.node_id)!;
                    params[input.name] = `${sourceVar}.outputs.${source.output_name}`;
                }
            });


            // Put the remaining inputs in the correct order.
            const remaining_inputs = all_inputs.filter((k) => possible_inputs.has(k));

            // Handle remaining widget values for nodes with no inputs.
            // Handle the seed special case, which creates TWO widgets even though it's just an INT.
            let offset = 0;
            let skip_next = false;
            if (node.widgets_values)
                node.widgets_values.forEach((value, index) =>
                {
                    // previous one was seed, this one is seed incrementor, we skip.
                    if (skip_next)
                    {
                        skip_next = false;
                        return;
                    }
                    params[`${remaining_inputs[index - offset]}`] = JSON.stringify(value);
                    if (remaining_inputs[index]?.toLowerCase().endsWith('seed'))
                    {
                        offset++;
                        skip_next = true;
                    }
                });

            // Create parameter string.
            let paramStr = Object.entries(params)
                .map(([k, v]) => `\n\t${k}: ${v}`)
                .join(',');

            if(paramStr.length > 0)
                paramStr += "\n";

            node_creations.push(`const ${var_name} = new ${class_name}({ ${paramStr} });`);
        });
    }

    // Generate imports
    const import_statements = Array.from(imports)
        .map(cls => `import { ${cls} } from "${get_node_path(imports_path, all_nodes[cls])}";`)
        .join('\n');


    const result = full_workflow ?
        `${import_statements}
import { ComfyInterface, ComfyNode } from "comfy-code";

const comfy = new ComfyInterface('${URL}:${PORT}');

const activeGroup = ComfyNode.newActiveGroup();

${node_creations.join('\n')}

comfy.executePrompt(activeGroup, "print").then(comfy.quit.bind(comfy));`
        : `${import_statements}\n\n${node_creations.join('\n')}`;

    console.log(result);

    if(!override)
        write_file_with_confirmation(output_path, result, true);
    else
    {
        fs.writeFileSync(output_path, result);
        console.log(`File "${output_path}" has been created.`);
    }
}

run().catch(console.error);
