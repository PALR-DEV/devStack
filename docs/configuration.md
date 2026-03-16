# Configuration Reference

devStack stores all project configuration in a single file: **`devstack.config.json`**. This file is created by `devstack init` and updated by commands like `devstack add postgres`.

This document describes every field in the configuration file, its purpose, its type, and its default value.

---

## File Location

The configuration file is always located in the **current working directory** where you run devStack commands:

```
<project-root>/devstack.config.json
```

devStack discovers the file by calling `path.join(process.cwd(), "devstack.config.json")`. If the file is not found, most commands will exit with an error:

```
No devstack.config.json found in the current directory.
```

---

## Full Schema

```json
{
  "projectName": "my-app",
  "version": "1.0.0",
  "composeFileName": "docker-compose.devstack.yml",
  "services": {
    "postgres": {
      "enabled": true,
      "image": "postgres:latest",
      "containerName": "my-app_postgres",
      "port": "5432",
      "username": "postgres",
      "password": "postgres",
      "database": "postgres",
      "volume": true
    }
  }
}
```

---

## Top-Level Fields

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `projectName` | `string` | Yes | Name of current directory | Human-readable name for the project. Used as a prefix for Docker container names (e.g., `my-app_postgres`). Set during `devstack init`. |
| `version` | `string` | Yes | `"1.0.0"` | Schema version of the configuration file. Reserved for future use when the config format evolves. |
| `composeFileName` | `string` | Yes | `"docker-compose.devstack.yml"` | The filename used when generating the Docker Compose YAML file. The `gen`, `up`, and `down` commands all read this field to know which file to write or reference. |
| `services` | `object` | Yes | `{}` | A map of service names to their configuration objects. Each key is a service identifier (e.g., `"postgres"`), and the value is the service-specific configuration described below. |

---

## Services

The `services` object contains one key per configured service. Currently supported services:

- [`postgres`](#postgresql-service) — PostgreSQL relational database

> **Planned services** (see [Roadmap](#roadmap)): Redis, MongoDB, MySQL, RabbitMQ, and more.

---

### PostgreSQL Service

**Key:** `services.postgres`

**TypeScript interface:**

```typescript
interface PostgresServiceConfig {
  enabled: boolean;
  image: string;
  containerName: string;
  port: string;
  username: string;
  password: string;
  database: string;
  volume: boolean;
}
```

**Field reference:**

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `enabled` | `boolean` | `true` | Whether this service should be included when generating the Docker Compose file. Set to `false` to temporarily disable the service without removing its configuration. |
| `image` | `string` | `"postgres:latest"` | The Docker image to use for the PostgreSQL container. You can pin to a specific version (e.g., `"postgres:16"`) by editing this field directly in the JSON. |
| `containerName` | `string` | `"<projectName>_postgres"` | The name assigned to the Docker container. Automatically derived from `projectName` during `devstack add postgres`. |
| `port` | `string` | `"5432"` | The host port mapped to PostgreSQL's internal port `5432`. Change this if you have another service using port 5432 on your host. |
| `username` | `string` | `"postgres"` | The PostgreSQL superuser username. Maps to the `POSTGRES_USER` environment variable in the container. |
| `password` | `string` | `"postgres"` | The PostgreSQL superuser password. Maps to the `POSTGRES_PASSWORD` environment variable in the container. |
| `database` | `string` | `"postgres"` | The default database created on container startup. Maps to the `POSTGRES_DB` environment variable. |
| `volume` | `boolean` | `true` | Whether to attach a named Docker volume (`postgres_data`) for persistent data storage. When `true`, data survives container restarts. When `false`, data is ephemeral. |

---

## How Configuration Maps to Docker Compose

When you run `devstack gen`, the configuration is transformed into a Docker Compose YAML file. Here's how each field maps:

```
devstack.config.json                     docker-compose.devstack.yml
────────────────────                     ───────────────────────────
services.postgres.image           →      services.postgres.image
services.postgres.containerName   →      services.postgres.container_name
services.postgres.port            →      services.postgres.ports[0]  (as "<port>:5432")
services.postgres.username        →      services.postgres.environment.POSTGRES_USER
services.postgres.password        →      services.postgres.environment.POSTGRES_PASSWORD
services.postgres.database        →      services.postgres.environment.POSTGRES_DB
services.postgres.volume          →      services.postgres.volumes + top-level volumes
```

**Example transformation:**

Config input:
```json
{
  "port": "5433",
  "username": "admin",
  "password": "secret",
  "database": "mydb",
  "volume": true
}
```

Generated output:
```yaml
services:
  postgres:
    image: postgres:latest
    container_name: my-app_postgres
    ports:
      - "5433:5432"
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: mydb
    volumes:
      - postgres_data:/var/lib/postgresql/data
volumes:
  postgres_data: {}
```

---

## Editing the Config Manually

You can edit `devstack.config.json` directly with any text editor. This is useful for:

- **Changing the Docker image version** — e.g., pinning `postgres:16` instead of `postgres:latest`
- **Toggling a service off** — setting `"enabled": false`
- **Adjusting the compose filename** — changing `composeFileName` to `"docker-compose.yml"` if you prefer
- **Tweaking credentials** after initial setup

After making manual changes, re-run:

```bash
devstack gen
```

to regenerate the Docker Compose file with your updated configuration.

---

## Roadmap

The following services are planned for future releases:

| Service | Status |
|---------|--------|
| PostgreSQL | ✅ Available |
| Redis | 🔜 Planned |
| MongoDB | 🔜 Planned |
| MySQL | 🔜 Planned |
| RabbitMQ | 🔜 Planned |
| Kafka | 🔜 Planned |
| MinIO | 🔜 Planned |

Each new service will add its own key under the `services` object with a service-specific configuration interface.
