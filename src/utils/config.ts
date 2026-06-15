import fs from "node:fs";
import type { ComposeConfig, DevStackConfig } from "../models/devstack-config.js";
import path from "node:path";
import YAML from "yaml";

export function getConfigPath(): string {
  return path.join(process.cwd(), "devstack.config.json");
}

export function readConfig(): DevStackConfig {
  const configPath = getConfigPath();
  if (!fs.existsSync(configPath)) {
    console.error("No devstack.config.json found in the current directory.");
    process.exit(1);
  }
  const raw = fs.readFileSync(configPath, "utf-8");
  return JSON.parse(raw) as DevStackConfig;
}

export function writeConfig(config: DevStackConfig): void {
  const configPath = getConfigPath();
  fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`, "utf-8");
}

export function convertToYAML(obj: any): string {
  return YAML.stringify(obj);
}

export function requireComposeFile(config: DevStackConfig): string {
  const composeFileName = config.composeFileName ?? "docker-compose.devstack.yml";
  const composePath = path.join(process.cwd(), composeFileName);
  if (!fs.existsSync(composePath)) {
    console.error(`⚠️ ${composeFileName} not found. Please run \`devstack gen\` first.`);
    process.exit(1);
  }
  return composeFileName;
}

export function addNamedVolume(composeConfig: ComposeConfig, name: string): void {
  composeConfig.volumes = { ...(composeConfig.volumes ?? {}), [name]: {} };
}

