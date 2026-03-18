export interface PostgresServiceConfig{
    enabled:boolean;
    image:string;
    containerName:string;
    port:string;
    username:string;
    password:string;
    database:string;
    volume: boolean;
    volumeName?: string;
    restart?: "no" | "always" | "unless-stopped" | "on-failure";
    healthcheck?: boolean;
}

export interface DevStackServices {
    postgres?: PostgresServiceConfig;
    redis?: RedisServiceConfig;
}


export interface DevStackConfig {
  projectName: string;
  version: string;
  composeFileName: string;
  services: DevStackServices;
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

export type ComposeConfig = {
  services: Record<string, any>;
  volumes?: Record<string, any>;
};