import { readConfig, writeConfig, printAddNextSteps } from "../utils/config.js";
import type { MySQLServiceConfig } from "../models/devstack-config.js";

export function runAddMySQLConfig(options: MySQLServiceConfig) {
    const config = readConfig();

    if (!config.services) {
        config.services = {};
    }

    if (config.services.mysql) {
        console.error("⚠️ MySQL is already configured.");
        process.exit(1);
    }

    const port = options.port ? Number(options.port) : 3306;

    if (Number.isNaN(port)) {
        console.error("⚠️ Invalid port number.");
        process.exit(1);
    }

    config.services.mysql = {
        enabled: true,
        image: "mysql:8.4",
        containerName: `${config.projectName}_mysql`,
        port,
        rootPassword: options.rootPassword || "rootpassword",
        username: options.username || "mysql",
        password: options.password || "mysql",
        database: options.database || "mysql",
        volume: true,
    } as MySQLServiceConfig;

    writeConfig(config);
    console.log("✅ MySQL added to DevStack\n");

    console.log("----Configuration----");
    console.log(`  Port:      ${config.services.mysql.port}`);
    console.log(`  User:      ${config.services.mysql.username}`);
    console.log(`  Database:  ${config.services.mysql.database}`);
    printAddNextSteps(config);
}
