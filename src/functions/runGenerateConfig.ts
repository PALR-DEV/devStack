import { readConfig, writeConfig } from "../utils/config.js";
import type { DevStackConfig } from "../models/devstack-config.js";
import YAML from "yaml";
import path from "node:path";
import fs from "node:fs";



type ComposeConfig = {
  services: Record<string, any>;
  volumes?: Record<string, any>;
};

function addPostgresService(config:DevStackConfig, composeConfig:ComposeConfig) {
    if(!config.services.postgres?.enabled) {
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
            POSTGRES_DB: postgres.database,
        },
    };

    if(postgres.volume){
        composeConfig.services.postgres.volumes = [
            "postgres_data:/var/lib/postgresql/data",
        ];

        composeConfig.volumes = {
            ...(composeConfig.volumes || {}),
            postgres_data: {},
        };
    }
}

export function runGenerateConfig() {
    const config: DevStackConfig = readConfig();

    if (!config.services || Object.keys(config.services).length === 0) {
        console.error("⚠️ No services configured. Please add a service before generating the configuration.");
        process.exit(1);
    }

    const composeConfig: ComposeConfig = {
        services: {}
    };

    addPostgresService(config, composeConfig);
    if(Object.keys(composeConfig.services).length === 0) {
        console.error("⚠️ No supported services found to generate.");
        process.exit(1);
    }
    const yamlContent = YAML.stringify(composeConfig);
    const outputFileName = config.composeFileName || "docker-compose.devstack.yml";
    const outputPath = path.join(process.cwd(), outputFileName);
    fs.writeFileSync(outputPath, yamlContent, 'utf-8');
    console.log("✅ Docker Compose configuration generated successfully");
    console.log(`📄 File: ${outputPath}`);
    console.log("");
    console.log("Next steps:");
    console.log("  devstack up");

}