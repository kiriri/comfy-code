A minimal project to run comfy-node with.

First install the dependencies using `npm i` while in this directory.

Then run `npx comfy-code import nodes` while ComfyUI is running. This will download the type information from your comfy-ui instance.
You will need to run this command every time you install new Nodes in ComfyUI.

This should have created an `imports` folder in your current directory, which contains classes for each and every node in Comfy.  

By default comfy-code will expect your server to run on `http://127.0.0.1:8188`.  
If you use different settings, check `npx comfy-code import nodes --help` for options.

Next we need a project to run. I exported a json file from ComfyUI by clicking on the Comfy Logo in the top left, going to File->Export(API) and I then saved the resulting file in the local `workflows/` directory. You add your own workflow if you like, or carry on with the one I provided.

Let's turn this json file into an actual typescript script!

```bash
npx comfy-code import workflow -i ./workflows/SimplestWorkflow.json -f -o ./src/test.ts
```

This command takes any workflow file, whether a json or an image containing the workflow, and turns it into a typescript script. You should now have a file under `./src/test.ts`. 

Open the script and replace "Stable-diffusion/sd_xl_base_1.0.safetensors" with your own model. You should get autocomplete, if not at first, then delete the " marks and recreate them.

All that's left is to save and run this file. You can run it either using `ts-node`, which this project installed already for you, or with a node version of 24 or later.

**ts-node**
```bash
npx ts-node ./src/test.ts 
```

**node@24+**
```bash
node ./src/test.ts 
```