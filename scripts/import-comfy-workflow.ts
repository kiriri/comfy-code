#!/usr/bin/env -S node --loader ts-node/esm --no-warnings

import fs from 'fs';
import path from 'path';
import { program } from 'commander';
import { ComfyInterface } from '../dist/ComfyInterface.js';
import { clean_key, get_node_path, sortNodesTopologically } from './shared.js';
import type { JSON_ComfyNodeType, JSON_ValueRef, JSON_Workflow, JSON_Workflow_API } from '../dist/JsonTypes';


function ensure_directory(path: string)
{
    if (!fs.existsSync(path))
    {
        fs.mkdirSync(path, { recursive: true });
    }
}


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
        .parse(process.argv);

    const options = program.opts();

    console.log(options);

    const PORT: number = Number.parseInt(options.port);
    const URL: string = options.url;
    const output_path: string = options.output;
    const input_path: string = options.input;
    const imports_path: string = options.imports;
    const full_workflow: boolean = options.full;

    console.log(`Server URL: ${URL}`);
    console.log(`Port: ${PORT}`);
    console.log(`Output path: ${output_path}`);

    const comfy = new ComfyInterface(`${URL}:${PORT}`);
    const all_nodes = await comfy.fetchNodes();

    ///
    // Parse the workflow file
    ///

    const workflow: JSON_Workflow | JSON_Workflow_API = JSON.parse(fs.readFileSync(input_path, { encoding: "ascii" }));


    function check_if_nodes_installed(nodes: string[])
    {
        // Check if all nodes are installed
        const uninstalled_nodes = nodes.filter(node => !all_nodes[node]);

        if (uninstalled_nodes.length > 0)
        {
            console.log("ERROR: ");
            console.log("Some of the nodes in this workflow could not be found in your ComfyUI installation. Please make sure everything is installed and loaded correctly.");
            console.log([...new Set(uninstalled_nodes)].join(", "));
            return false;
        }

        return true;
    }

    // function generate_imports(nodes:string[])
    // {
    //         // Check if all nodes are installed
    //         const uninstalled_nodes = nodes.filter(node => !all_nodes[node]);

    //         if (uninstalled_nodes.length > 0)
    //         {
    //             console.log("ERROR: ");
    //             console.log("Some of the nodes in this workflow could not be found in your ComfyUI installation. Please make sure everything is installed and loaded correctly.");
    //             console.log([...new Set(uninstalled_nodes)].join(", "));
    //             return false;
    //         }

    //         return true;
    // }

    // All Node names this script will require.
    const imports = new Set<string>();
    // Individual node creation lines.
    let nodeCreations: string[] = [];


    // Is it an api workflow?
    if (!('version' in workflow))
    {
        // Sort the nodes such that no node is created before all the nodes it depends on were created.
        const sorting = sortNodesTopologically(workflow);

        const nodes = sorting.map(id=>[id,(workflow as JSON_Workflow_API)[id]] as const);

        if (!check_if_nodes_installed(nodes.map(([k, v]) => v.class_type)))
            return;

        // Create placeholder objects for each node.
        // This helps us get type info so we can resolve the name of the
        // output sockets.
        let placeholders = new Map<string, {
            name: string,
            type: JSON_ComfyNodeType
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
        

        nodeCreations = nodes.map(([k, node]) =>
        {
            // Generate variable name
            const baseName = clean_key(node.class_type);
            let varName = `${baseName}${k}`;

            placeholders.set(k, {
                name: varName,
                type: all_nodes[baseName]
            });

            imports.add(baseName);

            return `const ${varName} = new ${node.class_type}({\n${Object.entries(node.inputs).map(([k,v])=>k + ':' + get_value(v))}});`
        });

    }
    // or is it a legacy/ui workflow?
    else
    {
        const nodes = (workflow as JSON_Workflow).nodes;

        // Comfy does the dependency sorting for us. But it won't store them in the correct order for some reason.
        nodes.sort((a, b) => a.order - b.order);

        if (!check_if_nodes_installed(nodes.map(node => node.type)))
            return;

        ensure_directory(path.dirname(output_path));

        // Phase 1: Create link mapping and variable names
        const linkMap = new Map<number, { nodeId: number; outputName: string }>();
        const nodeVars = new Map<number, string>();
        const usedNames = new Set<string>();

        // Create link map and variable names.
        // (The ids are not in order)
        nodes.forEach(node =>
        {
            // Create link map entries for outputs.
            node.outputs.forEach(output =>
            {
                output.links?.forEach(linkId =>
                {
                    linkMap.set(linkId, { nodeId: node.id, outputName: output.name });
                });
            });

            // Generate variable name
            const baseName = clean_key(node.type);
            let varName = `${baseName}${node.id}`;
            let counter = 1;
            while (usedNames.has(varName))
            {
                varName = `${baseName}${node.id}_${counter++}`;
            }
            usedNames.add(varName);
            nodeVars.set(node.id, varName);
        });

        // Generate code for each node
        nodes.forEach(node =>
        {
            const className = node.type;
            const varName = nodeVars.get(node.id)!;
            imports.add(className);

            const params: Record<string, string> = {};

            const nodeType = all_nodes[className];

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
                    console.error(`Failed Sanity Check! Node ${className} does not have an input named ${input.name}. Make sure your imports are up to date!`);
                }
                possible_inputs.delete(input.name);
                console.log("Checking ", input)
                if ((input.link !== undefined) && (input.link !== null))
                {
                    // Handle linked input.
                    const source = linkMap.get(input.link);
                    if (!source){
                        console.log("No source");
                        return;
                    }
                    const sourceVar = nodeVars.get(source.nodeId)!;
                    params[input.name] = `${sourceVar}.outputs.${source.outputName}`;
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
            const paramStr = Object.entries(params)
                .map(([k, v]) => `${k}: ${v}`)
                .join(', ');

            nodeCreations.push(`const ${varName} = new ${className}({ ${paramStr} });`);
        });
    }

    // Generate imports
    const importStatements = Array.from(imports)
        .map(cls => `import { ${cls} } from "${get_node_path(imports_path, all_nodes[cls])}";`)
        .join('\n');


    const result = full_workflow ?
        `${importStatements}
import { ComfyInterface, ComfyNode } from "comfy-code";

const comfy = new ComfyInterface('${URL}:${PORT}');

const active_group = ComfyNode.new_active_group();

${nodeCreations.join('\n')}

comfy.executePrompt(active_group);`
        : `${importStatements}\n\n${nodeCreations.join('\n')}`;

    console.log(result);

    fs.writeFileSync(output_path, result);





}

run().catch(console.error);
