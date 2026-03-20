import { readConfig, writeConfig } from "../utils/config.js";
import type { MongoServiceConfig } from "../models/devstack-config.js";

export function runAddMongoConfig(options: MongoServiceConfig) {
    const config = readConfig();

    if (!config.services) {
        config.services = {};
    }

    if (config.services.mongo) {
        console.error("⚠️ MongoDB is already configured.");
        process.exit(1);
    }

    const port = options.port ? Number(options.port) : 27017;

    if (Number.isNaN(port)) {
        console.error("⚠️ Invalid port number.");
        process.exit(1);
    }

    config.services.mongo = {
        enabled: true,
        image: "mongo:latest",
        containerName: `${config.projectName}_mongo`,
        port: port,
        username: options.username || "mongo",
        password: options.password || "mongo",
        database: options.database || "mongo",
        volume: true,
    } as MongoServiceConfig;

    writeConfig(config);
    console.log("✅ MongoDB added to DevStack\n");

    console.log("----Configuration----");
    console.log(`  Port:      ${config.services.mongo.port}`);
    console.log(`  User:      ${config.services.mongo.username}`);
    console.log(`  Database:  ${config.services.mongo.database}`);
    console.log("\nNext steps:");
    console.log("  devstack generate");
    console.log("  devstack up");
}
