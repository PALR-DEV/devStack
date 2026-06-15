#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { Command } from 'commander';
import { createDevstackConfig } from './functions/createDevstackConfig.js';
import { runAddPostgresConfig } from './functions/runAddPostgresConfig.js';
import { runGenerateConfig } from './functions/runGenerateConfig.js';
import { runUpConfig, type UpOptions } from './functions/runUpConfig.js';
import type { PostgresServiceConfig, RedisServiceConfig, MongoServiceConfig, MySQLServiceConfig, RabbitMQServiceConfig, ElasticsearchServiceConfig, MinIOServiceConfig, MailpitServiceConfig } from './models/devstack-config.js';
import { runDownConfig } from './functions/runDownConfig.js';
import { runLogsConfig } from './functions/runLogsConfig.js';
import { runStatusConfig } from './functions/runStatusConfig.js';
import { runRestartConfig } from './functions/runRestartConfig.js';
import { runAddRedisConfig } from './functions/runAddRedisConfig.js';
import { runAddMongoConfig } from './functions/runAddMongoConfig.js';
import { runAddMySQLConfig } from './functions/runAddMySQLConfig.js';
import { runAddRabbitMQConfig } from './functions/runAddRabbitMQConfig.js';
import { runAddElasticsearchConfig } from './functions/runAddElasticsearchConfig.js';
import { runAddMinIOConfig } from './functions/runAddMinIOConfig.js';
import { runAddMailpitConfig } from './functions/runAddMailpitConfig.js';
import { runInfoConfig } from './functions/runInfoConfig.js';
import { runEnvConfig } from './functions/runEnvConfig.js';
import { runOpenConfig } from './functions/runOpenConfig.js';
import { runListConfig } from './functions/runListConfig.js';
import { runRemoveConfig } from './functions/runRemoveConfig.js';
import { runNukeConfig } from './functions/runNukeConfig.js';
import { runConnectConfig } from './functions/runConnectConfig.js';


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
  console.log("  devstack add <service>");
  console.log("  devstack gen");
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
.option('-u, --username <username>', 'PostgreSQL username', 'postgres')
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

addCommand
.command('mysql')
.description('Add a MySQL service to your DevStack project')
.option('-p, --port <port>', 'Port to expose MySQL on', '3306')
.option('-R, --root-password <rootPassword>', 'MySQL root password', 'rootpassword')
.option('-u, --username <username>', 'MySQL username', 'mysql')
.option('-P, --password <password>', 'MySQL password', 'mysql')
.option('-d, --database <database>', 'MySQL database name', 'mysql')
.action((options: MySQLServiceConfig) => {
  runAddMySQLConfig(options);
});

addCommand
.command('rabbitmq')
.description('Add a RabbitMQ service to your DevStack project')
.option('-p, --port <port>', 'AMQP port', '5672')
.option('-m, --management-port <managementPort>', 'Management UI port', '15672')
.option('-u, --username <username>', 'RabbitMQ username', 'guest')
.option('-P, --password <password>', 'RabbitMQ password', 'guest')
.action((options: RabbitMQServiceConfig) => {
  runAddRabbitMQConfig(options);
});

addCommand
.command('elasticsearch')
.description('Add an Elasticsearch service to your DevStack project')
.option('-p, --port <port>', 'Port to expose Elasticsearch on', '9200')
.option('-P, --password <password>', 'Elastic password (enables security when set)')
.action((options: ElasticsearchServiceConfig) => {
  runAddElasticsearchConfig(options);
});

addCommand
.command('minio')
.description('Add a MinIO (S3-compatible storage) service to your DevStack project')
.option('-p, --port <port>', 'API port', '9000')
.option('-c, --console-port <consolePort>', 'Web console port', '9001')
.option('-u, --root-user <rootUser>', 'Root user', 'minioadmin')
.option('-P, --root-password <rootPassword>', 'Root password', 'minioadmin')
.action((options: MinIOServiceConfig) => {
  runAddMinIOConfig(options);
});

addCommand
.command('mailpit')
.description('Add a Mailpit local SMTP catcher to your DevStack project')
.option('-p, --smtp-port <smtpPort>', 'SMTP port your app sends to', '1025')
.option('-u, --ui-port <uiPort>', 'Web UI port to inspect emails', '8025')
.action((options: MailpitServiceConfig) => {
  runAddMailpitConfig(options);
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
.option('-a, --all', 'Remove all associated volumes and images', false)
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

program
.command('info')
.description('Show project info, service status, and connection strings')
.action(() => {
  runInfoConfig();
});

program
.command('list')
.description('List all configured services in a table')
.action(() => {
  runListConfig();
});

program
.command('env')
.description('Print .env-ready connection strings for all services')
.option('-o, --output <file>', 'Write to a file instead of stdout (e.g. .env)')
.action((options: { output?: string }) => {
  runEnvConfig(options);
});

program
.command('open')
.description('Open service web UIs in the browser')
.argument('[service]', 'Service to open (mailpit, rabbitmq, minio, elasticsearch)')
.action((service?: string) => {
  runOpenConfig(service);
});

program
.command('remove')
.description('Remove a service from devstack.config.json')
.argument('<service>', 'Service to remove (e.g. redis, postgres)')
.action((service: string) => {
  runRemoveConfig(service);
});

program
.command('connect')
.description('Open an interactive shell into a service')
.argument('<service>', 'Service to connect to (e.g. postgres, redis, mongo, mysql)')
.action((service: string) => {
  runConnectConfig(service);
});

program
.command('nuke')
.description('Stop all services, delete compose file, and reset config')
.option('-y, --yes', 'Skip confirmation', false)
.action((options: { yes: boolean }) => {
  runNukeConfig(options);
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
