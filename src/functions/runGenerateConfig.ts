import { convertToYAML, readConfig, writeConfig } from "../utils/config.js";
import type { DevStackConfig } from "../models/devstack-config.js";
import YAML from "yaml";
import path from "node:path";
import fs from "node:fs";
import { addPostgresService } from "../addServices/addPostgresService.js";
import { addRedisService } from "../addServices/addRedisService.js";


//TODO: refactor the functions to be more modular instead of creating a function for each service

type ComposeConfig = {
  services: Record<string, any>;
  volumes?: Record<string, any>;
};



export function runGenerateConfig() {
    const config: DevStackConfig = readConfig();

    if (!config.services || Object.keys(config.services).length === 0) {
        console.error("⚠️ No services configured. Please add a service before generating the configuration.");
        process.exit(1);
    }

    const composeConfig: ComposeConfig = {
        services: {}
    };
    for(const serviceName in config.services) {
        switch(serviceName) {
            case "postgres":
                addPostgresService(config, composeConfig);
                break;
            case "redis":
                addRedisService(config, composeConfig);
                break;
        }
    }

    if(Object.keys(composeConfig.services).length === 0) {
        console.error("⚠️ No supported services found to generate.");
        process.exit(1);
    }
    const yamlContent = convertToYAML(composeConfig);
    const outputFileName = config.composeFileName || "docker-compose.devstack.yml";
    const outputPath = path.join(process.cwd(), outputFileName);
    fs.writeFileSync(outputPath, yamlContent, 'utf-8');
    console.log("✅ Docker Compose configuration generated successfully");
    console.log(`📄 File: ${outputPath}`);
    console.log("");
    console.log("Next steps:");
    console.log("  devstack up");

}