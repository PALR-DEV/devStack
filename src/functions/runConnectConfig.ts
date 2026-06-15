import { spawn } from "node:child_process";
import { readConfig } from "../utils/config.js";
import type { DevStackConfig } from "../models/devstack-config.js";

type Connection = { container: string; args: string[] };
type Connector = (config: DevStackConfig) => Connection | null;

const connectors: Record<string, Connector> = {
    postgres: (config) => {
        const s = config.services.postgres;
        if (!s) return null;
        return {
            container: s.containerName,
            args: ['psql', '-U', s.username, '-d', s.database],
        };
    },
    mysql: (config) => {
        const s = config.services.mysql;
        if (!s) return null;
        return {
            container: s.containerName,
            args: ['mysql', '-u', s.username, `-p${s.password}`, s.database],
        };
    },
    mongo: (config) => {
        const s = config.services.mongo;
        if (!s) return null;
        return {
            container: s.containerName,
            args: ['mongosh', '-u', s.username, '-p', s.password, s.database],
        };
    },
    redis: (config) => {
        const s = config.services.redis;
        if (!s) return null;
        const args = ['redis-cli'];
        if (s.password) args.push('-a', s.password);
        return {
            container: s.containerName,
            args,
        };
    },
    rabbitmq: (config) => {
        const s = config.services.rabbitmq;
        if (!s) return null;
        return {
            container: s.containerName,
            args: ['bash'],
        };
    },
};

const UI_ONLY: Record<string, string> = {
    elasticsearch: 'devstack open elasticsearch',
    minio:         'devstack open minio',
    mailpit:       'devstack open mailpit',
};

export function runConnectConfig(service: string) {
    const config = readConfig();
    const services = config.services as Record<string, any>;

    if (!services[service]) {
        console.error(`⚠️ Service "${service}" is not configured.`);
        console.error(`   Configured: ${Object.keys(config.services).join(', ') || 'none'}`);
        process.exit(1);
    }

    if (UI_ONLY[service]) {
        console.error(`⚠️ "${service}" has no CLI — use \`${UI_ONLY[service]}\` instead.`);
        process.exit(1);
    }

    const connector = connectors[service];
    if (!connector) {
        console.error(`⚠️ \`devstack connect\` does not support "${service}" yet.`);
        process.exit(1);
    }

    const conn = connector(config);
    if (!conn) {
        console.error(`⚠️ Could not build connection for "${service}".`);
        process.exit(1);
    }

    console.log(`🔌 Connecting to ${service}...\n`);

    const child = spawn('docker', ['exec', '-it', conn.container, ...conn.args], {
        stdio: 'inherit',
    });

    child.on('error', (err) => {
        if ((err as any).code === 'ENOENT') {
            console.error(`❌ Docker is not running or not installed.`);
        } else {
            console.error(`❌ Failed to connect to ${service}: ${err.message}`);
        }
        process.exit(1);
    });

    child.on('close', (code) => {
        if (code !== 0 && code !== null) process.exit(code);
    });
}
