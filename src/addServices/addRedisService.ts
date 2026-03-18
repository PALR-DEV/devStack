import type { DevStackConfig, ComposeConfig } from "../models/devstack-config.js";



export function addRedisService(config:DevStackConfig, composeConfig: ComposeConfig): void {
    const redis = config.services.redis;
    if(!redis?.enabled) return;

    composeConfig.services.redis = {
        image: redis.image,
        ports: redis.port ? [`${redis.port}:6379`] : undefined,
        command: redis.password ? `redis-server --appendonly yes --requirepass ${redis.password}` : "redis-server --appendonly yes",
        ...(redis.volume ? { volumes: ['redis_data:/data'] } : {}),
    };

    
    // Add volume definition if volume is enabled
    if(redis.volume) {
        composeConfig.volumes = {
            ...(composeConfig.volumes || {}),
            redis_data: {},
        };
    }

}