import type { DevStackConfig, ComposeConfig } from "../models/devstack-config.js";
import { addNamedVolume } from "../utils/config.js";

export function addMongoService(config: DevStackConfig, composeConfig: ComposeConfig): void {
    const mongo = config.services.mongo;
    if (!mongo?.enabled) return;

    composeConfig.services.mongo = {
        image: mongo.image,
        container_name: mongo.containerName,
        ports: mongo.port ? [`${mongo.port}:27017`] : undefined,
        environment: {
            MONGO_INITDB_ROOT_USERNAME: mongo.username,
            MONGO_INITDB_ROOT_PASSWORD: mongo.password,
            MONGO_INITDB_DATABASE: mongo.database,
        },
        ...(mongo.volume ? { volumes: ['mongo_data:/data/db'] } : {}),
        ...(mongo.restart ? { restart: mongo.restart } : {}),
    };

    if (mongo.volume) {
        addNamedVolume(composeConfig, 'mongo_data');
    }
}
