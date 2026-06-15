import type { DevStackConfig, ComposeConfig } from "../models/devstack-config.js";
import { addNamedVolume } from "../utils/config.js";

export function addRabbitMQService(config: DevStackConfig, composeConfig: ComposeConfig): void {
    const rabbitmq = config.services.rabbitmq;
    if (!rabbitmq?.enabled) return;

    const ports: string[] = [];
    if (rabbitmq.port) ports.push(`${rabbitmq.port}:5672`);
    if (rabbitmq.managementPort) ports.push(`${rabbitmq.managementPort}:15672`);

    composeConfig.services.rabbitmq = {
        image: rabbitmq.image,
        container_name: rabbitmq.containerName,
        ports: ports.length > 0 ? ports : undefined,
        environment: {
            RABBITMQ_DEFAULT_USER: rabbitmq.username,
            RABBITMQ_DEFAULT_PASS: rabbitmq.password,
        },
        ...(rabbitmq.volume ? { volumes: ['rabbitmq_data:/var/lib/rabbitmq'] } : {}),
        ...(rabbitmq.restart ? { restart: rabbitmq.restart } : {}),
    };

    if (rabbitmq.volume) {
        addNamedVolume(composeConfig, 'rabbitmq_data');
    }
}
