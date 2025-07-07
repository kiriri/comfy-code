#!/usr/bin/env -S node --no-warnings

import fs from 'fs';
import path from 'path';
import { Command } from 'commander';
import { ComfyInterface } from '../dist/ComfyInterface.js';
import { clean_key as get_clean_key, ensure_directory, get_node_path, unimportant, success, sha256sum, warning } from './shared';
import { error } from 'console';
import ReadLine from 'readline';
import { rejects } from 'assert';

export const import_nodes_command = new Command('nodes')
    .description('Import and transform all nodes from the API to a local directory as typescript classes.\nYou need those to write any code using comfy-code.\nMake sure to rerun this command every time your ComfyUI changes, for example when you install or update nodes.\nThis command will not delete files in the target directory, but it will replace them if necessary.\nIf you find yourself with deprecated classes for nodes you have since uninstalled, you can delete the imports folder and run this command again for a fresh import.')
    .option('-p, --port <number>', 'Port number', '8188')
    .option('-u, --url <string>', 'Server URL', 'http://127.0.0.1')
    .option('-o, --output <path>', 'Output directory', './imports/')
    .option('-y, --override', 'Override all existing files imported files.', false)
    .action(run_import_nodes);

export async function run_import_nodes(options)
{
    

    console.log(unimportant(JSON.stringify(options, undefined, 2)));

    const PORT = options.port;
    const URL = options.url;
    const output_path = options.output;
    let override = options.override;

    console.log(`Server URL: ${URL}`);
    console.log(`Port: ${PORT}`);
    console.log(`Output path: ${output_path}`);

    const comfy = new ComfyInterface(`${URL}:${PORT}`);
    const res = await comfy.getNodeTypes();

    if (!fs.existsSync(output_path))
    {
        const rl = ReadLine.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        await new Promise<void>((resolve, reject) =>
        {
            rl.question(warning(`Directory "${output_path}" does not exist. Would you like to create it? (Y/n)`), (answer) =>
            {
                rl.close();

                if(answer.toLowerCase() === "n")
                    process.exit();

                fs.mkdirSync(output_path);
                console.log(success(`Directory "${output_path}" has been created.`));

                resolve();
            });
        });
    }



    /**
     * Recursively scans a directory and returns a Map of relative file paths to their SHA-256 hashes
     * @param dirPath The directory path to scan
     * @param relativePath Internal use for recursion - tracks relative path from original dir
     * @returns Promise<Map<string, string>> Map of relative paths to their SHA-256 hashes
     */
    async function generate_real_index(
        dirPath: string,
        relativePath: string = ''
    ): Promise<Map<string, string>>
    {
        const result = new Map<string, string>();
        const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });

        for (const entry of entries)
        {
            const fullPath = path.join(dirPath, entry.name);
            const currentRelativePath = path.join(relativePath, entry.name);

            if (entry.isDirectory())
            {
                // Recursively process directories
                const subDirResults = await generate_real_index(fullPath, currentRelativePath);
                subDirResults.forEach((hash, filePath) => result.set(filePath, hash));
            }
            else if (entry.isFile())
            {
                // Calculate hash for files
                try
                {
                    const hash = await sha256sum({ filename: fullPath });
                    result.set(currentRelativePath, hash);
                }
                catch (error)
                {
                    result.set(currentRelativePath, "NULL");
                }
            }
            // Note: Symlinks and other special files are ignored
        }

        return result;
    }

    // Hashes of what's actually inside the output directory
    const real_current_index = await generate_real_index(output_path);

    // Any previous import will save the sha hashes of each file in an index.
    // That way we can determine if the file has been modified by the user.
    // Unmodified files can be deleted without asking first.
    let stored_old_index: Map<string, string> | null = null;

    try
    {
        let old_index_data = fs.readFileSync(path.join(output_path, "index.json"), { encoding: "utf-8" });
        stored_old_index = new Map(Object.entries(JSON.parse(old_index_data)));
    }
    catch (e) { };

    // The user manually declared these files to NOT be overridden.
    // These are user modified files.
    const locked_files = new Map<string, boolean>();

    if (stored_old_index)
    {
        for (let [expected_file, expected_hash] of stored_old_index)
        {
            if (!real_current_index.has(expected_file))
                continue;

            const real_old_hash = real_current_index.get(expected_file);

            // "NULL" means it no longer exists.
            if (real_old_hash == "NULL")
            {
                continue;
            }

            if (
                // if any and all files should be overridden, just delete them and recreate them later
                !override
                // Otherwise check if the stored hash is the same as the real file's hash
                && real_old_hash !== expected_hash
            )
            {




                await new Promise<void>((resolve, reject) =>
                {
                    const rl = ReadLine.createInterface({
                        input: process.stdin,
                        output: process.stdout
                    });
                    rl.question(warning(`File "${expected_file}" was manually changed since the last import. Should this importer delete or override it? (Y/n/y!)`), (answer) =>
                    {
                        rl.close();

                        if (answer.toLowerCase() === "y!")
                        {
                            override = true;
                            answer = "y";
                        }

                        if (answer === "")
                            answer = "y";

                        if (answer.toLowerCase() === 'y')
                        {
                            fs.rmSync(path.join(output_path, expected_file));
                            console.log(success(`File "${path.join(output_path, expected_file)}" has been discarded.`));
                        }
                        else
                        {
                            locked_files.set(path.join(output_path, expected_file), true);
                            console.log(error(`File "${path.join(output_path, expected_file)}" will not be imported.`));
                        }

                        resolve();
                    });
                });
            }
            else
            {
                // Delete the old indexed file if it's unchanged (so uninstalled nodes will have their files removed.)
                try
                {
                    fs.rmSync(path.join(output_path, expected_file));
                    console.log(success(`Changes in "${path.join(output_path, expected_file)}" have been discarded.`));
                }
                catch (e) { }
            }
        }
    }






    const new_index = new Map<string, string>(); // hash index.

    for (let key in res)
    {
        const v = res[key];

        const clean_key = get_clean_key(key);

        let full_path = get_node_path(output_path, v);
        let relative_path = path.relative(output_path, full_path);

        // Check if the user said not to override these files.
        if (locked_files.has(full_path))
        {
            // keep the old (incorrect/modified) hash so the importer asks again the next time it is run.
            new_index.set(
                relative_path,
                stored_old_index!.get(relative_path)!
            );
            continue;
        }

        const outputs = v.output.map((x, i) =>
        {
            return {
                type: x,
                label: v.output_name[i],
                is_list: v.output_is_list[i]
            }
        });


        const inputs = (
            [
                ...Object.entries(v.input.required ?? {}).map(v => [...v, true]),
                ...Object.entries(v.input.optional ?? {}).map(v => [...v, false])
            ]).map(([k, opts, required]) =>
            {
                if (typeof opts === "string")
                {
                    return {
                        name: k as string,
                        type: opts,
                        required
                    }
                }

                else if (Array.isArray(opts))
                {
                    if (opts.length === 0)
                    {
                        return {
                            name: k as string,
                            type: k as string,
                            required
                        }
                    }

                    const is_enum = Array.isArray(opts[0]);

                    if (opts.length === 1)
                    {
                        return {
                            name: k as string,
                            type: opts[0],
                            required: is_enum ? false : required
                        }
                    }

                    if (opts.length > 1)
                    {
                        return {
                            name: k as string,
                            type: opts[0],
                            ...opts[1],
                            required: is_enum ? false : ("default" in opts[1] ? false : required),
                        }
                    }
                }

                console.log(opts);
                throw new Error("wtf");
            });

        try
        {

            function output_to_type(x)
            {
                let type: string;
                if (typeof x.type === "string")
                {
                    type = "'" + x.type.replace("\'", "\\\'") + "'";
                }
                // It's an enum array
                else
                {
                    type = (x.type as string[]).map(x => "'" + x.replace("\'", "\\\'") + "'").join(" | ");
                }
                return type;
            }

            function input_to_type(x: typeof inputs[number])
            {
                let _type = x.type;

                let type: string;
                if (typeof _type === "string")
                {
                    if (_type === "TEXT" || _type === "STRING")
                        type = "string";
                    else if (_type === "BOOLEAN")
                        type = "boolean";
                    else if (_type === "NUMBER" || _type === "INTEGER" || _type === "FLOAT" || _type === "INT")
                        type = "number";
                    else
                        type = "'" + _type.replace("\'", "\\\'") + "'";
                }
                // It's an enum array
                else
                {

                    if (_type.length === 0)
                    {
                        type = "any";
                    }
                    else
                        type = _type.map(x =>
                        {
                            if (typeof x === "string")
                            {
                                if (x === "TEXT" || x === "STRING")
                                    return "string";
                                return "'" + x.replace("\'", "\\\'") + "'";
                            }
                            else if (typeof x === "number")
                                return x.toString();
                            else
                                return "any";
                        }).join(" | ");

                }
                return type;
            }

            const outputs_str = outputs.length > 0 ? `Object.fromEntries(this._outputs.map((x, i) => [x.label, x])) as {
        ${outputs.map(x => x.label + ": ComfyOutput<" + output_to_type(x) + ">").join(",\n")}
    }` : `{}`;

            const full_output = `
import { ComfyNode, ComfyOutput, ComfyInput } from 'comfy-code';            
            
export class ${clean_key} extends ComfyNode
{
    classType = '${key.replace("\'", "\\\'")}';

    _outputs = [
    ${outputs.map((x, i) =>
            {


                return `new ComfyOutput<${output_to_type(x)}>(this, ${i}, "${x.label.replace("\'", "\\\'")}")`;
            }).join(',\n')}
    ] as const;

    outputs = ${outputs_str};

    _inputs = [
    ${inputs.map((x, i) =>
            {
                return `new ComfyInput<${input_to_type(x)}>(this, ${i}, "${(x.name as string).replace("\'", "\\\'")}" ${'default' in x ? `, ${JSON.stringify(x.default)}` : Array.isArray(x.type) ? `, ${JSON.stringify(x.type[0])}` : ""})`;
            }).join(',\n')}
    ] as const;

    inputs = Object.fromEntries(this._inputs.map((x, i) => [x.label, x])) as {
        ${inputs.map(x => `"${x.name}"` + ": ComfyInput<" + input_to_type(x) + ">").join(",\n")}
    };
    
    constructor(initial_values?: {${inputs.map(x => `"${x.name}"` + (!x.required ? "?" : "") + ": ComfyOutput<" + input_to_type(x) + "> | " + input_to_type(x)).join(",\n")}})
    {
        super();
        this.initialize(initial_values);
    }
}
`;

            fs.writeFileSync(full_path, full_output);

            // console.log(path.relative(output_path, full_path));
            new_index.set(path.relative(output_path, full_path), await sha256sum({ value: full_output }));
        }
        catch (e)
        {
            console.log(key);
            console.log(v.input.required);
            console.log(error("Uncaught error, see above."))
            throw e;
        }
    }


    console.log(success(`Created all ${Object.keys(res).length} classes.`))
    fs.writeFileSync(path.join(output_path, "index.json"), JSON.stringify(Object.fromEntries(new_index.entries())));
}

// if(require.main === module)
// {
//     run_import_nodes(import_nodes_command.parse().options)
// }
