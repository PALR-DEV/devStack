import type { DevStackConfig, ComposeConfig } from "../models/devstack-config.js";
import { addNamedVolume } from "../utils/config.js";

export function addMailpitService(config: DevStackConfig, composeConfig: ComposeConfig): void {
    const mailpit = config.services.mailpit;
    if (!mailpit?.enabled) return;

    const ports: string[] = [];
    if (mailpit.smtpPort) ports.push(`${mailpit.smtpPort}:1025`);
    if (mailpit.uiPort) ports.push(`${mailpit.uiPort}:8025`);

    composeConfig.services.mailpit = {
        image: mailpit.image,
        container_name: mailpit.containerName,
        ports: ports.length > 0 ? ports : undefined,
        ...(mailpit.volume ? { volumes: ['mailpit_data:/data'], environment: { MP_DATA_FILE: '/data/mailpit.db' } } : {}),
        ...(mailpit.restart ? { restart: mailpit.restart } : {}),
    };

    if (mailpit.volume) {
        addNamedVolume(composeConfig, 'mailpit_data');
    }
}
