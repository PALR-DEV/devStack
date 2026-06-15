import { readConfig, requireComposeFile } from "../utils/config.js";
import { spawn } from "node:child_process";

export function runLogsConfig(service?: string) {
    const config = readConfig();
    const composeFileName = requireComposeFile(config);

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
