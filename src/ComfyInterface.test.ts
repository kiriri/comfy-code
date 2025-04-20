// comfy.test.ts
import { generate_graph } from '../examples/i2i.graph.ts';
import { ComfyInterface } from './ComfyInterface.ts';
import * as fs from 'fs';
import path from 'path';

// Custom assertion functions (because I want to reduce dependencies)
function assert(condition: boolean, message: string): void
{
    if (!condition)
    {
        throw new Error(`Assertion failed: ${message}`);
    }
}

function assertEqual<T>(actual: T, expected: T, message: string): void
{
    if (actual !== expected)
    {
        throw new Error(`Assertion failed: ${message}. Expected ${expected}, got ${actual}`);
    }
}

function assertType(value: any, type: string, message: string): void
{
    const actualType = typeof value;
    if (actualType !== type)
    {
        throw new Error(`Assertion failed: ${message}. Expected type ${type}, got ${actualType}`);
    }
}

function assertArray(value: any, message: string): void
{
    if (!Array.isArray(value))
    {
        throw new Error(`Assertion failed: ${message}. Expected array`);
    }
}

function assertProperty(obj: any, prop: string, message?: string): void
{
    if (!(prop in obj))
    {
        throw new Error(`Assertion failed: ${message || `Expected property ${prop} to exist`}`);
    }
}

function assertMatch(value: string, regex: RegExp, message: string): void
{
    if (!regex.test(value))
    {
        throw new Error(`Assertion failed: ${message}. Value ${value} didn't match ${regex}`);
    }
}

// Test configuration
const TEST_SERVER_URL = process.env.COMFYUI_URL || 'http://localhost:8188';
const TEST_IMAGE_PATH = path.join("./", 'icon.png');

async function runTests()
{
    let comfy: ComfyInterface;
    let testPromptId: string;
    let testImageName: string;

    try
    {
        // Setup
        console.log('Setting up test environment...');
        comfy = new ComfyInterface(TEST_SERVER_URL);

        // Test initialization
        console.log('Running initialization test...');
        assertEqual(comfy.url, TEST_SERVER_URL, 'URL should match test server URL');

        // System Info Tests
        console.log('Running system info tests...');
        const stats = await comfy.getSystemStats();
        assertProperty(stats, 'system', 'Stats should have system property');

        const { system, devices } = stats;
        assertType(system.os, 'string', 'OS should be a string');
        assert(['posix', 'windows', 'macos'].includes(system.os) || typeof system.os === 'string',
            'OS should be posix/windows/macos or string');
        assertType(system.ram_total, 'number', 'ram_total should be number');
        assert(system.ram_total > 0, 'ram_total should be positive');
        assertType(system.ram_free, 'number', 'ram_free should be number');
        assert(system.ram_free <= system.ram_total, 'ram_free should be <= ram_total');
        assertType(system.comfyui_version, 'string', 'comfyui_version should be string');
        assertMatch(system.comfyui_version, /^\d+\.\d+\.\d+/, 'comfyui_version should match version pattern');
        assertType(system.python_version, 'string', 'python_version should be string');
        assertMatch(system.python_version, /^\d+\.\d+\.\d+/, 'python_version should match version pattern');
        assertType(system.pytorch_version, 'string', 'pytorch_version should be string');
        assertType(system.embedded_python, 'boolean', 'embedded_python should be boolean');
        assertArray(system.argv, 'argv should be array');
        system.argv.forEach(arg => assertType(arg, 'string', 'argv items should be strings'));

        assertArray(devices, 'devices should be array');
        devices.forEach(device =>
        {
            assertType(device.name, 'string', 'device name should be string');
            assertType(device.type, 'string', 'device type should be string');
            assert(['cuda', 'cpu'].includes(device.type) || typeof device.type === 'string',
                'device type should be cuda/cpu or string');
            assertType(device.index, 'number', 'device index should be number');
            assert(device.index >= 0, 'device index should be >= 0');
            assertType(device.vram_total, 'number', 'vram_total should be number');
            assert(device.vram_total >= 0, 'vram_total should be >= 0');
            assertType(device.vram_free, 'number', 'vram_free should be number');
            assert(device.vram_free <= device.vram_total, 'vram_free should be <= vram_total');
            assertType(device.torch_vram_total, 'number', 'torch_vram_total should be number');
            assertType(device.torch_vram_free, 'number', 'torch_vram_free should be number');
        });

        // Node Information Tests
        console.log('Running node information tests...');
        const nodes = await comfy.fetchNodes();
        assertType(nodes, 'object', 'nodes should be object');
        assert(Object.keys(nodes).length > 0, 'nodes should have properties');

        const firstNode = Object.values(nodes)[0];
        assertProperty(firstNode, 'input', 'node should have input');
        assertProperty(firstNode, 'output', 'node should have output');
        assertProperty(firstNode, 'output_node', 'node should have output_node');

        const embeddings = await comfy.getEmbeddings();
        assertArray(embeddings, 'embeddings should be array');
        embeddings.forEach(embedding => assertType(embedding, 'string', 'embedding should be string'));

        // Image Operations Tests
        console.log('Running image operations tests...');
        const imageBuffer = fs.readFileSync(TEST_IMAGE_PATH);
        const blob = new Blob([imageBuffer]);
        const uploadResult = await comfy.uploadImage(blob);
        assertProperty(uploadResult, 'name', 'upload result should have name');
        testImageName = uploadResult.name;

        if (testImageName)
        {
            const image = await comfy.getImage(testImageName, uploadResult.type, uploadResult.subfolder);
            console.log(testImageName, uploadResult, image)
            assert(image instanceof Blob, 'image should be Blob');
            assert(image.size > 0, 'image size should be > 0');
        } 
        else
        {
            console.warn('No image uploaded - skipping image fetch test');
        }

        // Prompt Execution Tests
        console.log('Running prompt execution tests...');
        const graph = await generate_graph({
            width: 512*1.5,
            height: 512*1.5,
            seed:Math.floor(Math.random()*1111111111),
            depth: [
                {
                    denoising: 0.6,
                    steps: 15,
                    controlnet: true
                },
                {
                    denoising: 0.7,
                    steps: 15,
                    controlnet: false
                }
            ],
            prompt: "Two C letters, logo, orange font, blue font, gray background, badge, flat colors, saturated, metallic, chrome, neon",
            prompt_n:"shadows, bevel",
            ckpt_name: "Stable-diffusion/starlightXLAnimated_v2.safetensors",
            base_image: { name: testImageName }
        });

        const promptResult = await comfy.executePrompt(graph);
        
        assertProperty(promptResult, 'prompt_id', 'result should have prompt_id');
        assertProperty(promptResult, 'number', 'result should have number');
        assertProperty(promptResult, 'node_errors', 'result should have node_errors');


        // Queue Management Tests
        console.log('Running queue management tests...');
        const queue = await comfy.getQueue();
        console.log('Queue:', queue);
        assertArray(queue.queue_pending, 'queue.queue_pending should be array');
        assertArray(queue.queue_running, 'queue.queue_running should be array');

        await comfy.interrupt();
        console.log('Interrupt command sent');

        await comfy.clearQueue();
        const clearedQueue = await comfy.getQueue();
        assert(clearedQueue.queue_pending.length === 0, 'queue.queue_pending should be empty after clear');

        // History Management Tests
        console.log('Running history management tests...');
        const history = await comfy.getHistory();


        if (Object.values(history).length > 0)
        {
            const firstItem = Object.values(history)[0];
            assertType(firstItem, 'object', 'history item should be object');
            testPromptId = firstItem.prompt[1];
            console.log("First ", firstItem)

            const historyItem = await comfy.getHistoryItem(testPromptId);
            console.log(testPromptId, historyItem);
            assert(historyItem !== undefined, 'history item should exist');
            assertProperty(historyItem, 'prompt', 'history item should have prompt');
        } 
        else
        {
            console.warn('No history items found - skipping history item test');
        }

        await comfy.clearHistory();
        console.log('History cleared');

        console.log('All tests completed successfully!');
    } 
    catch (error)
    {
        console.error('Test failed:', error);
        process.exit(1);
    } 
    finally
    {
        // // Cleanup
        // if (fs.existsSync(TEST_IMAGE_PATH))
        // {
        //     fs.unlinkSync(TEST_IMAGE_PATH);
        // }
    }
}

// Run the tests
runTests();