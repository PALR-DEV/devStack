import { spawnSync } from "node:child_process";
import { readConfig, requireComposeFile } from "../utils/config.js";

export function runDownConfig(options: { removeVolumes: boolean; removeImages: boolean; all: boolean }) {
    console.log("\n⏹  Stopping DevStack services...\n");

    const config = readConfig();
    const composeFileName = requireComposeFile(config);

    const args = ['compose', '-f', composeFileName, 'down'];

    if (options.removeVolumes) {
        args.push('-v');
    }
    if (options.removeImages) {
        args.push('--rmi', 'all');
    }

    const result = spawnSync("docker", args, { stdio: "inherit" });

    if (result.status !== 0) {
        console.error("\n❌ Failed to stop DevStack services.");
        process.exit(result.status ?? 1);
    }

    console.log("\n✅ DevStack stopped successfully.\n");
    process.exit(result.status ?? 0);
}
