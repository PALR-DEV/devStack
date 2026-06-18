export interface PostgresServiceConfig {
    enabled: boolean;
    image: string;
    containerName: string;
    port: number;
    username: string;
    password: string;
    database: string;
    volume: boolean;
    volumeName?: string;
    restart?: "no" | "always" | "unless-stopped" | "on-failure";
    healthcheck?: boolean;
}

export interface RedisServiceConfig {
    enabled: boolean;
    image: string;
    containerName: string;  
    port: number;
    password?: string;
    volume: boolean;
    volumeName?: string;
    restart?: "no" | "always" | "unless-stopped" | "on-failure";
    healthcheck?: boolean;
}

export interface MongoServiceConfig {
    enabled: boolean;
    image: string;
    containerName: string;
    port: number;
    username: string;
    password: string;
    database: string;
    volume: boolean;
    volumeName?: string;
    restart?: "no" | "always" | "unless-stopped" | "on-failure";
    healthcheck?: boolean;
}

export interface MySQLServiceConfig {
    enabled: boolean;
    image: string;
    containerName: string;
    port: number;
    rootPassword: string;
    username: string;
    password: string;
    database: string;
    volume: boolean;
    volumeName?: string;
    restart?: "no" | "always" | "unless-stopped" | "on-failure";
}

export interface RabbitMQServiceConfig {
    enabled: boolean;
    image: string;
    containerName: string;
    port: number;
    managementPort: number;
    username: string;
    password: string;
    volume: boolean;
    volumeName?: string;
    restart?: "no" | "always" | "unless-stopped" | "on-failure";
}

export interface ElasticsearchServiceConfig {
    enabled: boolean;
    image: string;
    containerName: string;
    port: number;
    password?: string;
    volume: boolean;
    volumeName?: string;
    restart?: "no" | "always" | "unless-stopped" | "on-failure";
}

export interface MinIOServiceConfig {
    enabled: boolean;
    image: string;
    containerName: string;
    port: number;
    consolePort: number;
    rootUser: string;
    rootPassword: string;
    volume: boolean;
    volumeName?: string;
    restart?: "no" | "always" | "unless-stopped" | "on-failure";
}

export interface MailpitServiceConfig {
    enabled: boolean;
    image: string;
    containerName: string;
    smtpPort: number;
    uiPort: number;
    volume: boolean;
    volumeName?: string;
    restart?: "no" | "always" | "unless-stopped" | "on-failure";
}

export interface DevStackServices {
    postgres?: PostgresServiceConfig;
    redis?: RedisServiceConfig;
    mongo?: MongoServiceConfig;
    mysql?: MySQLServiceConfig;
    rabbitmq?: RabbitMQServiceConfig;
    elasticsearch?: ElasticsearchServiceConfig;
    minio?: MinIOServiceConfig;
    mailpit?: MailpitServiceConfig;
}

export interface DevStackConfig {
    projectName: string;
    version: string;
    composeFileName: string;
    services: DevStackServices;
}

export type ComposeConfig = {
    services: Record<string, any>;
    volumes?: Record<string, any>;
};
