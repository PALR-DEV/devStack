import { readConfig, writeConfig } from "../utils/config.js";

export function runRemoveConfig(service: string) {
    const config = readConfig();

    if (!(service in config.services)) {
        console.error(`⚠️ Service "${service}" is not configured.`);
        console.error(`   Configured services: ${Object.keys(config.services).join(', ') || 'none'}`);
        process.exit(1);
    }

    delete (config.services as Record<string, unknown>)[service];
    writeConfig(config);

    console.log(`✅ Removed "${service}" from DevStack\n`);
    console.log("Next steps:");
    console.log("  devstack gen    ← regenerate the compose file");
    console.log("  devstack up     ← restart without the removed service");
}
