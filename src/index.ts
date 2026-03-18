#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { Command } from 'commander';
import { createDevstackConfig } from './functions/createDevstackConfig.js';
import { runAddPostgresConfig } from './functions/runAddPostgresConfig.js';
import { runGenerateConfig } from './functions/runGenerateConfig.js';
import { runUpConfig, type UpOptions } from './functions/runUpConfig.js';
import type { PostgresServiceConfig } from './models/devstack-config.js';
import { runDownConfig } from './functions/runDownConfig.js';
import { runLogsConfig } from './functions/runLogsConfig.js';
import { runStatusConfig } from './functions/runStatusConfig.js';
import { runRestartConfig } from './functions/runRestartConfig.js';
import { getCliVersion } from './utils/config.js';

const program = new Command();
const cyan = '\x1b[36m';
const magenta = '\x1b[35m';
const green = '\x1b[32m';
const yellow = '\x1b[33m';
const blue = '\x1b[34m';
const bold = '\x1b[1m';
const reset = '\x1b[0m';



const cliVersion = getCliVersion();

const addCommand = program
.command('add')
.description('Add a service to your DevStack project');

const logsCommand = program
.command('logs')
.description('View logs of DevStack services')
.argument('[service]', 'Service name to view logs for (e.g., redis, postgres)')

program
.name('devstack')
.description('A CLI tool for managing your development stack')
.version(cliVersion);

program
.command('init')
.description('Initialize a new DevStack project')
.argument("[project name]", "project name")
.action((projectName) => {
  createDevstackConfig(projectName);
  console.log("\nNext steps:");
  console.log("  devstack add postgres");
  console.log("  devstack generate");
  console.log("  devstack up");
});

program
.command('gen')
.description('Generate Docker Compose configuration based on devstack.config.json')
.action(() => {
  runGenerateConfig();
});

addCommand
.command('postgres')
.description('Add a PostgreSQL service to your DevStack project')
.option('-p, --port <port>', 'Port to expose PostgreSQL on', '5432')
.option('-u, --user <user>', 'PostgreSQL username', 'postgres')
.option('-P, --password <password>', 'PostgreSQL password', 'postgres')
.option('-d, --database <database>', 'PostgreSQL database name', 'postgres')
.action((options: PostgresServiceConfig) => {
  runAddPostgresConfig(options);
})

program
.command("up")
.description("Start DevStack services")
// .option("-d, --detach", "run services in background", true)
.option("-b, --build", "build images before starting", false)
.action((options: UpOptions) => {
  runUpConfig(options);
});

program
.command("down")
.description("Stop DevStack services")
.option('-v, --remove-volumes', 'Remove associated volumes used by the stack', false)
.option('-i, --remove-images', 'Remove images used by the stack', false)
.option('-a, --all', 'Remove all associated resources (volumes and images)', false)
.action((options: { removeVolumes: boolean; removeImages: boolean; all: boolean }) => {
  if (options.all) {
    options.removeVolumes = true;
    options.removeImages = true;
  }
  runDownConfig(options);
});

logsCommand
.action((service?: string) => {
  runLogsConfig(service);
})

program
.command("ps")
.description("Show status of DevStack services")
.argument('[service]', 'Service name to show status for (e.g., redis, postgres)')
.action((service?: string) => {
  runStatusConfig(service);
});

program
.command("restart")
.description("Restart DevStack services")
.argument('[service]', 'Service name to restart (e.g., redis, postgres)')
.action((service?: string) => {
  runRestartConfig(service);
});

function printHeader() {
  console.log();

  const art = [
    '      $$\\                      $$$$$$\\    $$\\                         $$\\       ',
    '      $$ |                    $$  __$$\\   $$ |                        $$ |      ',
    ' $$$$$$$ | $$$$$$\\ $$\\    $$\\ $$ /  \\__|$$$$$$\\    $$$$$$\\   $$$$$$$\\ $$ |  $$\\ ',
    '$$  __$$ |$$  __$$\\\\$$\\  $$  |\\$$$$$$\\  \\_$$  _|   \\____$$\\ $$  _____|$$ | $$  |',
    '$$ /  $$ |$$$$$$$$ |\\$$\\$$  /  \\____$$\\   $$ |     $$$$$$$ |$$ /      $$$$$$  / ',
    '$$ |  $$ |$$   ____| \\$$$  /  $$\\   $$ |  $$ |$$\\ $$  __$$ |$$ |      $$  _$$<  ',
    '\\$$$$$$$ |\\$$$$$$$\\   \\$  /   \\$$$$$$  |  \\$$$$  |\\$$$$$$$ |\\$$$$$$$\\ $$ | \\$$\\ ',
    ' \\_______| \\_______|   \\_/     \\______/    \\____/  \\_______| \\_______|\\__|  \\__|'
  ].join('\n');
  // console.log();
  console.log(`${magenta}${bold}${art}${reset}`);
  console.log(`${cyan}${bold}devstack${reset} — A CLI tool for managing your development stack`);
  console.log(`${bold}${cyan}Version:${reset} ${green}${cliVersion}${reset}  ${bold}${cyan}Node:${reset} ${yellow}${process.version}${reset}  ${bold}${cyan}OS:${reset} ${blue}${process.platform}${reset}`);
  console.log(); 
  console.log(); 
}

printHeader();
program.parse();
