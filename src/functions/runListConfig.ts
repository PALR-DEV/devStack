import { readConfig } from "../utils/config.js";
import { bold, dim, reset } from "../utils/colors.js";

function portSummary(name: string, svc: any): string {
    switch (name) {
        case 'rabbitmq':    return `${svc.port} (AMQP), ${svc.managementPort} (UI)`;
        case 'minio':       return `${svc.port} (API), ${svc.consolePort} (console)`;
        case 'mailpit':     return `${svc.smtpPort} (SMTP), ${svc.uiPort} (UI)`;
        default:            return String(svc.port ?? '—');
    }
}

export function runListConfig() {
    const config = readConfig();
    const names = Object.keys(config.services);

    if (names.length === 0) {
        console.log("No services configured. Run: devstack add <service>");
        return;
    }

    console.log(`\n${bold}${config.projectName}${reset}  ${dim}${names.length} service${names.length !== 1 ? 's' : ''}${reset}\n`);
    console.log(`  ${'SERVICE'.padEnd(16)}${'IMAGE'.padEnd(32)}PORTS`);
    console.log(`  ${'─'.repeat(70)}`);

    for (const name of names) {
        const svc = (config.services as Record<string, any>)[name];
        const ports = portSummary(name, svc);
        console.log(`  ${name.padEnd(16)}${svc.image.padEnd(32)}${ports}`);
    }

    console.log();
}
