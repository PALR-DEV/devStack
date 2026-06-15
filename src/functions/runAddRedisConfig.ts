import { readConfig, writeConfig, printAddNextSteps } from "../utils/config.js";
import type { RedisServiceConfig } from "../models/devstack-config.js";

export function runAddRedisConfig(options: RedisServiceConfig){
    const config = readConfig();
    if(!config.services) {
        config.services = {};
    }

    if(config.services.redis) {
        console.error("⚠️ Redis is already configured.");
        process.exit(1);
    }

    const port = options.port ? Number(options.port) : 6379;

    if(Number.isNaN(port)) {
        console.error("⚠️ Invalid port number.");
        process.exit(1);
    }

    config.services.redis = {
        enabled: true,
        image: "redis:7",
        containerName: `${config.projectName}_redis`,
        port: port,
        password: options.password,
        volume: true,
    } as RedisServiceConfig;

    writeConfig(config);
    console.log("✅ Redis added to DevStack\n");

    console.log("----Configuration----");
    console.log(`  Port:      ${config.services.redis.port}`);
    if (config.services.redis.password) {
        console.log(`  Password:  set`);
    }
    printAddNextSteps(config);
}