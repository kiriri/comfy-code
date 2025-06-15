import fs from 'fs';
import path from "path";
import crypto from "crypto";
import type { JSON_ComfyNode, JSON_ComfyNodeTypes } from '../dist/JsonTypes';
import ReadLine from 'readline';
import chalk from 'chalk';
/**
 * Create a directory if it doesn't exist already.
 * @param path 
 */
export function ensure_directory(path: string)
{
  if (!fs.existsSync(path))
  {
    fs.mkdirSync(path, { recursive: true });
  }
}

/**
 * Digests the contents of a file or a string into a sha256sum
 * @param opts 
 */
export async function sha256sum(opts: {
  filename: string
} | {
  value: string
}) : Promise<string>
{
  const hash = crypto.createHash('sha256');

  if ("filename" in opts)
  {
    const filename = opts["filename"];
    const input = fs.createReadStream(filename);
    return new Promise<string>((resolve) =>
    {
      input.on('readable', () =>
      {
        const data = input.read();
        if (data)
          hash.update(data);
        else
          resolve(hash.digest('hex'));
      });
    })
  }

  hash.update(opts.value);
  return hash.digest('hex');
}

/**
 * A lot of comfy nodes use wil emojis, parentheses, etc in their names.
 * These characters cannot be used in variable names or class names.
 * This function maps any string to a valid javascript identifier.
 * @param key 
 * @returns 
 */
export function clean_key(key: string): string 
{
  key = key
    .replace(/[\s]/g, '')
    .replace("+", "Plus");

  if (key.length === 0)
  {
    return "_"; // Fallback for empty strings
  }

  // Allow Unicode letters, $, _, and digits (but not as first char).
  const validFirstChar = /^[\p{L}_$]/u;
  const validRestChars = /^[\p{L}\p{N}_$]$/u;

  // Split into characters and process each one separately.
  let firstChar = key.charAt(0);
  let restChars = key.slice(1);

  // Fix first character if invalid
  if (!validFirstChar.test(firstChar)) 
  {
    firstChar = "_";
  }

  // Process remaining characters
  const processedRest = Array.from(restChars)
    .map((char) => (validRestChars.test(char) ? char : "_"))
    .join("");

  const candidate = firstChar + processedRest;

  // Handle reserved keywords.
  // These may be incomplete.
  const reservedKeywords = new Set([
    "abstract",
    "async",
    "await",
    "any",
    "break",
    "case",
    "catch",
    "class",
    "const",
    "continue",
    "debugger",
    "default",
    "delete",
    "do",
    "else",
    "enum",
    "export",
    "extends",
    "false",
    "finally",
    "for",
    "function",
    "if",
    "import",
    "in",
    "instanceof",
    "new",
    "null",
    "return",
    "super",
    "switch",
    "this",
    "throw",
    "true",
    "try",
    "typeof",
    "var",
    "void",
    "while",
    "with",
    "as",
    "implements",
    "interface",
    "let",
    "package",
    "private",
    "protected",
    "public",
    "static",
    "yield",
    "boolean",
    "constructor",
    "declare",
    "get",
    "module",
    "require",
    "number",
    "set",
    "string",
    "symbol",
    "type",
    "from",
    "of",


    "is",
    "namespace",
    "never",
    "unknown",
    "readonly",
    "object",
    "undefined",
    "bigint",
  ]);

  return reservedKeywords.has(candidate) ? `_${candidate}` : candidate;
}

/**
 * Get the file path of a node's generated typescript file.
 * @param import_path 
 * @param node 
 * @returns 
 */
export function get_node_path(import_path: string, node: JSON_ComfyNodeTypes[any])
{
  let key = clean_key(node.name);

  let full_path = import_path;

  if (node.category)
  {
    let path_segments = node.category.split('/');

    for (let i = 0; i < path_segments.length; i++)
    {
      let partial_path = path.join(import_path, ...path_segments.slice(0, i + 1));
      ensure_directory(partial_path);
    }

    full_path = path.join(import_path, ...path_segments);
  }

  full_path = path.join(full_path, key + '.ts');

  return full_path;
}

export function sort_nodes_topologically(workflow: Record<string, JSON_ComfyNode>): string[]
{
  const nodeIds = Object.keys(workflow);
  const visited = new Set<string>();
  const tempVisited = new Set<string>();
  const sortedNodes: string[] = [];

  function visit(nodeId: string)
  {
    if (tempVisited.has(nodeId))
    {
      throw new Error(`Cyclic dependency detected involving node ${nodeId}`);
    }

    if (visited.has(nodeId)) return;

    tempVisited.add(nodeId);
    const node = workflow[nodeId];

    // Find all dependencies in inputs
    const dependencies = new Set<string>();
    for (const inputValue of Object.values(node.inputs))
    {
      if (Array.isArray(inputValue) && inputValue.length === 2 && typeof inputValue[0] === 'string')
      {
        dependencies.add(inputValue[0]);
      }
    }

    // Visit all dependencies first
    dependencies.forEach(depId =>
    {
      if (workflow[depId])
      {
        visit(depId);
      }
    });

    tempVisited.delete(nodeId);
    visited.add(nodeId);
    sortedNodes.push(nodeId);
  }

  // Visit each node
  nodeIds.forEach(nodeId =>
  {
    if (!visited.has(nodeId))
    {
      visit(nodeId);
    }
  });

  return sortedNodes;
}

/**
 * Checks if that file exists already. 
 * If it does, it should ask the user whether to override the file (y/n in console).
 * If the user says y, writes the file.
 * @param output_path 
 * @param content 
 */
export function write_file_with_confirmation(output_path: string, content: string, fallback = false)
{
  if (fs.existsSync(output_path)) 
  {
    const rl = ReadLine.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question(warning(`File "${output_path}" already exists. Overwrite? (${fallback ? 'Y' : 'y'}/${!fallback ? 'N' : 'n'})`), (answer) =>
    {
      rl.close();
      if (answer === "")
        if (fallback)
          answer = "y";

      if (answer.toLowerCase() === 'y')
      {
        fs.writeFileSync(output_path, content);
        console.log(success(`File "${output_path}" has been overwritten.`));
      }
      else
        console.log(error(`File "${output_path}" was not overwritten.`));

    });
  }
  else
  {
    fs.writeFileSync(output_path, content);
    console.log(success(`File "${output_path}" has been created.`));
  }
}

/**
 * Try each function one after another until one doesn't throw an error.
 * @param fn 
 */
export async function try_all<T>(fns: (() => T | Promise<T>)[]): Promise<T | null>
{
  for (let fn of fns)
  {
    try
    {
      let res = fn();

      if (res instanceof Promise)
      {
        let failed = false;
        res.catch(() => failed = true);
        let real_res = await res;
        if (!failed)
          return real_res;
      }
      else
      {
        return res;
      }
    }
    catch (e) { }



  }

  return null;
}

export const unimportant = chalk.hex("#888");
export const error = chalk.hex("#f00").bgWhite;
export const warning = chalk.hex("#fa0");
export const success = chalk.hex("#0b0").bgBlack;