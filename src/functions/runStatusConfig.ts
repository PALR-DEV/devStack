import path from "node:path";
import fs from "node:fs";
import { readConfig } from "../utils/config.js";
import { spawnSync } from "node:child_process";

export function runStatusConfig(service?: string) {
    const config = readConfig();
    const composeFileName = config.composeFileName || "docker-compose.devstack.yml";
    const composePath = path.join(process.cwd(), composeFileName);

    if (!fs.existsSync(composePath)) {
        console.error(`⚠️ ${composeFileName} not found.`);
        console.error("Please run `devstack gen` first.");
        process.exit(1);
    }

    const args = ["compose", "-f", composeFileName, "ps"];

    if (service) {
        args.push(service);
        console.log(`📊 Showing status for service: ${service}`);
    } else {
        console.log("📊 Showing status for all services...");
    }
    console.log(`📄 Using: ${composeFileName}`);
    console.log("");

    const result = spawnSync("docker", args, {
        stdio: "inherit",
        cwd: process.cwd(),
    });

    if (result.error) {
        console.error("❌ Failed to run Docker Compose ps.");
        console.error(result.error.message);
        process.exit(1);
    }

    if (result.status !== 0) {
        console.error("❌ Docker Compose ps exited with an error.");
        process.exit(result.status ?? 1);
    }
}
