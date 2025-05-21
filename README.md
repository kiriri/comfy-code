

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

If you do not have tsx, ts-node and typescript installed globally, install them locally  

`npm i -D tsx typescript ts-node`

Make sure your ComfyUI Server instance is running.  
Then generate ComfyUI Typescript classes (you will need to run this command every time you install new Nodes in ComfyUI)  

```typescript
npx import-comfy
```

This should have created an `imports` folder in your current directory, which contains classes for each and every node in Comfy.  

By default comfy-code will expect your server to run on `http://127.0.0.1:8188`.  
If you use different settings, check `npx import-comfy --help` for options.



## Writing your first graph

(See the [examples](examples) folder in this repository for complete examples. The [t2i](examples/t2i.graph.ts) example is explained below)  
Use 

```typescript
const active_group = ComfyNode.new_active_group();
```

to get an array which will automatically store all subsequently created ComfyNodes.  
You can omit this if you want to keep track of all your nodes yourself.  

Start by creating a node which loads a checkpoint, like 

```typescript
const load_checkpoint = new CheckpointLoaderSimple({ ckpt_name:'checkpoint-name' });
```

. Your IDE should give you the ability to auto import the CheckpointLoaderSimple node from your imports folder. Otherwise you must do so manually like  
```typescript
import { CheckpointLoaderSimple } from "/imports/loaders/CheckpointLoaderSimple";
```

If everything works correctly, ckpt_name should have intellisense which reflects your currently installed models.  
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

Now all that's left is to run the script, which I use `tsx` for.  
Example:  
```typescript
npx tsx ./src/test.ts
```

And that's it. Your generated graph is being processed in Comfy.

## Importing an existing workflow

You can turn a json workflow file into a typescript script by using the `import-comfy-workflow` script. Both api exported workflow files and regular workflow files are supported, but the api version is preferred.  
Example:  

```bash
npx import-comfy-workflow -i ~/Downloads/Unsaved\ Workflow.json -f -o ./test/workflows/workflow.ts
```

Use the f flag to generate a script which will execute the graph as a prompt when run. Omit the f flag to just generate the graph.  
Use --help for more info.  

## Scope/Future of the project  
This is a side project. Pull requests that improve existing features will be merged. Bugs will be fixed, feature requests will likely be ignored.

I view the project in its current form as feature complete.
