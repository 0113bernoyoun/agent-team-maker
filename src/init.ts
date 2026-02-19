#!/usr/bin/env node

import { existsSync, mkdirSync, cpSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PKG_ROOT = resolve(__dirname, '..');

function main(): void {
  const targetArg = process.argv.find((a) => a.startsWith('--target='));
  const targetDir = targetArg ? targetArg.split('=')[1] : process.cwd();
  const command = process.argv[2];

  if (command === 'init') {
    init(resolve(targetDir));
  } else {
    printUsage();
  }
}

function init(projectRoot: string): void {
  console.log('\n  agent-team-maker init\n');

  const claudeDir = join(projectRoot, '.claude');
  const templatesSource = join(PKG_ROOT, 'templates');
  const commandsSource = join(PKG_ROOT, 'commands');
  const templatesDest = join(claudeDir, 'templates', 'agent-team-maker');
  const commandsDest = join(claudeDir, 'commands', 'team');

  // Verify source directories exist
  if (!existsSync(templatesSource)) {
    console.error('  Error: templates/ directory not found in package.');
    console.error('  This might be a broken installation. Try reinstalling.');
    process.exit(1);
  }

  if (!existsSync(commandsSource)) {
    console.error('  Error: commands/ directory not found in package.');
    process.exit(1);
  }

  // Create .claude directory if needed
  if (!existsSync(claudeDir)) {
    mkdirSync(claudeDir, { recursive: true });
    console.log('  Created .claude/');
  }

  // Copy templates
  if (existsSync(templatesDest)) {
    console.log('  Updating existing templates...');
  }
  mkdirSync(templatesDest, { recursive: true });
  cpSync(templatesSource, templatesDest, { recursive: true });
  const templateCount = countFiles(templatesDest);
  console.log(`  Copied templates/ → .claude/templates/agent-team-maker/ (${templateCount} files)`);

  // Copy commands
  mkdirSync(commandsDest, { recursive: true });
  cpSync(commandsSource + '/team', commandsDest, { recursive: true });
  const commandCount = countFiles(commandsDest);
  console.log(`  Copied commands/ → .claude/commands/team/ (${commandCount} files)`);

  // Create agents directory
  const agentsDir = join(claudeDir, 'agents');
  if (!existsSync(agentsDir)) {
    mkdirSync(agentsDir, { recursive: true });
    console.log('  Created .claude/agents/');
  }

  console.log('\n  Setup complete!\n');
  console.log('  Next steps:');
  console.log('  1. Open Claude Code in your project');
  console.log('  2. Run /team:create to generate your agent team');
  console.log('  3. Or run /team:list to browse available presets');
  console.log('');
}

function countFiles(dir: string): number {
  let count = 0;
  if (!existsSync(dir)) return 0;
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      count += countFiles(fullPath);
    } else {
      count++;
    }
  }
  return count;
}

function printUsage(): void {
  console.log(`
  agent-team-maker — Generate Claude Code sub-agent teams

  Usage:
    npx agent-team-maker init              Install templates and commands
    npx agent-team-maker init --target=DIR Install to a specific directory

  After installation:
    /team:create     Generate a new agent team
    /team:list       Browse available presets
    /team:add-agent  Add a single agent to existing team
    /team:customize  Modify existing team configuration
`);
}

main();
