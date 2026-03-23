import { CheckpointLoaderSimple } from "../imports/loaders/CheckpointLoaderSimple.ts";
import { CLIPTextEncode } from "../imports/conditioning/CLIPTextEncode.ts";
import { EmptyLatentImage } from "../imports/latent/EmptyLatentImage.ts";
import { KSampler } from "../imports/sampling/KSampler.ts";
import { VAEDecode } from "../imports/latent/VAEDecode.ts";
import { SaveImage } from "../imports/image/SaveImage.ts";
import { ComfyInterface, ComfyNode } from "comfy-code";

const comfy = new ComfyInterface('http://127.0.0.1:8188');

const activeGroup = ComfyNode.newActiveGroup();

const CheckpointLoaderSimple3 = new CheckpointLoaderSimple({
	ckpt_name: "Stable-diffusion/sd_xl_base_1.0.safetensors"
});
const CLIPTextEncode2 = new CLIPTextEncode({
	text: "house, beach, sand, palm trees, sun, waves",
	clip: CheckpointLoaderSimple3.outputs.CLIP
});
const CLIPTextEncode4 = new CLIPTextEncode({
	text: "nsfw",
	clip: CheckpointLoaderSimple3.outputs.CLIP
});
const EmptyLatentImage7 = new EmptyLatentImage({
	width: 512,
	height: 512,
	batch_size: 1
});
const KSampler1 = new KSampler({
	seed: 0,
	steps: 20,
	cfg: 8,
	sampler_name: "euler",
	scheduler: "simple",
	denoise: 1,
	model: CheckpointLoaderSimple3.outputs.MODEL,
	positive: CLIPTextEncode2.outputs.CONDITIONING,
	negative: CLIPTextEncode4.outputs.CONDITIONING,
	latent_image: EmptyLatentImage7.outputs.LATENT
});
const VAEDecode5 = new VAEDecode({
	samples: KSampler1.outputs.LATENT,
	vae: CheckpointLoaderSimple3.outputs.VAE
});
const SaveImage6 = new SaveImage({
	filename_prefix: "ComfyUI",
	images: VAEDecode5.outputs.IMAGE
});

comfy.executePrompt(activeGroup, "print").then(comfy.quit.bind(comfy));