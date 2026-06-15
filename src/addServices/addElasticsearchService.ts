import type { DevStackConfig, ComposeConfig } from "../models/devstack-config.js";
import { addNamedVolume } from "../utils/config.js";

export function addElasticsearchService(config: DevStackConfig, composeConfig: ComposeConfig): void {
    const es = config.services.elasticsearch;
    if (!es?.enabled) return;

    const environment: Record<string, string> = {
        'discovery.type': 'single-node',
        ES_JAVA_OPTS: '-Xms512m -Xmx512m',
        'xpack.security.enabled': es.password ? 'true' : 'false',
        ...(es.password ? { ELASTIC_PASSWORD: es.password } : {}),
    };

    composeConfig.services.elasticsearch = {
        image: es.image,
        container_name: es.containerName,
        ports: es.port ? [`${es.port}:9200`] : undefined,
        environment,
        ...(es.volume ? { volumes: ['es_data:/usr/share/elasticsearch/data'] } : {}),
        ...(es.restart ? { restart: es.restart } : {}),
    };

    if (es.volume) {
        addNamedVolume(composeConfig, 'es_data');
    }
}
