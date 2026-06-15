import { spawnSync } from "node:child_process";
import { readConfig } from "../utils/config.js";

const WEB_UIS: Record<string, (svc: any) => string> = {
    rabbitmq:      (s) => `http://localhost:${s.managementPort}`,
    minio:         (s) => `http://localhost:${s.consolePort}`,
    mailpit:       (s) => `http://localhost:${s.uiPort}`,
    elasticsearch: (s) => `http://localhost:${s.port}`,
};

function openURL(url: string) {
    const cmd = process.platform === 'win32' ? 'start' : process.platform === 'darwin' ? 'open' : 'xdg-open';
    spawnSync(cmd, [url], { stdio: 'ignore', shell: process.platform === 'win32' });
    console.log(`  🌐 Opened ${url}`);
}

export function runOpenConfig(service?: string) {
    const config = readConfig();
    const services = config.services as Record<string, any>;

    if (service) {
        if (!services[service]) {
            console.error(`⚠️ Service "${service}" is not configured.`);
            process.exit(1);
        }
        const getUrl = WEB_UIS[service];
        if (!getUrl) {
            console.error(`⚠️ "${service}" has no web UI.`);
            console.error(`   Services with web UIs: ${Object.keys(WEB_UIS).join(', ')}`);
            process.exit(1);
        }
        openURL(getUrl(services[service]));
        return;
    }

    let opened = 0;
    for (const [name, getUrl] of Object.entries(WEB_UIS)) {
        const svc = services[name];
        if (svc?.enabled) {
            openURL(getUrl(svc));
            opened++;
        }
    }

    if (opened === 0) {
        console.log("⚠️ No services with a web UI are configured.");
        console.log(`   Services with web UIs: ${Object.keys(WEB_UIS).join(', ')}`);
    }
}
