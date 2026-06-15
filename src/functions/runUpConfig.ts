import { readConfig, requireComposeFile } from "../utils/config.js";
import { spawnSync } from "node:child_process";

export interface UpOptions {
  detach?: boolean;
  build?: boolean;
}

export function runUpConfig(options: UpOptions = {}) {
    const config = readConfig();
    const composeFileName = requireComposeFile(config);

    const args = ["compose", "-f", composeFileName, "up" , '-d'];

    if(options.detach) {
        args.push("-d");
    }

    if(options.build) {
        args.push("--build");
    }
    console.log("🚀 Starting DevStack services...");
    console.log(`📄 Using: ${composeFileName}`);
    console.log("");

    const result = spawnSync('docker', args, {
        stdio: 'inherit',
        cwd: process.cwd(),
    });

    if(result.error) {
        console.error("❌ Failed to run Docker Compose.");
        console.error(result.error.message);
        process.exit(1);
    }

    if(result.status !== 0) {
        console.error("❌ Docker Compose exited with an error.");
        process.exit(result.status ?? 1);
    }

    console.log("");
    console.log("✅ DevStack services are up");
}