import { ControlNetLoader } from "../imports/loaders/ControlNetLoader";
import { ControlNetApplyAdvanced } from "../imports/conditioning/controlnet/ControlNetApplyAdvanced";
import { SaveImage } from "../imports/image/SaveImage";

import { CLIPTextEncode } from "../imports/conditioning/CLIPTextEncode";
import { CheckpointLoaderSimple } from "../imports/loaders/CheckpointLoaderSimple";
import { KSampler } from "../imports/sampling/KSampler";
import { EmptyLatentImage } from "../imports/latent/EmptyLatentImage";
import { VAEDecode } from "../imports/latent/VAEDecode";
import { LoraLoader } from "../imports/loaders/LoraLoader";

import { Canny } from "../imports/image/preprocessors/Canny";
import { VAEEncode } from "../imports/latent/VAEEncode";
import { CLIPSetLastLayer } from "../imports/conditioning/CLIPSetLastLayer";

import { LoadImage } from "../imports/image/LoadImage";
import { ImageScale } from "../imports/image/upscaling/ImageScale";

import { ComfyInput, ComfyNode } from "comfy-code";


export type ExtractInputType<C extends ComfyInput<any>> = C extends ComfyInput<infer O> ? O : never;

export async function generate_graph( {
    depth = [
        {
            steps: 7,
            denoising: 0.6
        },
        {
            steps: 15,
            denoising: 0.6
        }
    ],
    width = (512 * 2.5),
    height = (512 * 1.5),
    loras = [],
    ckpt_name,
    prompt = "bottle, green, best quality ",
    prompt_n = "bad fingers",
    controlnet_adherence = 0.1,
    control_net_name = "diffusers_xl_canny_mid.safetensors",
    seed = Math.floor(Math.random() * 2 ** 32),
    base_image ,
    output_name = "output",

}: {
    depth?: {
        steps: number,
        denoising: number,
        cfg?: number,
        scheduler?: ExtractInputType<KSampler["inputs"]["scheduler"]>,
        sampler?: ExtractInputType<KSampler["inputs"]["sampler_name"]>,
        controlnet?: boolean,
        seed?: number
    }[],
    width: number,
    height: number,
    loras?: [LoraLoader["inputs"]["lora_name"]["type"], number][],
    ckpt_name: ExtractInputType<CheckpointLoaderSimple["inputs"]["ckpt_name"]>,
    prompt?: string,
    prompt_n?: string,
    controlnet_adherence?: number,
    control_net_name?: ExtractInputType<ControlNetLoader["inputs"]["control_net_name"]>,
    seed?: number,
    base_image: {
        name:string
    },
    output_name?: string,
}
)
{
    const hasImage = !!base_image;

    // collect all nodes in a single array without having to keep track of each node in particular:
    const activeGroup = ComfyNode.newActiveGroup();

    const loadCheckpoint = new CheckpointLoaderSimple({ ckpt_name }); //  

    let lastLora: LoraLoader = undefined!;
    for (let [name, weight] of loras)
    {
        lastLora = new LoraLoader({
            clip: lastLora! ? lastLora.outputs.CLIP : loadCheckpoint.outputs.CLIP,
            model: lastLora! ? lastLora.outputs.MODEL : loadCheckpoint.outputs.MODEL,
            lora_name: name as any,
            strength_clip: weight,
            strength_model: weight
        })
    }

    const clipLastLayer = new CLIPSetLastLayer({
        clip: lastLora! ? lastLora.outputs.CLIP : loadCheckpoint.outputs.CLIP,
        stop_at_clip_layer: -2
    });

    const textEncodePositive = new CLIPTextEncode({ text: prompt, clip: clipLastLayer.outputs.CLIP });
    const textEncodeNegative = new CLIPTextEncode({ text: prompt_n, clip: clipLastLayer.outputs.CLIP });

    let controlnetApply: ControlNetApplyAdvanced;
    let latent: VAEEncode | EmptyLatentImage;
    if (hasImage)
    {
        
        const image = new LoadImage({
            image:base_image.name as any
        });

        const updscaledImage = new ImageScale({
            image:image.outputs.IMAGE,
            width,
            height
        })

        latent = new VAEEncode({ pixels: updscaledImage.outputs.IMAGE, vae: loadCheckpoint.outputs.VAE })

        const canny = new Canny({
            image: image.outputs.IMAGE,
            low_threshold: 0.07,
            high_threshold: 0.28,
        })

        const controlnetLoader = new ControlNetLoader({ control_net_name });

        controlnetApply = new ControlNetApplyAdvanced({
            control_net: controlnetLoader.outputs.CONTROL_NET,
            positive: textEncodePositive.outputs.CONDITIONING,
            negative: textEncodeNegative.outputs.CONDITIONING,
            image: canny.outputs.IMAGE,
            strength: controlnet_adherence,
            start_percent: 0,
            end_percent: 1.0
        });
    }
    else
    {
        latent = new EmptyLatentImage({ width, height, batch_size: 1 });
    }

    const negativeConditioning = hasImage ? controlnetApply!.outputs.negative : textEncodeNegative.outputs.CONDITIONING;
    const positiveConditioning = hasImage ? controlnetApply!.outputs.positive : textEncodePositive.outputs.CONDITIONING;


    let lastSampler: KSampler;
    const _depth = typeof depth === "number" ? depth : depth.length;
    for (let j = 0; j < _depth; j += 1)
    {
        const kSampler = new KSampler({
            cfg: depth[j].cfg ?? 6,
            steps: depth[j].steps,
            scheduler: depth[j].scheduler ?? "karras",
            sampler_name: depth[j].sampler ?? "euler",
            seed: depth[j].seed ?? (seed + j), // 91553027, // 
            denoise: depth[j].denoising,
            model: lastLora?.outputs.MODEL ?? loadCheckpoint.outputs.MODEL,
            negative: (depth[j].controlnet ?? true) ? negativeConditioning : textEncodeNegative.outputs.CONDITIONING,
            positive: (depth[j].controlnet ?? true) ? positiveConditioning : textEncodePositive.outputs.CONDITIONING,
            latent_image: lastSampler! ? lastSampler.outputs.LATENT : latent.outputs.LATENT
        });

        lastSampler = kSampler;
    }

    const vaeDecode = new VAEDecode({
        samples: lastSampler!.outputs.LATENT,
        vae: loadCheckpoint.outputs.VAE
    });

    const saveImage = new SaveImage({
        filename_prefix: output_name ?? "output",
        images: vaeDecode.outputs.IMAGE,
    });


    return activeGroup;
}

