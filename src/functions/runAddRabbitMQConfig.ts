import { readConfig, writeConfig, printAddNextSteps } from "../utils/config.js";
import type { RabbitMQServiceConfig } from "../models/devstack-config.js";

export function runAddRabbitMQConfig(options: RabbitMQServiceConfig) {
    const config = readConfig();

    if (!config.services) {
        config.services = {};
    }

    if (config.services.rabbitmq) {
        console.error("⚠️ RabbitMQ is already configured.");
        process.exit(1);
    }

    const port = options.port ? Number(options.port) : 5672;
    const managementPort = options.managementPort ? Number(options.managementPort) : 15672;

    if (Number.isNaN(port) || Number.isNaN(managementPort)) {
        console.error("⚠️ Invalid port number.");
        process.exit(1);
    }

    config.services.rabbitmq = {
        enabled: true,
        image: "rabbitmq:4-management",
        containerName: `${config.projectName}_rabbitmq`,
        port,
        managementPort,
        username: options.username || "guest",
        password: options.password || "guest",
        volume: true,
    } as RabbitMQServiceConfig;

    writeConfig(config);
    console.log("✅ RabbitMQ added to DevStack\n");

    console.log("----Configuration----");
    console.log(`  AMQP Port:       ${config.services.rabbitmq.port}`);
    console.log(`  Management Port: ${config.services.rabbitmq.managementPort}`);
    console.log(`  User:            ${config.services.rabbitmq.username}`);
    console.log("  Management UI:   http://localhost:15672");
    printAddNextSteps(config);
}
