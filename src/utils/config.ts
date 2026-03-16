import fs from "node:fs";
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


