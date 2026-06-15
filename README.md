<p align="center">
  <img src="https://img.shields.io/badge/devstack-cli-blueviolet?style=for-the-badge&logo=docker&logoColor=white" alt="devstack badge" />
  <img src="https://img.shields.io/badge/license-MIT-blue?style=for-the-badge" alt="license" />
  <img src="https://img.shields.io/badge/node-%3E%3D18-orange?style=for-the-badge&logo=node.js&logoColor=white" alt="node version" />
  <img src="https://img.shields.io/npm/dt/@palr-dev/devstack-cli?style=for-the-badge&logo=npm" alt="total downloads" />
   <img src="https://img.shields.io/npm/v/@palr-dev/devstack-cli?style=for-the-badge&logo=npm" alt="npm version" />
   <img src="https://img.shields.io/github/stars/PALR-DEV/devstack?style=for-the-badge" alt="git hub stars" />
   <img src="https://img.shields.io/npm/last-update/@palr-dev/devstack-cli?style=for-the-badge" alt="last updated" />
   <img src="https://img.shields.io/badge/status-work%20in%20progress-yellow?style=for-the-badge" alt="work in progress" />
   
</p>

<p align="center">
<pre align="center">
      $$\                      $$$$$$\    $$\                         $$\       
      $$ |                    $$  __$$\   $$ |                        $$ |      
 $$$$$$$ | $$$$$$\ $$\    $$\ $$ /  \__|$$$$$$\    $$$$$$\   $$$$$$$\ $$ |  $$\ 
$$  __$$ |$$  __$$\\$$\  $$  |\$$$$$$\  \_$$  _|   \____$$\ $$  _____|$$ | $$  |
$$ /  $$ |$$$$$$$$ |\$$\$$  /  \____$$\   $$ |     $$$$$$$ |$$ /      $$$$$$  / 
$$ |  $$ |$$   ____| \$$$  /  $$\   $$ |  $$ |$$\ $$  __$$ |$$ |      $$  _$$<  
\$$$$$$$ |\$$$$$$$\   \$  /   \$$$$$$  |  \$$$$  |\$$$$$$$ |\$$$$$$$\ $$ | \$$\ 
 \_______| \_______|   \_/     \______/    \____/  \_______| \_______|\__|  \__|
</pre>
</p>

<h3 align="center">⚡ Zero-friction development infrastructure at your fingertips.</h3>

<p align="center">
  Stop wrestling with Docker configurations — spin up databases and services for local development in seconds.
</p>

> [!WARNING]
> **🚧 Work in Progress** — This project is actively being developed. Configuration options may change between releases, and new features will be added.

---

## Why devstack?

Setting up local dev infrastructure shouldn't be a bottleneck. **devstack** gives you an opinionated, batteries-included workflow that takes you from zero to a fully running development stack in seconds.

- **Instant Infrastructure** — Spin up production-grade services with a single command
- **Zero Configuration Overhead** — Sensible defaults that just work, fully customizable when you need it
- **Docker-Native** — Leverages Docker Compose for reliable, reproducible environments
- **Declarative Config** — Your entire stack defined in one `devstack.config.json`, shareable across your team
- **Pluggable Architecture** — Add services incrementally as your project evolves

## Installation

```bash
npm install -g @palr-dev/devstack-cli
```

> **Prerequisites:** [Node.js](https://nodejs.org/) >= 18 and [Docker](https://www.docker.com/) must be installed and running.

## Quick Start

```bash
devstack init my-project
devstack add postgres
devstack add redis
devstack gen
devstack up
```

Your services are live and ready for connections.

---

## Commands

### Setup

| Command | Description |
|---|---|
| `devstack init [name]` | Initialize a new devstack project |
| `devstack add <service>` | Add a service to your stack |
| `devstack gen` | Generate `docker-compose.devstack.yml` from config |

### Services

| Command | Description |
|---|---|
| `devstack up` | Start all configured services |
| `devstack up --build` | Rebuild images before starting |
| `devstack down` | Stop all running services |
| `devstack down -v` | Stop and remove volumes |
| `devstack down -i` | Stop and remove images |
| `devstack down -a` | Stop, remove volumes, images, and prune builder cache |
| `devstack restart [service]` | Restart all services, or a specific one |

### Inspect

| Command | Description |
|---|---|
| `devstack info` | Project dashboard — status, ports, and connection strings for every service |
| `devstack list` | Quick table of configured services and their ports |
| `devstack env` | Print `.env`-ready connection strings for all services |
| `devstack env -o .env` | Write connection strings directly to a file |
| `devstack open [service]` | Open service web UIs in the browser |
| `devstack ps [service]` | Show running container status |
| `devstack logs [service]` | Follow service logs |

### Config

| Command | Description |
|---|---|
| `devstack remove <service>` | Remove a service from your config |
| `devstack nuke --yes` | Stop everything, delete the compose file, and reset config |

---

## Adding Services

### PostgreSQL

```bash
devstack add postgres
devstack add postgres --port 5433 --username admin --password secret --database mydb
```

| Flag | Default |
|---|---|
| `-p, --port <port>` | `5432` |
| `-u, --username <username>` | `postgres` |
| `-P, --password <password>` | `postgres` |
| `-d, --database <database>` | `postgres` |

### Redis

```bash
devstack add redis
devstack add redis --port 6380 --password mysecret
```

| Flag | Default |
|---|---|
| `-p, --port <port>` | `6379` |
| `--password <password>` | *(none)* |

### MongoDB

```bash
devstack add mongo
devstack add mongo --port 27018 --username admin --password secret --database mydb
```

| Flag | Default |
|---|---|
| `-p, --port <port>` | `27017` |
| `-u, --username <username>` | `mongo` |
| `-P, --password <password>` | `mongo` |
| `-d, --database <database>` | `mongo` |

### MySQL

```bash
devstack add mysql
devstack add mysql --port 3307 --username admin --password secret --database mydb
```

| Flag | Default |
|---|---|
| `-p, --port <port>` | `3306` |
| `-R, --root-password <password>` | `rootpassword` |
| `-u, --username <username>` | `mysql` |
| `-P, --password <password>` | `mysql` |
| `-d, --database <database>` | `mysql` |

### RabbitMQ

```bash
devstack add rabbitmq
```

Management UI available at `http://localhost:15672`.

| Flag | Default |
|---|---|
| `-p, --port <port>` | `5672` |
| `-m, --management-port <port>` | `15672` |
| `-u, --username <username>` | `guest` |
| `-P, --password <password>` | `guest` |

### Elasticsearch

```bash
devstack add elasticsearch             # security disabled (dev mode)
devstack add elasticsearch --password secret  # security enabled
```

| Flag | Default |
|---|---|
| `-p, --port <port>` | `9200` |
| `-P, --password <password>` | *(none — disables security)* |

> Elasticsearch is configured as a single-node instance with `ES_JAVA_OPTS: -Xms512m -Xmx512m` to limit heap usage in dev.

### MinIO

```bash
devstack add minio
```

S3-compatible object storage. API at `:9000`, web console at `http://localhost:9001`.

| Flag | Default |
|---|---|
| `-p, --port <port>` | `9000` |
| `-c, --console-port <port>` | `9001` |
| `-u, --root-user <user>` | `minioadmin` |
| `-P, --root-password <password>` | `minioadmin` |

### Mailpit

```bash
devstack add mailpit
```

Local SMTP catcher — point your app's SMTP config at `localhost:1025` and inspect all outgoing emails at `http://localhost:8025`. No emails ever leave your machine.

| Flag | Default |
|---|---|
| `-p, --smtp-port <port>` | `1025` |
| `-u, --ui-port <port>` | `8025` |

```
# App SMTP config (dev only)
SMTP_HOST=localhost
SMTP_PORT=1025
```

---

## Inspect Commands

### `devstack info`

Shows every configured service with its running status, image, connection string, and web UI link.

```
Project:  my-project  (v1.0.0)
Compose:  docker-compose.devstack.yml ✓

Services  (3)
────────────────────────────────────────────────────────

  postgres  ● running
  image:    postgres:17
  connect:  postgresql://postgres:postgres@localhost:5432/postgres

  redis  ● running
  image:   redis:7
  connect: redis://localhost:6379

  mailpit  ● running
  image:   axllent/mailpit:latest
  connect: localhost:1025  (SMTP)
  web ui:  http://localhost:8025
```

### `devstack env`

Prints ready-to-paste connection strings for every configured service.

```bash
devstack env           # print to stdout
devstack env -o .env   # write to .env file
```

Output:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres
REDIS_URL=redis://localhost:6379
SMTP_HOST=localhost
SMTP_PORT=1025
MAILPIT_URL=http://localhost:8025
```

### `devstack open`

Opens web UIs in your browser. Works for `mailpit`, `rabbitmq`, `minio`, and `elasticsearch`.

```bash
devstack open            # open all available UIs
devstack open mailpit    # open a specific one
```

---

## Configuration

Everything lives in `devstack.config.json`. Commit it to version control and every team member gets an identical stack.

```json
{
  "projectName": "my-project",
  "version": "1.0.0",
  "composeFileName": "docker-compose.devstack.yml",
  "services": {
    "postgres": {
      "enabled": true,
      "image": "postgres:17",
      "containerName": "my-project_postgres",
      "port": "5432",
      "username": "postgres",
      "password": "postgres",
      "database": "postgres",
      "volume": true
    },
    "redis": {
      "enabled": true,
      "image": "redis:7",
      "containerName": "my-project_redis",
      "port": 6379,
      "volume": true
    }
  }
}
```

---

## Roadmap

- Kafka — Event streaming
- NATS — Lightweight pub/sub
- LocalStack — AWS services locally (S3, SQS, DynamoDB, etc.)
- Keycloak — Local OAuth2 / OIDC
- Service health checks
- Secrets management via `.env`

## Contributing

Contributions are welcome! See the [GitHub repository](https://github.com/palr-dev/devstack) for development setup and contribution guidelines.

## License

MIT

---

<p align="center">
  Built with ❤️ by developers, for developers.
  <br />
  <b>Stop configuring. Start building.</b>
</p>
