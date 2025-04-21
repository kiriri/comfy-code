

<div style="display:flex; justify-content:start; align-items:center; gap:16px;">
    <img src="processed-icon.png" alt="alt text" width="200"/> 
    <div>
    <h1>
        Comfy-Code
    </h1>
        <h2>
        A simple framework for generating and running comfy graphs from typescript.
    </h2>
    <h3>
        Fully typed nodes. Write entire comfy graphs without ever having to open the ComfyUI Web Interface. 
    </h3>
    </div>
</div>

## Getting started
This project requires node version 23 or newer!  

`npm i comfy-code`  

Make sure your ComfyUI Server instance is running.  
Then generate ComfyUI Typescript classes (you will need to run this command every time you install new Nodes in ComfyUI)  

By default comfy-code will expect your server to run on `http://127.0.0.1:8188`.  
If you use different settings, check `npx import-comfy --help` for options.



## Writing your first graph

(See the [examples](examples) folder in this repository for complete examples. The [t2i](examples/t2i.graph.ts) example is explained below)  
Use 

```typescript
const active_group = ComfyNode.new_active_group();
```

to get an array which will automatically store all subsequently created ComfyNodes.  
Then start by creating a node which loads a checkpoint, like 

```typescript
const load_checkpoint = new CheckpointLoaderSimple({ ckpt_name:'checkpoint-name' });
```

. If everything works correctly, ckpt_name should have intellisense which reflects your currently installed models.  
When you create a Node like that, the arguments represent the incoming connections into that node. They can be either primitive values or references to outputs of other nodes.  
Let's create our clip text encoder nodes next:  

```typescript
const text_encode_positive = new CLIPTextEncode({ text: "positive prompt", clip: load_checkpoint.outputs.CLIP });
const text_encode_negative = new CLIPTextEncode({ text: "negative prompt", clip: load_checkpoint.outputs.CLIP });
```

Here we used primitive string values for the prompt's text, but we connected the clip input to the clip output of the load checkpoint node we created earlier.  
Another more explicit way to create connections would be 

```typescript 
load_checkpoint.outputs.clip.connect(text_encode_positive.inputs.clip);
``` 

The rest is just more of the same. We create EmptyLatentImage, KSampler, VAEDecode and SaveImage nodes and hook their sockets up to one another. Because this is javascript, we can use if clauses or for loops to build a more dynamic graph much more quickly than in ComfyUI's Web-UI.  

And at the end of this all, our `active_group` array will have automatically stored all Nodes, and we can test it in ComfyUI.
For this we need to create a ComfyInterface instance

```typescript
const comfy = new ComfyInterface('http://127.0.0.1:8188');
```

This ComfyInterface exposes all API routes which ComfyUI makes available to us.  
In this case we want to run our graph, so we call

```typescript
const promptResult = await comfy.executePrompt(active_group);
```

And that's it. Your generated graph is being processed in Comfy.

## Scope/Future of the project  
This is a side project. Pull requests that improve existing features will be merged. Bugs will be fixed, feature requests will likely be ignored.

Having said that, one feature I would like to implement when I find the time is a Workflow to Typescript command line tool, which takes an image or json and turns it into comfy-code typescript.
Another feature I would like is websocket integration into ComfyInterface.  

Other than that I view the project as feature complete.