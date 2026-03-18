import type { ComposeConfig, DevStackConfig } from "../models/devstack-config.js";



export function addPostgresService(config: DevStackConfig, composeConfig: ComposeConfig): void {
  const postgres = config.services?.postgres;
  if (!postgres?.enabled) return;

  composeConfig.services.postgres = {
    image: postgres.image,
    ports: postgres.port ? [`${postgres.port}:5432`] : undefined,
    environment: {
      POSTGRES_USER: postgres.username,
      POSTGRES_PASSWORD: postgres.password,
      POSTGRES_DB: postgres.database,
    },
    ...(postgres.volume ? { volumes: ['postgres_data:/var/lib/postgresql/data'] } : {}),
  };

  // Add volume definition if volume is enabled
  if(postgres.volume) {
        composeConfig.volumes = {
            ...(composeConfig.volumes || {}),
            postgres_data: {},
        };
    }


}