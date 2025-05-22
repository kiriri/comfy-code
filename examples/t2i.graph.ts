import { SaveImage } from "../imports/image/SaveImage";
import { CLIPTextEncode } from "../imports/conditioning/CLIPTextEncode";
import { CheckpointLoaderSimple } from "../imports/loaders/CheckpointLoaderSimple";
import { KSampler } from "../imports/sampling/KSampler";
import { EmptyLatentImage } from "../imports/latent/EmptyLatentImage";
import { VAEDecode } from "../imports/latent/VAEDecode";
import { LoraLoader } from "../imports/loaders/LoraLoader";

import { ComfyInterface, ComfyInput, ComfyNode } from "comfy-code";
const comfy = new ComfyInterface('http://127.0.0.1:8188');

export type ExtractInputType<C extends ComfyInput<any>> = C extends ComfyInput<infer O> ? O : never;
export type T2I_Opts = {
    ckpt_name: ExtractInputType<CheckpointLoaderSimple["inputs"]["ckpt_name"]>,
    prompt: string,
    width?: number,
    height?: number,
    steps?: number,
    loras?: [LoraLoader["inputs"]["lora_name"]["type"], number][],
    prompt_n?: string
};

/**
 * Generates and runs a simple text-to-image graph.
 * @param param0 
 */
export async function run_t2i({
    steps = 20,
    width = 1024,
    height = 1024,
    ckpt_name,
    prompt,
    prompt_n = "",
}: T2I_Opts
)
{
    const activeGroup = ComfyNode.newActiveGroup();

    const loadCheckpoint = new CheckpointLoaderSimple({ ckpt_name });

    const textEncodePositive = new CLIPTextEncode({ text: prompt, clip: loadCheckpoint.outputs.CLIP });
    const textEncodeNegative = new CLIPTextEncode({ text: prompt_n, clip: loadCheckpoint.outputs.CLIP });

    const emptyLatent = new EmptyLatentImage({
        width,
        height,
    });

    const sampler = new KSampler({
        latent_image: emptyLatent.outputs.LATENT,
        model: loadCheckpoint.outputs.MODEL,
        positive: textEncodePositive.outputs.CONDITIONING,
        negative: textEncodeNegative.outputs.CONDITIONING,
        // sampler_name: "euler_ancestral",
        // scheduler: "karras",
        steps
    });

    const vaeDecode = new VAEDecode({
        samples:sampler.outputs.LATENT,
        vae:loadCheckpoint.outputs.VAE
    });

    const saveImage = new SaveImage({
        images:vaeDecode.outputs.IMAGE
    });

    comfy.executePrompt(activeGroup);
}
