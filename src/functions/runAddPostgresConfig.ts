import { readConfig, writeConfig } from "../utils/config.js";
import type {  PostgresServiceConfig } from "../models/devstack-config.js";

export function runAddPostgresConfig(options:PostgresServiceConfig){
    const config = readConfig();

    if(!config.services) {
        config.services = {};
    }

    if(config.services.postgres) {
        console.error("⚠️ Postgres is already configured.");
        process.exit(1);
    }

    const port = options.port ? Number(options.port) : 5432;

    if(Number.isNaN(port)){
        console.error("⚠️ Invalid port number.");
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
        volume: true,
    } as PostgresServiceConfig;

    writeConfig(config);
        console.log("✅ PostgreSQL added to DevStack\n");

        console.log("----Configuration----");
        console.log(`  Port:      ${config.services.postgres.port}`);
        console.log(`  User:      ${config.services.postgres.username}`);
        console.log(`  Database:  ${config.services.postgres.database}`);
        console.log("\nNext steps:");
        console.log("  devstack generate");
        console.log("  devstack up");
 }