#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/index.ts
var import_commander = require("commander");

// src/functions/createDevstackConfig.ts
var import_node_fs = __toESM(require("fs"), 1);
var import_node_path = __toESM(require("path"), 1);
function createDevstackConfig(projectName) {
  const rootDir = process.cwd();
  const configPath = import_node_path.default.join(rootDir, "devstack.config.json");
  const config = {
    projectName: projectName || import_node_path.default.basename(rootDir),
    "version": "1.0.0",
    composeFileName: "docker-compose.devstack.yml",
    services: {}
  };
  if (import_node_fs.default.existsSync(configPath)) {
    console.error("A devstack.config.json already exists in this directory.");
    process.exit(1);
  }
  import_node_fs.default.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}
`);
  console.log("\u2705 DevStack initialized");
  console.log(`\u2705 Created ${configPath}`);
}

// src/utils/config.ts
var import_node_fs2 = __toESM(require("fs"), 1);
var import_node_path2 = __toESM(require("path"), 1);
function getConfigPath() {
  return import_node_path2.default.join(process.cwd(), "devstack.config.json");
}
function readConfig() {
  const configPath = getConfigPath();
  if (!import_node_fs2.default.existsSync(configPath)) {
    console.error("No devstack.config.json found in the current directory.");
    process.exit(1);
  }
  const raw = import_node_fs2.default.readFileSync(configPath, "utf-8");
  return JSON.parse(raw);
}
function writeConfig(config) {
  const configPath = getConfigPath();
  import_node_fs2.default.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}
`, "utf-8");
}

// src/functions/runAddPostgresConfig.ts
function runAddPostgresConfig(options) {
  const config = readConfig();
  if (!config.services) {
    config.services = {};
  }
  if (config.services.postgres) {
    console.error("\u26A0\uFE0F Postgres is already configured.");
    process.exit(1);
  }
  const port = options.port ? Number(options.port) : 5432;
  if (Number.isNaN(port)) {
    console.error("\u26A0\uFE0F Invalid port number.");
    process.exit(1);
  }
  config.services.postgres = {
    enabled: true,
    image: "postgres:latest",
    containerName: `${config.projectName}_postgres`,
    port: options.port || "5432",
    username: options.username || "postgres",
    password: options.password || "postgres",
    database: options.database || "postgres",
    volume: true
  };
  writeConfig(config);
  console.log("\u2705 PostgreSQL added to DevStack\n");
  console.log("----Configuration----");
  console.log(`  Port:      ${config.services.postgres.port}`);
  console.log(`  User:      ${config.services.postgres.username}`);
  console.log(`  Database:  ${config.services.postgres.database}`);
  console.log("\nNext steps:");
  console.log("  devstack generate");
  console.log("  devstack up");
}

// src/functions/runGenerateConfig.ts
var import_yaml = __toESM(require("yaml"), 1);
var import_node_path3 = __toESM(require("path"), 1);
var import_node_fs3 = __toESM(require("fs"), 1);
function addPostgresService(config, composeConfig) {
  if (!config.services.postgres?.enabled) {
    return;
  }
  const postgres = config.services.postgres;
  composeConfig.services.postgres = {
    image: postgres.image,
    container_name: postgres.containerName,
    ports: [`${postgres.port}:5432`],
    environment: {
      POSTGRES_USER: postgres.username,
      POSTGRES_PASSWORD: postgres.password,
      POSTGRES_DB: postgres.database
    }
  };
  if (postgres.volume) {
    composeConfig.services.postgres.volumes = [
      "postgres_data:/var/lib/postgresql/data"
    ];
    composeConfig.volumes = {
      ...composeConfig.volumes || {},
      postgres_data: {}
    };
  }
}
function runGenerateConfig() {
  const config = readConfig();
  if (!config.services || Object.keys(config.services).length === 0) {
    console.error("\u26A0\uFE0F No services configured. Please add a service before generating the configuration.");
    process.exit(1);
  }
  const composeConfig = {
    services: {}
  };
  addPostgresService(config, composeConfig);
  if (Object.keys(composeConfig.services).length === 0) {
    console.error("\u26A0\uFE0F No supported services found to generate.");
    process.exit(1);
  }
  const yamlContent = import_yaml.default.stringify(composeConfig);
  const outputFileName = config.composeFileName || "docker-compose.devstack.yml";
  const outputPath = import_node_path3.default.join(process.cwd(), outputFileName);
  import_node_fs3.default.writeFileSync(outputPath, yamlContent, "utf-8");
  console.log("\u2705 Docker Compose configuration generated successfully");
  console.log(`\u{1F4C4} File: ${outputPath}`);
  console.log("");
  console.log("Next steps:");
  console.log("  devstack up");
}

// src/functions/runUpConfig.ts
var import_node_path4 = __toESM(require("path"), 1);
var import_node_fs4 = __toESM(require("fs"), 1);
var import_node_child_process = require("child_process");
function runUpConfig(options = {}) {
  const config = readConfig();
  const composeFileName = config.composeFileName || "docker-compose.devstack.yml";
  const composePath = import_node_path4.default.join(process.cwd(), composeFileName);
  if (!import_node_fs4.default.existsSync(composePath)) {
    console.error(`\u26A0\uFE0F ${composeFileName} not found.`);
    console.error("Please run `devstack generate` first.");
    process.exit(1);
  }
  const args = ["compose", "-f", composeFileName, "up", "-d"];
  if (options.detach) {
    args.push("-d");
  }
  if (options.build) {
    args.push("--build");
  }
  console.log("\u{1F680} Starting DevStack services...");
  console.log(`\u{1F4C4} Using: ${composeFileName}`);
  console.log("");
  const result = (0, import_node_child_process.spawnSync)("docker", args, {
    stdio: "inherit",
    cwd: process.cwd()
  });
  if (result.error) {
    console.error("\u274C Failed to run Docker Compose.");
    console.error(result.error.message);
    process.exit(1);
  }
  if (result.status !== 0) {
    console.error("\u274C Docker Compose exited with an error.");
    process.exit(result.status ?? 1);
  }
  console.log("");
  console.log("\u2705 DevStack services are up");
}

// src/functions/runDownConfig.ts
var import_child_process = require("child_process");
function runDownConfig(options) {
  console.log("\n\u23F9  Stopping DevStack services...\n");
  const config = readConfig();
  if (!config.composeFileName) {
    console.error("\u26A0\uFE0F No compose file name specified in config.");
    process.exit(1);
  }
  const args = ["compose", "-f", config.composeFileName, "down"];
  if (options.removeVolumes) {
    args.push("-v");
  }
  if (options.removeImages) {
    args.push("--rmi", "all");
  }
  const result = (0, import_child_process.spawnSync)("docker", args, {
    stdio: "inherit",
    shell: true
  });
  if (result.status !== 0) {
    console.error("\n\u274C Failed to stop DevStack services.");
    process.exit(result.status ?? 1);
  }
  console.log("\n\u{1F9F9} Cleaning Docker builder cache...\n");
  (0, import_child_process.spawnSync)(
    "docker",
    ["builder", "prune", "-f"],
    { stdio: "inherit" }
  );
  process.exit(result.status ?? 0);
  console.log("\n\u2705 DevStack stopped and cleaned successfully.\n");
}

// src/index.ts
var program = new import_commander.Command();
var cyan = "\x1B[36m";
var magenta = "\x1B[35m";
var green = "\x1B[32m";
var yellow = "\x1B[33m";
var blue = "\x1B[34m";
var bold = "\x1B[1m";
var reset = "\x1B[0m";
var addCommand = program.command("add").description("Add a service to your DevStack project");
var logsCommand = program.command("logs").description("View logs of DevStack services").option("-s, --service <service>", "Specify a service to view logs for (e.g., postgres)");
program.name("devstack").description("A CLI tool for managing your development stack").version("1.0.0");
program.command("init").description("Initialize a new DevStack project").argument("[project name]", "project name").action((projectName) => {
  createDevstackConfig(projectName);
  console.log("\nNext steps:");
  console.log("  devstack add postgres");
  console.log("  devstack generate");
  console.log("  devstack up");
});
program.command("gen").description("Generate Docker Compose configuration based on devstack.config.json").action(() => {
  runGenerateConfig();
});
addCommand.command("postgres").description("Add a PostgreSQL service to your DevStack project").option("-p, --port <port>", "Port to expose PostgreSQL on", "5432").option("-u, --user <user>", "PostgreSQL username", "postgres").option("-P, --password <password>", "PostgreSQL password", "postgres").option("-d, --database <database>", "PostgreSQL database name", "postgres").action((options) => {
  runAddPostgresConfig(options);
});
program.command("up").description("Start DevStack services").option("-b, --build", "build images before starting", false).action((options) => {
  runUpConfig(options);
});
program.command("down").description("Stop DevStack services").option("-v, --remove-volumes", "Remove associated volumes used by the stack", false).option("-i, --remove-images", "Remove images used by the stack", false).option("-a, --all", "Remove all associated resources (volumes and images)", false).action((options) => {
  if (options.all) {
    options.removeVolumes = true;
    options.removeImages = true;
  }
  runDownConfig(options);
});
logsCommand.action(() => {
  console.log("\u{1F6A7} Logs functionality is not implemented yet. Stay tuned! \u{1F6A7}");
});
function printHeader() {
  console.log();
  const art = [
    "      $$\\                      $$$$$$\\    $$\\                         $$\\       ",
    "      $$ |                    $$  __$$\\   $$ |                        $$ |      ",
    " $$$$$$$ | $$$$$$\\ $$\\    $$\\ $$ /  \\__|$$$$$$\\    $$$$$$\\   $$$$$$$\\ $$ |  $$\\ ",
    "$$  __$$ |$$  __$$\\\\$$\\  $$  |\\$$$$$$\\  \\_$$  _|   \\____$$\\ $$  _____|$$ | $$  |",
    "$$ /  $$ |$$$$$$$$ |\\$$\\$$  /  \\____$$\\   $$ |     $$$$$$$ |$$ /      $$$$$$  / ",
    "$$ |  $$ |$$   ____| \\$$$  /  $$\\   $$ |  $$ |$$\\ $$  __$$ |$$ |      $$  _$$<  ",
    "\\$$$$$$$ |\\$$$$$$$\\   \\$  /   \\$$$$$$  |  \\$$$$  |\\$$$$$$$ |\\$$$$$$$\\ $$ | \\$$\\ ",
    " \\_______| \\_______|   \\_/     \\______/    \\____/  \\_______| \\_______|\\__|  \\__|"
  ].join("\n");
  console.log(`${magenta}${bold}${art}${reset}`);
  console.log(`${cyan}${bold}devstack${reset} \u2014 A CLI tool for managing your development stack`);
  console.log(`${bold}${cyan}Version:${reset} ${green}1.0.0${reset}  ${bold}${cyan}Node:${reset} ${yellow}${process.version}${reset}  ${bold}${cyan}OS:${reset} ${blue}${process.platform}${reset}`);
  console.log();
  console.log();
}
printHeader();
program.parse();
