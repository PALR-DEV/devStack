import { spawnSync } from "child_process";
import { readConfig } from "../utils/config.js";

export function runDownConfig(options: { removeVolumes: boolean; removeImages: boolean }) {
    console.log("\n⏹  Stopping DevStack services...\n");
    const config = readConfig();
    if(!config.composeFileName){
        console.error("⚠️ No compose file name specified in config.");
        process.exit(1);
    }
  const args = ['compose', '-f', config.composeFileName, "down"];
  if (options.removeVolumes) {
    args.push('-v');
  }
  if (options.removeImages) {
    args.push('--rmi', 'all');
  }
  const result = spawnSync("docker", args, {
    stdio: "inherit",
  });

  if(result.status !== 0) {
    console.error("\n❌ Failed to stop DevStack services.");
    process.exit(result.status ?? 1);
  }
  console.log("\n🧹 Cleaning Docker builder cache...\n");

  spawnSync(
    "docker",
    ["builder", "prune", "-f"],
    { stdio: "inherit" }
  );

  console.log("\n✅ DevStack stopped and cleaned successfully.\n");
  process.exit(result.status ?? 0);
}