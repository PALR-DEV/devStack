import path from "node:path";
import fs from "node:fs";
import { readConfig } from "../utils/config.js";
import { spawnSync } from "node:child_process";

export function runRestartConfig(service?: string) {
    const config = readConfig();
    const composeFileName = config.composeFileName || "docker-compose.devstack.yml";
    const composePath = path.join(process.cwd(), composeFileName);

    if (!fs.existsSync(composePath)) {
        console.error(`⚠️ ${composeFileName} not found.`);
        console.error("Please run `devstack generate` first.");
        process.exit(1);
    }

    const args = ["compose", "-f", composeFileName, "restart"];

    if (service) {
        args.push(service);
        console.log(`🔄 Restarting service: ${service}`);
    } else {
        console.log("🔄 Restarting all DevStack services...");
    }
    console.log(`📄 Using: ${composeFileName}`);
    console.log("");

    const result = spawnSync("docker", args, {
        stdio: "inherit",
        cwd: process.cwd(),
    });

    if (result.error) {
        console.error("❌ Failed to restart Docker Compose services.");
        console.error(result.error.message);
        process.exit(1);
    }

    if (result.status !== 0) {
        console.error("❌ Docker Compose restart exited with an error.");
        process.exit(result.status ?? 1);
    }

    if (service) {
        console.log(`\n✅ Service "${service}" restarted successfully.`);
    } else {
        console.log("\n✅ All DevStack services restarted successfully.");
    }
}
