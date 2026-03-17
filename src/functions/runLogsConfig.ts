import path from "node:path";
import fs from "node:fs";
import { readConfig } from "../utils/config.js";
import { spawn } from "node:child_process";

export function runLogsConfig(service?: string) {
    const config = readConfig();
    const composeFileName = config.composeFileName || "docker-compose.devstack.yml";
    const composePath = path.join(process.cwd(), composeFileName);

    if (!fs.existsSync(composePath)) {
        console.error(`⚠️ ${composeFileName} not found.`);
        console.error("Please run `devstack generate` first.");
        process.exit(1);
    }

    const args = ["compose", "-f", composeFileName, "logs", "--follow"];

    if (service) {
        args.push(service);
        console.log(`📋 Following logs for service: ${service}`);
    } else {
        console.log("📋 Following logs for all services...");
    }
    console.log(`📄 Using: ${composeFileName}`);
    console.log("");

    const child = spawn("docker", args, {
        stdio: "inherit",
        cwd: process.cwd(),
    });

    child.on("error", (err) => {
        console.error("❌ Failed to retrieve Docker Compose logs.");
        console.error(err.message);
        process.exit(1);
    });

    child.on("close", (code) => {
        if (code !== 0) {
            console.error("❌ Docker Compose logs exited with an error.");
            process.exit(code ?? 1);
        }
    });
}
