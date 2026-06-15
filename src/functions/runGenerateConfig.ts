import { convertToYAML, readConfig } from "../utils/config.js";
import type { ComposeConfig, DevStackConfig } from "../models/devstack-config.js";
import path from "node:path";
import fs from "node:fs";
import { addPostgresService } from "../addServices/addPostgresService.js";
import { addRedisService } from "../addServices/addRedisService.js";
import { addMongoService } from "../addServices/addMongoService.js";
import { addMySQLService } from "../addServices/addMySQLService.js";
import { addRabbitMQService } from "../addServices/addRabbitMQService.js";
import { addElasticsearchService } from "../addServices/addElasticsearchService.js";
import { addMinIOService } from "../addServices/addMinIOService.js";
import { addMailpitService } from "../addServices/addMailpitService.js";

const serviceGenerators: Record<string, (config: DevStackConfig, composeConfig: ComposeConfig) => void> = {
    postgres: addPostgresService,
    redis: addRedisService,
    mongo: addMongoService,
    mysql: addMySQLService,
    rabbitmq: addRabbitMQService,
    elasticsearch: addElasticsearchService,
    minio: addMinIOService,
    mailpit: addMailpitService,
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
    for (const serviceName in config.services) {
        const generator = serviceGenerators[serviceName];
        if (generator) {
            generator(config, composeConfig);
        } else {
            console.warn(`⚠️ No generator found for service "${serviceName}". Skipping.`);
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