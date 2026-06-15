import type { DevStackConfig, ComposeConfig } from "../models/devstack-config.js";
import { addNamedVolume } from "../utils/config.js";

export function addRedisService(config: DevStackConfig, composeConfig: ComposeConfig): void {
    const redis = config.services.redis;
    if (!redis?.enabled) return;

    composeConfig.services.redis = {
        image: redis.image,
        container_name: redis.containerName,
        ports: redis.port ? [`${redis.port}:6379`] : undefined,
        command: redis.password
            ? `redis-server --appendonly yes --requirepass ${redis.password}`
            : 'redis-server --appendonly yes',
        ...(redis.volume ? { volumes: ['redis_data:/data'] } : {}),
        ...(redis.restart ? { restart: redis.restart } : {}),
    };

    if (redis.volume) {
        addNamedVolume(composeConfig, 'redis_data');
    }
}
