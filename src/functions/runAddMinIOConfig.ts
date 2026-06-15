import { readConfig, writeConfig, printAddNextSteps } from "../utils/config.js";
import type { MinIOServiceConfig } from "../models/devstack-config.js";

export function runAddMinIOConfig(options: MinIOServiceConfig) {
    const config = readConfig();

    if (!config.services) {
        config.services = {};
    }

    if (config.services.minio) {
        console.error("⚠️ MinIO is already configured.");
        process.exit(1);
    }

    const port = options.port ? Number(options.port) : 9000;
    const consolePort = options.consolePort ? Number(options.consolePort) : 9001;

    if (Number.isNaN(port) || Number.isNaN(consolePort)) {
        console.error("⚠️ Invalid port number.");
        process.exit(1);
    }

    config.services.minio = {
        enabled: true,
        image: "minio/minio:latest",
        containerName: `${config.projectName}_minio`,
        port,
        consolePort,
        rootUser: options.rootUser || "minioadmin",
        rootPassword: options.rootPassword || "minioadmin",
        volume: true,
    } as MinIOServiceConfig;

    writeConfig(config);
    console.log("✅ MinIO added to DevStack\n");

    console.log("----Configuration----");
    console.log(`  API Port:     ${config.services.minio.port}`);
    console.log(`  Console Port: ${config.services.minio.consolePort}`);
    console.log(`  Root User:    ${config.services.minio.rootUser}`);
    console.log("  Console URL:  http://localhost:9001");
    printAddNextSteps(config);
}
