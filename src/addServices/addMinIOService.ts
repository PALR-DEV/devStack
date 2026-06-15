import type { DevStackConfig, ComposeConfig } from "../models/devstack-config.js";
import { addNamedVolume } from "../utils/config.js";

export function addMinIOService(config: DevStackConfig, composeConfig: ComposeConfig): void {
    const minio = config.services.minio;
    if (!minio?.enabled) return;

    const ports: string[] = [];
    if (minio.port) ports.push(`${minio.port}:9000`);
    if (minio.consolePort) ports.push(`${minio.consolePort}:9001`);

    composeConfig.services.minio = {
        image: minio.image,
        container_name: minio.containerName,
        ports: ports.length > 0 ? ports : undefined,
        environment: {
            MINIO_ROOT_USER: minio.rootUser,
            MINIO_ROOT_PASSWORD: minio.rootPassword,
        },
        command: 'server /data --console-address ":9001"',
        ...(minio.volume ? { volumes: ['minio_data:/data'] } : {}),
        ...(minio.restart ? { restart: minio.restart } : {}),
    };

    if (minio.volume) {
        addNamedVolume(composeConfig, 'minio_data');
    }
}
