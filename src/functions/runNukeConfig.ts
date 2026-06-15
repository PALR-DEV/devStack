import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { readConfig, writeConfig } from "../utils/config.js";

export function runNukeConfig(options: { yes: boolean }) {
    if (!options.yes) {
        console.log("⚠️  This will:");
        console.log("     • Stop all services and remove volumes & images");
        console.log("     • Delete the compose file");
        console.log("     • Clear all services from devstack.config.json");
        console.log();
        console.log("   Confirm: devstack nuke --yes");
        return;
    }

    const config = readConfig();
    const composeFileName = config.composeFileName ?? 'docker-compose.devstack.yml';
    const composePath = path.join(process.cwd(), composeFileName);

    if (fs.existsSync(composePath)) {
        const dockerCheck = spawnSync('docker', ['info'], { stdio: 'ignore' });
        if (!dockerCheck.error && dockerCheck.status === 0) {
            console.log("⏹  Stopping services and removing all resources...\n");
            spawnSync('docker', ['compose', '-f', composeFileName, 'down', '-v', '--rmi', 'all'], {
                stdio: 'inherit',
            });
        } else {
            console.log("⚠️  Docker is not running — skipping container cleanup.");
        }

        fs.rmSync(composePath);
        console.log(`\n🗑️  Deleted ${composeFileName}`);
    }

    config.services = {};
    writeConfig(config);
    console.log(`🗑️  Cleared all services from devstack.config.json`);
    console.log(`\n✅ DevStack reset. Run \`devstack add <service>\` to start fresh.`);
}
