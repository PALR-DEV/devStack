import { readConfig, writeConfig, printAddNextSteps } from "../utils/config.js";
import type { MailpitServiceConfig } from "../models/devstack-config.js";

export function runAddMailpitConfig(options: MailpitServiceConfig) {
    const config = readConfig();

    if (!config.services) {
        config.services = {};
    }

    if (config.services.mailpit) {
        console.error("⚠️ Mailpit is already configured.");
        process.exit(1);
    }

    const smtpPort = options.smtpPort ? Number(options.smtpPort) : 1025;
    const uiPort = options.uiPort ? Number(options.uiPort) : 8025;

    if (Number.isNaN(smtpPort) || Number.isNaN(uiPort)) {
        console.error("⚠️ Invalid port number.");
        process.exit(1);
    }

    config.services.mailpit = {
        enabled: true,
        image: "axllent/mailpit:latest",
        containerName: `${config.projectName}_mailpit`,
        smtpPort,
        uiPort,
        volume: false,
    } as MailpitServiceConfig;

    writeConfig(config);
    console.log("✅ Mailpit added to DevStack\n");

    console.log("----Configuration----");
    console.log(`  SMTP Port: ${config.services.mailpit.smtpPort}  ← point your app here`);
    console.log(`  Web UI:    http://localhost:${config.services.mailpit.uiPort}`);
    printAddNextSteps(config);
}
