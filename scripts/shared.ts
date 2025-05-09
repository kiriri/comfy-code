import fs from 'fs';
import path from "path";
import type { JSON_ComfyNode, JSON_ComfyNodeTypes } from '../dist/JsonTypes';

export function ensure_directory(path: string)
{
    if (!fs.existsSync(path))
    {
        fs.mkdirSync(path, { recursive: true });
    }
}

export function clean_key(key:string)
{
    return key
            .replace(/[\s\\\/"']/g, '')
            .replace("+", "Plus")
            .replace(/[(:]/g, "_")
            .replace(")", "");
}

export function get_node_path(import_path:string, node: JSON_ComfyNodeTypes[any])
{
    let key = clean_key(node.name);

    let full_path = import_path;

    if (node.category)
    {
        let path = node.category.split('/');

        for (let i = 0; i < path.length; i++)
        {
            let partial_path = import_path + path.slice(0, i + 1).join('/');
            ensure_directory(partial_path);
        }

        full_path = import_path + path.join('/');
    }

    full_path = path.join(full_path, key + '.ts');

    return full_path;
}

export function sortNodesTopologically(workflow: Record<string, JSON_ComfyNode>): string[] {
    const nodeIds = Object.keys(workflow);
    const visited = new Set<string>();
    const tempVisited = new Set<string>();
    const sortedNodes: string[] = [];
  
    function visit(nodeId: string) {
      if (tempVisited.has(nodeId)) {
        throw new Error(`Cyclic dependency detected involving node ${nodeId}`);
      }
  
      if (visited.has(nodeId)) return;
  
      tempVisited.add(nodeId);
      const node = workflow[nodeId];
  
      // Find all dependencies in inputs
      const dependencies = new Set<string>();
      for (const inputValue of Object.values(node.inputs)) {
        if (Array.isArray(inputValue) && inputValue.length === 2 && typeof inputValue[0] === 'string') {
          dependencies.add(inputValue[0]);
        }
      }
  
      // Visit all dependencies first
      dependencies.forEach(depId => {
        if (workflow[depId]) {
          visit(depId);
        }
      });
  
      tempVisited.delete(nodeId);
      visited.add(nodeId);
      sortedNodes.push(nodeId);
    }
  
    // Visit each node
    nodeIds.forEach(nodeId => {
      if (!visited.has(nodeId)) {
        visit(nodeId);
      }
    });
  
    return sortedNodes;
  }