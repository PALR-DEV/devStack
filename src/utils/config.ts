import fs, { readFileSync } from "node:fs";
import type { DevStackConfig } from "../models/devstack-config.js";
import path from "node:path";

export function getConfigPath(): string {
  return path.join(process.cwd(), "devstack.config.json");
}


export function readConfig():DevStackConfig{
    const configPath = getConfigPath();
    if(!fs.existsSync(configPath)) {
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


export function getCliVersion(): string {
  try {
    const packageJsonPath = new URL('../package.json', import.meta.url);
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as { version?: string };
    return packageJson.version ?? '0.0.0';
  } catch {
    return '0.0.0';
  }
}

