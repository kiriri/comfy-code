import { SaveImage } from "../imports/image/SaveImage";
import { CLIPTextEncode } from "../imports/conditioning/CLIPTextEncode";
import { CheckpointLoaderSimple } from "../imports/loaders/CheckpointLoaderSimple";
import { KSampler } from "../imports/sampling/KSampler";
import { ComfyInput, ComfyNode } from "../src/ComfyNode";
import { EmptyLatentImage } from "../imports/latent/EmptyLatentImage";
import { VAEDecode } from "../imports/latent/VAEDecode";
import { LoraLoader } from "../imports/loaders/LoraLoader";

import { ComfyInterface } from "comfy-code";
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
    const active_group = ComfyNode.new_active_group();

    const load_checkpoint = new CheckpointLoaderSimple({ ckpt_name });

    const text_encode_positive = new CLIPTextEncode({ text: prompt, clip: load_checkpoint.outputs.CLIP });
    const text_encode_negative = new CLIPTextEncode({ text: prompt_n, clip: load_checkpoint.outputs.CLIP });

    const empty_latent = new EmptyLatentImage({
        width,
        height,
    });

    const sampler = new KSampler({
        latent_image: empty_latent.outputs.LATENT,
        model: load_checkpoint.outputs.MODEL,
        positive: text_encode_positive.outputs.CONDITIONING,
        negative: text_encode_negative.outputs.CONDITIONING,
        // sampler_name: "euler_ancestral",
        // scheduler: "karras",
        steps
    });

    const vae_decode = new VAEDecode({
        samples:sampler.outputs.LATENT,
        vae:load_checkpoint.outputs.VAE
    });

    const save_image = new SaveImage({
        images:vae_decode.outputs.IMAGE
    });

    comfy.executePrompt(active_group);
}
