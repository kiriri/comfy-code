import type { JSON_ComfyNode, JSON_ValueRef } from "./JsonTypes.js";

export class ComfyOutput<Type extends string | number | boolean>
{
    node: ComfyNode;
    index: number;
    label: string;
    // type: Type;

    // is_list: T;

    targets: ComfyInput<any>[] = [];

    constructor(
        node: ComfyNode,
        index: number,
        label: string
        // type: Type,
    ) {
        this.node = node;
        this.index = index;
        this.label = label;
        // this.type = type;
    }

    connect(target: ComfyInput<Type>)
    {
        target.connect(this);
    }
}

export class ComfyInput<Type extends string | number | boolean>
{
    node: ComfyNode;

    index: number;
    label: string;
    type!: Type; // this is just for easier type access
    // is_list: T;

    target!: ComfyOutput<any> | string | number;

    default?: string | number | boolean;

    constructor(
        node: ComfyNode,
        index: number,
        label: string,
        fallback?: string | number | boolean
        // type: Type
    ) {
            this.node = node;
            this.index = index;
            this.label = label;

            this.default = fallback;
            if(fallback !== undefined)
            {
                // console.log("Setting initial value to ", label, fallback)
                this.setValue(fallback);
            }

            // this.type = type;
    }

    disconnect() 
    {
        if(this.target && typeof this.target === "object")
        {
            this.target.targets = this.target.targets.filter(x => x !== this);
        }
        this.target = undefined as any;

        this.setValue(this.default);
    }

    connect(target: ComfyOutput<Type>)
    {
        if(this.target)
            this.disconnect();

        target.targets.push(this);

        this.target = target;

        this.node["#inputs"][this.label] = [
            target.node.id.toString(),
            target.index
        ];
    }

    setValue(value: any)
    {
        if(this.target)
            this.disconnect();

        this.node["#inputs"][this.label] = value;
    }
    
    
}


let active_group : ComfyNode[] = [];

export abstract class ComfyNode
{
    static idCounter = 0;
    id = ComfyNode.idCounter++;
    // The type of the node as found in 'GET /object_info' by key
    classType!: string;
    // All incoming connections
    ["#inputs"]: {
        [input_name: string|number]: JSON_ValueRef;
    } = {

    }

    abstract inputs: Partial<Record<string, ComfyInput<any>>>;
    abstract outputs: Partial<Record<string, ComfyOutput<any>>>;

    // outputs: {
    //     [output_name: string]: ComfyOutput;
    // }

    initialize(initial_values:any)
    {
        if(initial_values)
        {
            
            for(const [k, v] of Object.entries(initial_values))
            {
                if(v instanceof ComfyOutput)
                {
                    this.inputs![k]!.connect(v);
                }
                else
                    this.inputs![k]!.setValue(v);
            }
        }

        active_group.push(this);
    }


    toJson() : JSON_ComfyNode
    {
        return {
            class_type: this["classType"],
            inputs: this["#inputs"]
        }
    }

    static newActiveGroup()
    {
        active_group = [];
        return active_group;
    }

    static getActiveGroup() : ComfyNode[]
    {
        return active_group;
    }

}