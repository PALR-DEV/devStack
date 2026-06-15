import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { readConfig } from "../utils/config.js";
import { bold, dim, reset, green, red, yellow, cyan } from "../utils/colors.js";

function getRunningContainers(): Set<string> | null {
    const result = spawnSync('docker', ['ps', '--format', '{{.Names}}'], {
        encoding: 'utf-8',
        stdio: ['ignore', 'pipe', 'ignore'],
    });
    if (result.error || result.status !== 0) return null;
    return new Set(result.stdout.trim().split('\n').filter(Boolean));
}

function connectionString(name: string, svc: any): string {
    switch (name) {
        case 'postgres':
            return `postgresql://${svc.username}:${svc.password}@localhost:${svc.port}/${svc.database}`;
        case 'redis':
            return svc.password
                ? `redis://:${svc.password}@localhost:${svc.port}`
                : `redis://localhost:${svc.port}`;
        case 'mongo':
            return `mongodb://${svc.username}:${svc.password}@localhost:${svc.port}/${svc.database}`;
        case 'mysql':
            return `mysql://${svc.username}:${svc.password}@localhost:${svc.port}/${svc.database}`;
        case 'rabbitmq':
            return `amqp://${svc.username}:${svc.password}@localhost:${svc.port}`;
        case 'elasticsearch':
            return svc.password
                ? `http://elastic:${svc.password}@localhost:${svc.port}`
                : `http://localhost:${svc.port}`;
        case 'minio':
            return `http://localhost:${svc.port}`;
        case 'mailpit':
            return `localhost:${svc.smtpPort}  (SMTP)`;
        default:
            return '';
    }
}

function webUI(name: string, svc: any): string | null {
    switch (name) {
        case 'rabbitmq':    return `http://localhost:${svc.managementPort}`;
        case 'minio':       return `http://localhost:${svc.consolePort}`;
        case 'mailpit':     return `http://localhost:${svc.uiPort}`;
        case 'elasticsearch': return `http://localhost:${svc.port}`;
        default:            return null;
    }
}

export function runInfoConfig() {
    const config = readConfig();
    const serviceNames = Object.keys(config.services);
    const composeExists = fs.existsSync(path.join(process.cwd(), config.composeFileName));

    console.log(`${bold}Project:${reset}  ${config.projectName}  ${dim}(v${config.version})${reset}`);
    console.log(`${bold}Compose:${reset}  ${config.composeFileName} ${composeExists ? `${green}✓${reset}` : `${yellow}(not generated)${reset}`}`);
    console.log();

    if (serviceNames.length === 0) {
        console.log(`${yellow}No services configured.${reset}`);
        console.log(`  Run: devstack add <service>`);
        return;
    }

    const running = getRunningContainers();
    const dockerAvailable = running !== null;

    console.log(`${bold}Services${reset}  ${dim}(${serviceNames.length})${reset}`);
    console.log('─'.repeat(56));

    for (const name of serviceNames) {
        const svc = (config.services as Record<string, any>)[name];
        if (!svc) continue;

        let status: string;
        if (!dockerAvailable) {
            status = `${dim}docker not running${reset}`;
        } else if (!composeExists) {
            status = `${yellow}not generated${reset}`;
        } else if (running!.has(svc.containerName)) {
            status = `${green}● running${reset}`;
        } else {
            status = `${red}○ stopped${reset}`;
        }

        console.log(`\n  ${bold}${name}${reset}  ${status}`);
        console.log(`  ${dim}image:${reset}    ${svc.image}`);

        const conn = connectionString(name, svc);
        if (conn) console.log(`  ${dim}connect:${reset}  ${cyan}${conn}${reset}`);

        const ui = webUI(name, svc);
        if (ui) console.log(`  ${dim}web ui:${reset}   ${cyan}${ui}${reset}`);
    }

    console.log();
    if (!composeExists) {
        console.log(`${yellow}⚠️  Run \`devstack gen\` to generate the compose file.${reset}`);
    }
}
