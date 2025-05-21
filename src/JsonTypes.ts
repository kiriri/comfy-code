// This is what apis like "prompt" expect.
export type JSON_ComfyGraph = {
    [uid: string | number]: JSON_ComfyNode
}

// A node instance.
export type JSON_ComfyNode = {
    // The type of the node as found in 'GET /object_info' by key
    class_type: string;
    // All incoming connections
    inputs: {
        [input_name: string]: JSON_ValueRef;
    }
}


// This is what a legacy workflow file contains
export type JSON_Workflow = {
    id: string,
    revision: number;
    last_node_id: number;
    last_link_id: number;
    nodes: {
        id: number;
        type: string;
        pos: [x: number, y: number];
        size: [width: number, height: number];
        flags: {};
        order: number;
        mode: number;
        inputs: Array<{ name: string; type: string; link?: number, shape?: number }>;
        outputs: Array<{ name: string; type: string; links?: number[], slot_index?: number, shape?: number }>;
        properties: {
            cnr_id?: string;
            aux_id?: string;
            ver: string; // major.minor.patch
            "Node name for S&R": string;
        }
        widgets_values: any[];
        color: string; // hex
        bgcolor: string; // hex
    }[],
    links: [x0: number, y0: number, x1: number, y1: number, some_id: number, socket_type: string],
    groups: {
        id: number;
        title: string;
        bounding: [x: number, y: number, width: number, height: number];
        color: string; // hex
        font_size: number;
        flags: {};
    }[],
    config: {},
    extra: {
        ds: {
            scale: number, // semi normalized
            offset: [
                x: number,
                y: number
            ]
        },
        frontendVersion: string, // major.minor.patch
        VHS_latentpreview: boolean,
        VHS_latentpreviewrate: number,
        VHS_MetadataImage: boolean,
        VHS_KeepIntermediate: boolean
    },
    version: number // major.minor
}

// And this is what the new api workflow file looks like.
export type JSON_Workflow_API = Record<string, JSON_ComfyNode & {
    _meta: {
        title: string
    }
}>


// Any value that can is passed into a ComfyNode
// This can be either an atomic value, like a string or a number, or a reference to another node's output.
export type JSON_ValueRef = [target_node_uid: string, output_socket_index: number] | string | number | boolean


// All possible input/output types. This type is incomplete.
// string[] represents an enum dropdown.
export type JSON_ComfyPrimitive = "MODEL" | "CLIP" | "STYLE_MODEL" | "CLIP_VISION_OUTPUT" | "CONTROL_NET" | "UPSCALE_MODEL" | "CLIP_VISION" | "VAE" | "LATENT" | "INT" | "FLOAT" | "IMAGE" | "TEXT" | "CONDITIONING" | "EXTRA_PNGINFO" | "MASK" | string[];

// Some types accept options like restrictions or special ui operations. So they are wrapped in an array of type + options
export type JSON_ComfyPrimitiveDeclaration =
    // An empty array means the name of the output/input is the same as the type. Case insensitive. Eg an output named 'latent' defaults to type "LATENT".
    []
    | [JSON_ComfyPrimitive]
    | [
        "INT" | "FLOAT" | number[],
        {
            default?: number,
            min?: number,
            max?: number,
            step?: number,
            round?: number;
            control_after_generate?: true; // terrible border case. Any input that ends with 'seed' and has this field will have an extra widget after the seed int widget. 
        }
    ]
    | [
        "TEXT" | string[],
        {
            multiline?: boolean,
            default?: string
        }
    ]
    | [
        "IMAGE" | string[],
        {
            image_upload?: boolean,
            default?: string
        }
    ]

// This is what apis like "object_info" return.
export type JSON_ComfyNodeTypes = {
    [key: string]: {
        // This is what creates the submenus in the context menu.
        category: string,
        // Verbal description of the node for use in the ui.
        description: string,
        // The name which should be displayed in the editor.
        display_name: string,
        input: {
            // List of all input types
            required: {
                [name: string]: JSON_ComfyPrimitiveDeclaration
            },
            optional: {
                [name: string]: JSON_ComfyPrimitiveDeclaration
            },
            hidden: {
                [name: string]: JSON_ComfyPrimitiveDeclaration
            }
        },
        input_order: {
            required: string[];
            optional?: string[];
            hidden?: string[];
        },
        // Unique name
        name: string,
        // Unique names of all the outputs
        output: string[],
        // Is the output a list?
        output_is_list: boolean[],
        // Labels of all the outputs
        output_name: string[],
        // Is this node an output? Useful for evaluating if a graph is valid.
        output_node: boolean;
        python_module: 'nodes';
    }
}

// This is what apis like "history" return.
export type JSON_History = {
    [uid: string]: JSON_HistoryEntry;
}

export type JSON_HistoryEntry = {
    prompt: JSON_QueueItem;
    outputs: {
        [output_node_id: string]:
        {
            images: JSON_ImageReference[];
        }
    };
    status: {
        status_str: 'success' | string, // incomplete
        completed: boolean,
        messages: Array<unknown>[],
    },
    meta?:{
        [NodeId:string]:{
            node_id:string,
            display_node:string;
            parent_node:null;
            real_node_id: string;
        }
    }
}

export type JSON_ImageReference = {
    filename: string;
    subfolder: string;
    type: "output";
}

export type JSON_SystemStats = {
    system: {
        os: 'posix' | 'windows' | 'macos' | string, // linux is posix, windows/mac is guesswork 
        ram_total: number, // in bytes
        ram_free: number, // in bytes
        comfyui_version: string, // {major}.{minor}.{patch}
        python_version: string, // starts with {major}.{minor}.{patch} but continues with more specific info like compile date.
        pytorch_version: string, // Eg 2.6.0+cu126
        embedded_python: boolean,
        argv: string[]
    },
    devices: {
        name: string, // like 'cuda:0 NVIDIA GeForce RTX 3070 : cudaMallocAsync'
        type: 'cuda' | 'cpu' | string,
        index: number, // usually 0 unless you have multiple gpus/cpus
        vram_total: number,
        vram_free: number,
        torch_vram_total: number, // usually 0
        torch_vram_free: number // usually 0
    }[]
};

export type JSON_QueueItem = [
    counter: number,
    uid: string,
    nodes: JSON_ComfyGraph,
    no_idea: {
        extra_pnginfo: object, // ?
        client_id: string, // ?
    },
    outputs: string[] // output ids
];


export type JSON_Queue = {
    queue_running: JSON_QueueItem[],
    queue_pending: JSON_QueueItem[],
}

export type JSON_PromptReturn = {
    prompt_id: string, // uuid
    number: number,
    node_errors: object, // unknown
    error?:{
        type:"invalid_prompt" | (string & {}),
        message:string,
        details:string, // eg "Node ID '#0'"
        extra_info:object
    }
}

/**
 * The websocket sends these kinds of messages
 */
export type JSON_WS_Message =
    {
        type: "status",
        data: JSON_WS_Status
    }
    |
    {
        type: "progress",
        data: JSON_WS_Progress
    };

// What the websocket's status message contains
export interface JSON_WS_Status
{
    status: {
        exec_info: {
            queue_remaining: number
        }
    },
    sid?: string // only in the first message I think
};


// What the websocket's progress message contains
export interface JSON_WS_Progress
{
    value: number; // incrementing integer
    max: number; // int
    prompt_id: string; // uuid
    node: null; // probably only a thing in the ui?
};