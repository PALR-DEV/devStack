import fs from "node:fs";
import path from "node:path";
import type { DevStackConfig } from "../models/devstack-config.js";

export function createDevstackConfig(projectName?:string) {
    const rootDir = process.cwd();
    const configPath = path.join(rootDir, 'devstack.config.json');
    const config: DevStackConfig = {
        projectName: projectName || path.basename(rootDir),
        "version": "1.0.0",
        composeFileName: "docker-compose.devstack.yml",
        services:{}
    };

    if(fs.existsSync(configPath)) {
        console.error("A devstack.config.json already exists in this directory.");
        process.exit(1);
    }

    fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`, "utf-8");
    console.log("✅ DevStack initialized");
    console.log(`✅ Created ${configPath}`);
}