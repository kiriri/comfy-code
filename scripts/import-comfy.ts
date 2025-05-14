#!/usr/bin/env -S node --loader ts-node/esm --no-warnings

import fs from 'fs';
import path from 'path';
import { program } from 'commander';
import { ComfyInterface } from '../dist/ComfyInterface.js';
import { clean_key as get_clean_key, ensure_directory, get_node_path } from './shared.js';

async function run()
{
    program
        .option('-p, --port <number>', 'Port number', '8188')
        .option('-u, --url <string>', 'Server URL', 'http://127.0.0.1')
        .option('-o, --output <path>', 'Output directory', './imports/')
        .parse(process.argv);

    const options = program.opts();

    console.log(options);

    const PORT = options.port;
    const URL = options.url;
    const output_path = options.output;

    console.log(`Server URL: ${URL}`);
    console.log(`Port: ${PORT}`);
    console.log(`Output path: ${output_path}`);

    const comfy = new ComfyInterface(`${URL}:${PORT}`);
    const res = await comfy.fetchNodes();

    for (let key in res)
    {
        const v = res[key];

        const clean_key = get_clean_key(key);

        let full_path = get_node_path(output_path, v)   

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


            fs.writeFileSync(full_path, `
import { ComfyNode, ComfyOutput, ComfyInput } from 'comfy-code';            
            
export class ${clean_key} extends ComfyNode
{
    class_type = '${key.replace("\'", "\\\'")}';

    _outputs = [
    ${outputs.map((x, i) =>
            {


                return `new ComfyOutput<${output_to_type(x)}>(this, ${i}, "${x.label.replace("\'", "\\\'")}")`;
            }).join(',\n')}
    ] as const;

    outputs = Object.fromEntries(this._outputs.map((x, i) => [x.label, x])) as {
        ${outputs.map(x => x.label + ": ComfyOutput<" + output_to_type(x) + ">").join(",\n")}
    };

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
`);
        }
        catch (e)
        {
            console.log(key);
            console.log(v.input.required);
            throw e;
        }
    }


}

run()
