#!/usr/bin/env -S node --no-warnings

import { program, Command } from 'commander';
import { import_nodes_command } from './import-comfy';
import { import_workflow_command } from './import-comfy-workflow';

import { version }  from '../package.json';  // Import version from package.json for consistency.

program
  .name('comfy-code')
  .description('Comfy-Code lets you generate typescript types and scripts from ComfyUI.')
  .version(version);

const import_command = new Command('import')
    .description('Various importers, both from files and from an API.');
    
import_command.addCommand(import_nodes_command);
import_command.addCommand(import_workflow_command);
program.addCommand(import_command)

program.parse();