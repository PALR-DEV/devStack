#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { Command } from 'commander';
import { createDevstackConfig } from './functions/createDevstackConfig.js';
import { runAddPostgresConfig } from './functions/runAddPostgresConfig.js';
import { runGenerateConfig } from './functions/runGenerateConfig.js';
import { runUpConfig, type UpOptions } from './functions/runUpConfig.js';
import type { PostgresServiceConfig, RedisServiceConfig, MongoServiceConfig } from './models/devstack-config.js';
import { runDownConfig } from './functions/runDownConfig.js';
import { runLogsConfig } from './functions/runLogsConfig.js';
import { runStatusConfig } from './functions/runStatusConfig.js';
import { runRestartConfig } from './functions/runRestartConfig.js';
import { runAddRedisConfig } from './functions/runAddRedisConfig.js';
import { runAddMongoConfig } from './functions/runAddMongoConfig.js';


const program = new Command();
const cyan = '\x1b[36m';
const magenta = '\x1b[35m';
const green = '\x1b[32m';
const yellow = '\x1b[33m';
const blue = '\x1b[34m';
const bold = '\x1b[1m';
const reset = '\x1b[0m';

const packageJsonVersion = JSON.parse(readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8')).version;


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
.version(packageJsonVersion, '-v, --version', 'output the current version');

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

//TODO: Refactor to use a single "add" command with subcommands for each service type (e.g., "devstack add postgres", "devstack add redis")

addCommand
.command('postgres')
.description('Add a PostgreSQL service to your DevStack project')
.option('-p, --port <port>', 'Port to expose PostgreSQL on', '5432')
.option('-u, --user <user>', 'PostgreSQL username', 'postgres')
.option('-P, --password <password>', 'PostgreSQL password', 'postgres')
.option('-d, --database <database>', 'PostgreSQL database name', 'postgres')
.action((options: PostgresServiceConfig) => {
  runAddPostgresConfig(options);
});

addCommand
.command('redis')
.description('Add a Redis service to your DevStack project')
.option('-p, --port <port>', 'Port to expose Redis on', '6379')
.option('--password <password>', 'Password for Redis (optional)')
.action((options: RedisServiceConfig) => {
  runAddRedisConfig(options);
});

addCommand
.command('mongo')
.description('Add a MongoDB service to your DevStack project')
.option('-p, --port <port>', 'Port to expose MongoDB on', '27017')
.option('-u, --username <username>', 'MongoDB username', 'mongo')
.option('-P, --password <password>', 'MongoDB password', 'mongo')
.option('-d, --database <database>', 'MongoDB database name', 'mongo')
.action((options: MongoServiceConfig) => {
  runAddMongoConfig(options);
});




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
  console.log(`${bold}${cyan}Version:${reset} ${green}${packageJsonVersion}${reset}  ${bold}${cyan}Node:${reset} ${yellow}${process.version}${reset}  ${bold}${cyan}OS:${reset} ${blue}${process.platform}${reset}`);
  console.log(); 
  console.log(); 
}

printHeader();
program.parse();
