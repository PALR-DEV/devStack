import type { DevStackConfig, ComposeConfig } from "../models/devstack-config.js";
import { addNamedVolume } from "../utils/config.js";

export function addMySQLService(config: DevStackConfig, composeConfig: ComposeConfig): void {
    const mysql = config.services.mysql;
    if (!mysql?.enabled) return;

    composeConfig.services.mysql = {
        image: mysql.image,
        container_name: mysql.containerName,
        ports: mysql.port ? [`${mysql.port}:3306`] : undefined,
        environment: {
            MYSQL_ROOT_PASSWORD: mysql.rootPassword,
            MYSQL_USER: mysql.username,
            MYSQL_PASSWORD: mysql.password,
            MYSQL_DATABASE: mysql.database,
        },
        ...(mysql.volume ? { volumes: ['mysql_data:/var/lib/mysql'] } : {}),
        ...(mysql.restart ? { restart: mysql.restart } : {}),
    };

    if (mysql.volume) {
        addNamedVolume(composeConfig, 'mysql_data');
    }
}
