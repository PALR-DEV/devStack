import { readConfig, writeConfig, printAddNextSteps } from "../utils/config.js";
import type { ElasticsearchServiceConfig } from "../models/devstack-config.js";

export function runAddElasticsearchConfig(options: ElasticsearchServiceConfig) {
    const config = readConfig();

    if (!config.services) {
        config.services = {};
    }

    if (config.services.elasticsearch) {
        console.error("⚠️ Elasticsearch is already configured.");
        process.exit(1);
    }

    const port = options.port ? Number(options.port) : 9200;

    if (Number.isNaN(port)) {
        console.error("⚠️ Invalid port number.");
        process.exit(1);
    }

    config.services.elasticsearch = {
        enabled: true,
        image: "elasticsearch:8.17.0",
        containerName: `${config.projectName}_elasticsearch`,
        port,
        ...(options.password ? { password: options.password } : {}),
        volume: true,
    } as ElasticsearchServiceConfig;

    writeConfig(config);
    console.log("✅ Elasticsearch added to DevStack\n");

    console.log("----Configuration----");
    console.log(`  Port:     ${config.services.elasticsearch.port}`);
    console.log(`  Security: ${options.password ? "enabled" : "disabled (dev mode)"}`);
    printAddNextSteps(config);
}
