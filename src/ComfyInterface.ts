import { randomUUID } from "node:crypto";
import { ComfyNode } from "./ComfyNode.js";
import type { JSON_ComfyGraph, JSON_ComfyNodeTypes, JSON_History, JSON_HistoryEntry, JSON_PromptReturn, JSON_Queue, JSON_SystemStats } from "./JsonTypes.js";
import EventEmitter from 'node:events';

const DEBUG = false;

interface StatusEventArg
{
    status: {
        exec_info: {
            queue_remaining: 0
        }
    },
    sid?: string // only in the first message I think
};

interface ProgressEventArg
{
    value: number; // incrementing integer
    max: number; // int
    prompt_id: string; // uuid
    node: null; // probably only a thing in the ui?
};

interface ComfyWebsocketEvents
{
    message: [StatusEventArg | ProgressEventArg];
    status: [StatusEventArg];
    progress: [ProgressEventArg];
}

export class ComfyWebsocketInstance
{
    readonly socket: WebSocket;

    events = new EventEmitter<ComfyWebsocketEvents>();

    private constructor(socket: WebSocket)
    {
        this.socket = socket;
    }

    static async connect(url: string = "ws://localhost:8188/")
    {
        if (!url.endsWith('/'))
            url += "/";

        // Creates a new WebSocket connection to the specified URL.
        const socket = new WebSocket(url + `ws?clientId=${randomUUID()}`);

        const result = new ComfyWebsocketInstance(socket);

        let { promise, reject, resolve } = Promise.withResolvers<void>();

        // Executes when the connection is successfully established.
        socket.addEventListener('open', event =>
        {
            if (DEBUG)
                console.log('WebSocket connection established!');
            resolve();
        });

        // Listen for messages and executes when a message is received from the server.
        socket.addEventListener('message', event =>
        {
            if (DEBUG)
                console.log('Message from server: ', event.data);

            const data = JSON.parse(event.data);

            result.events.emit('message', data);
            result.events.emit(data.type, data.data);
        });

        // Executes when the connection is closed, providing the close code and reason.
        socket.addEventListener('close', event =>
        {
            if (DEBUG)
                console.log('WebSocket connection closed:', event.code, event.reason);
        });

        // Executes if an error occurs during the WebSocket communication.
        socket.addEventListener('error', error =>
        {
            console.error('WebSocket error:', error);
        });

        // Wait for the connection to be established
        await promise;

        return result;
    }
}

export class ComfyInterface
{
    readonly url: string;

    _ws?: ComfyWebsocketInstance;

    constructor(url: string = "http://localhost:8188")
    {
        if (url.endsWith("/"))
        {
            url = url.slice(0, url.length - 1);
        }
        this.url = url;
    }

    async testWS()
    {
        // node figures out the ws protocol itself. TODO : Check ws through https.
        this._ws = await ComfyWebsocketInstance.connect(/*this.url.replace(/^https?/,'ws')*/this.url)
    }

    private async getJson(endpoint: string): Promise<any>
    {
        const response = await fetch(`${this.url}${endpoint}`);
        return await response.json();
    }

    private async postJson(endpoint: string, data: any): Promise<any>
    {
        return (await this.post(endpoint, data)).json();
    }

    private async post(endpoint: string, data: any): Promise<Response>
    {
        return await fetch(`${this.url}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    }

    private async postFormData(endpoint: string, formData: FormData): Promise<any>
    {
        const response = await fetch(`${this.url}${endpoint}`, {
            method: 'POST',
            body: formData,
        });
        return await response.json();
    }

    /**
     * Fetch the Node Definition data for all node types
     */
    async fetchNodes(): Promise<JSON_ComfyNodeTypes>
    {
        return this.getJson('/object_info');
    }

    /**
     * Get queue history
     */
    async getHistory(): Promise<JSON_History>
    {
        return this.getJson('/history');
    }

    /**
     * Get specific history entry by ID
     */
    async getHistoryItem(id: string): Promise<JSON_HistoryEntry>
    {
        return Object.values(await this.getJson(`/history/${id}`))[0] as JSON_HistoryEntry;
    }

    /**
     * Get image by filename
     */
    async getImage(filename: string, type: "input" | "output", subfolder = ""): Promise<Blob>
    {
        const response = await fetch(`${this.url}/view?filename=${encodeURIComponent(filename)}&type=${type}&subfolder=${subfolder}`);
        return await response.blob();
    }

    /**
     * Get list of extensions
     */
    async getExtensions(): Promise<string[]>
    {
        return this.getJson('/extensions');
    }

    /**
     * Get list of embeddings
     */
    async getEmbeddings(): Promise<string[]>
    {
        return this.getJson('/embeddings');
    }

    /**
     * Get current queue
     */
    async getQueue(): Promise<JSON_Queue>
    {
        return this.getJson('/queue');
    }

    /**
     * Get system statistics
     */
    async getSystemStats(): Promise<JSON_SystemStats>
    {
        return this.getJson('/system_stats');
    }

    /**
     * Turns an array of connected Comfy Nodes into a form which can be sent to comfyui via the api.
     * @param nodes
     * @returns 
     */
    generate_json_prompt(nodes: ComfyNode[]): JSON_ComfyGraph
    {
        return Object.fromEntries(nodes.map(x => [x.id, x.to_json()]))
    }

    /**
     * Execute a prompt
     * @param prompt The prompt data to execute.
     * @param wait Wait until the prompt is done.
     */
    async executePrompt(nodes: ComfyNode[], wait : boolean | 'print' = false): Promise<JSON_PromptReturn>
    {


        if (wait)
        {
            if (!this._ws)
                await this.testWS();

            const ws = this._ws!;

            let result = await this.postJson('/prompt', { prompt: this.generate_json_prompt(nodes) }) as JSON_PromptReturn;

            const { promise, resolve, reject } = Promise.withResolvers<void>();

            function unsubscribe()
            {
                ws.events.off("progress", on_progress);
                ws.events.off("status", on_status);
            }

            function on_progress(data: ProgressEventArg)
            {
                if (result.prompt_id === data.prompt_id)
                {
                    if(wait === 'print')
                    {
                        console.log(`${((data.value / data.max) * 100).toFixed(2)}% - ${data.value} / ${data.max}` )
                    }
                    // TODO : 
                }
            }

            const self = this;
            async function on_status(data: StatusEventArg)
            {
                // we can't trust status or progress when it comes to duplicate prompts which
                // comfy will instantly return the cache of.
                let hist = await self.getHistoryItem(result.prompt_id)
                
                if (hist?.status.completed)
                {
                    unsubscribe();
                    resolve();
                }
            }

            ws.events.on("progress", on_progress);
            ws.events.on("status", on_status);



            await promise;

            return result;
        }

        return await this.postJson('/prompt', { prompt: this.generate_json_prompt(nodes) }) as JSON_PromptReturn;


    }

    /**
     * Interrupt current execution
     */
    async interrupt(): Promise<void>
    {
        await this.post('/interrupt', {});
    }

    /**
     * Clear queue
     */
    async clearQueue(): Promise<void>
    {
        await this.post('/queue', { clear: true });
    }

    /**
     * Delete items from queue
     * @param ids Array of queue item IDs to delete
     */
    async deleteQueueItems(ids: number[]): Promise<void>
    {
        await this.postJson('/queue', { delete: ids });
    }

    /**
     * Clear history
     */
    async clearHistory(): Promise<void>
    {
        await this.post('/history', { clear: true });
    }

    /**
     * Delete items from history
     * @param ids Array of history item IDs to delete
     */
    async deleteHistoryItems(ids: number[]): Promise<void>
    {
        await this.postJson('/history', { delete: ids });
    }

    /**
     * Upload an image
     * @param image File, Blob, Buffer, or string path containing the image
     * @param type 'image' or 'mask'
     */
    async uploadImage(
        image: File | Blob | Buffer | string,
        type: 'image' | 'mask' = 'image'
    ): Promise<{ name: string, subfolder: string, type: 'input' | 'output' }>
    {
        const formData = new FormData();
        let imageData: Blob | File;

        if (typeof image === 'string')
        {
            // Handle file path string
            if (typeof window === 'undefined')
            {
                // Node.js environment
                const fs = await import('fs');
                const { promisify } = await import('util');
                const readFile = promisify(fs.readFile);
                const buffer = await readFile(image);
                imageData = new Blob([buffer]);
            } else
            {
                // Browser environment - string is treated as a URL
                const response = await fetch(image);
                if (!response.ok) throw new Error(`Failed to fetch image from ${image}`);
                imageData = await response.blob();
            }
        } else if (image instanceof Buffer)
        {
            // Handle Buffer (Node.js)
            imageData = new Blob([image]);
        } else
        {
            // Handle File or Blob directly
            imageData = image as File | Blob;
        }

        formData.append(type, imageData);
        return this.postFormData(`/upload/${type}`, formData);
    }
}