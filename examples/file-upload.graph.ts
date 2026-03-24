import { UNETLoader } from "../imports/advanced/loaders/UNETLoader.ts";
import { CLIPLoader } from "../imports/advanced/loaders/CLIPLoader.ts";
import { LoraLoader } from "../imports/loaders/LoraLoader.ts";
import { CLIPTextEncode } from "../imports/conditioning/CLIPTextEncode.ts";
import { LoadImage } from "../imports/image/LoadImage.ts";
import { ImageScaleToTotalPixels } from "../imports/image/upscaling/ImageScaleToTotalPixels.ts";
import { VAELoader } from "../imports/loaders/VAELoader.ts";
import { VAEEncode } from "../imports/latent/VAEEncode.ts";
import { ReferenceLatent } from "../imports/advanced/conditioning/edit_models/ReferenceLatent.ts";
import { CFGGuider } from "../imports/sampling/custom_sampling/guiders/CFGGuider.ts";
import { KSamplerSelect } from "../imports/sampling/custom_sampling/samplers/KSamplerSelect.ts";
import { Flux2Scheduler } from "../imports/sampling/custom_sampling/schedulers/Flux2Scheduler.ts";
import { EmptyLatentImage } from "../imports/latent/EmptyLatentImage.ts";
import { SamplerCustomAdvanced } from "../imports/sampling/custom_sampling/SamplerCustomAdvanced.ts";
import { VAEDecode } from "../imports/latent/VAEDecode.ts";
import { SaveImage } from "../imports/image/SaveImage.ts";
import { WD14Tagger_pysssss } from "../imports/image/WD14Tagger_pysssss.ts";
import { AddTextSuffix } from "../imports/dataset/text/AddTextSuffix.ts";
import { PrimitiveStringMultiline } from "../imports/utils/primitive/PrimitiveStringMultiline.ts";
import { SaveText_pysssss } from "../imports/utils/SaveText_pysssss.ts";
import { RandomNoise } from "../imports/sampling/custom_sampling/noise/RandomNoise.ts";

import { ComfyNode, ComfyInterface } from "comfy-code";

import * as fs from "node:fs/promises"

/**
 * Processes an image at a given path by uploading the image, extracting the tags, filtering the tags in typescript, and only then building the correct final graph.
 * You will need to adjust the paths and model names in this script to run it yourself.
 * @param img 
 */
export async function process_file(img:string, width = 512, height=512*3)
{
    const comfy_ui_temp_directory = "~/Desktop/ComfyUI/temp/";
	const comfy = new ComfyInterface('http://127.0.0.1:8188');

    // First upload the file into comfyui's upload directory.
	const img_id = await comfy.uploadImage(img);


	// Then use the great WD1.4 tagger to extract the tags. (This requires an extension to be installed)
	const LoadImage3 = new LoadImage({
		image: img_id.name as any,
	});

	const WD14Tagger_pysssss4 = new WD14Tagger_pysssss({
		model: "wd-v1-4-moat-tagger-v2",
		threshold: 0.35,
		character_threshold: 0.85,
		replace_underscore: true,
		trailing_comma: false,
		exclude_tags: "",
		image: LoadImage3.outputs.IMAGE
	});

    // Another extension which lets us save text to a text file, so we can read it back into typescript.
	const savePrompt = new SaveText_pysssss({
		text:WD14Tagger_pysssss4.outputs.STRING,
		file:"prompts.txt",
		root_dir:"temp",
		append:"overwrite"
	});

    // Run the tag extraction graph:
	await comfy.executePrompt([savePrompt], "print");

	// load the results into nodejs:
	const promptsFileContents = await fs.readFile(comfy_ui_temp_directory+ "prompts.txt", {encoding:"utf-8"})

	let prompts =  promptsFileContents.split(",").map(prompt=>prompt.trim());

    // Filter out non appearance related tags:
	prompts = prompts.filter(prompt=>{
		return /(hair|cut|eyes|mouth|locks?|bangs?|blush|smile|tongue|horns?|wings?|body|braids?|tails?|pupils?|lipstick|lips|nose|eyebrows|eyelashes|fat|thin|freckles|ears)$/g.test(prompt);
	});

	// Then do the actual image graph:

	const activeGroup = ComfyNode.newActiveGroup();

	const Seed = new RandomNoise({
		noise_seed: 487093164625171
	});

    // I will be loading flux for pose transfer.
	const LoadUNET = new UNETLoader({
		unet_name: "flux-2-klein-4b-fp8.safetensors", 
		weight_dtype: "default"
	});

	const LoadCLIP = new CLIPLoader({
		clip_name: "qwen38BFluxKlein9BTE_38b.safetensors",
		type: "flux2",
		device: "default"
	});

	const LoadMyLora = new LoraLoader({
		lora_name: "flux/klein4/mylora",
		strength_model: 1,
		strength_clip: 1,
		model: LoadUNET.outputs.MODEL,
		clip: LoadCLIP.outputs.CLIP
	});

	const PositivePrompt = new PrimitiveStringMultiline({
		value: "Create a full body image of this character. White background. Keep all the proportions the same. " + prompts.join(", ")
	});

	const PositiveClipEncoder = new CLIPTextEncode({
		text: PositivePrompt.outputs.STRING,
		clip: LoadMyLora.outputs.CLIP
	});

	const ScaleToOneMp = new ImageScaleToTotalPixels({
		upscale_method: "nearest-exact",
		megapixels: 1,
		resolution_steps: 1,
		image: LoadImage3.outputs.IMAGE
	});

	const LoadVAE = new VAELoader({
		vae_name: "flux2-vae.safetensors"
	});

	const EncodeImage = new VAEEncode({
		pixels: ScaleToOneMp.outputs.IMAGE,
		vae: LoadVAE.outputs.VAE
	});

	const ReferenceLatentImage = new ReferenceLatent({
		conditioning: PositiveClipEncoder.outputs.CONDITIONING,
		latent: EncodeImage.outputs.LATENT
	});

    // We don't use a negative text prompt in flux.
	const EncodeNegativeCLIP = new CLIPTextEncode({
		text: "",
		clip: LoadMyLora.outputs.CLIP
	});

	const EncodeNegativeLatent = new ReferenceLatent({
		conditioning: EncodeNegativeCLIP.outputs.CONDITIONING,
		latent: EncodeImage.outputs.LATENT
	});

	const CFGGuider1_63 = new CFGGuider({
		cfg: 0.9,
		model: LoadMyLora.outputs.MODEL,
		positive: ReferenceLatentImage.outputs.CONDITIONING,
		negative: EncodeNegativeLatent.outputs.CONDITIONING
	});

	const Sampler = new KSamplerSelect({
		sampler_name: "euler"
	});

	const Scheduler = new Flux2Scheduler({
		steps: 4,
		width: width,
		height: height
	});
	
    const OutputLatent = new EmptyLatentImage({
		width: width,
		height: height,
		batch_size: 1
	});

	const SamplerCustomAdvanced1_64 = new SamplerCustomAdvanced({
		noise: Seed.outputs.NOISE,
		guider: CFGGuider1_63.outputs.GUIDER,
		sampler: Sampler.outputs.SAMPLER,
		sigmas: Scheduler.outputs.SIGMAS,
		latent_image: OutputLatent.outputs.LATENT
	});

	const DecodeVAE = new VAEDecode({
		samples: SamplerCustomAdvanced1_64.outputs.output,
		vae: LoadVAE.outputs.VAE
	});
    
	const SaveResult = new SaveImage({
		filename_prefix: img.split("/").at(-1)!.split(".")[0],
		images: DecodeVAE.outputs.IMAGE
	});

    // Run the actual flux graph. Quit this comfyui instance after you're done.
	await comfy.executePrompt(activeGroup, "print").then(comfy.quit.bind(comfy));
}
