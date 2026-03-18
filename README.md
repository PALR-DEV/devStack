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
> **🚧 Work in Progress** — This project is actively being developed. APIs and configuration options may change between releases, and new features are continuously being added. Use in production at your own risk.

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

Get a PostgreSQL database running in **under 30 seconds**:

```bash
# Initialize your devstack project
devstack init my-project

# Add a PostgreSQL service
devstack add postgres

# Generate the Docker Compose configuration
devstack gen

# Launch your stack
devstack up
```

Your PostgreSQL database is now live at `localhost:5432` and ready for connections.

## Commands

| Command | Description |
|---|---|
| `devstack init [name]` | Initialize a new devstack project |
| `devstack add postgres` | Add a PostgreSQL service to your stack |
| `devstack gen` | Generate a Docker Compose file from your config |
| `devstack up` | Start all configured services |
| `devstack down` | Stop all running services |

### Adding PostgreSQL

```bash
devstack add postgres --port 5433 --user admin --password secret --database mydb
```

| Flag | Description | Default |
|---|---|---|
| `-p, --port <port>` | Port to expose PostgreSQL on | `5432` |
| `-u, --user <user>` | PostgreSQL username | `postgres` |
| `-P, --password <password>` | PostgreSQL password | `postgres` |
| `-d, --database <database>` | Database name | `postgres` |

### Starting & Stopping

```bash
devstack up             # Start services
devstack up --build     # Rebuild images before starting

devstack down           # Stop services
devstack down -v        # Stop and remove volumes
devstack down -i        # Stop and remove images
devstack down -a        # Stop and remove everything
```

## Configuration

Everything lives in a single `devstack.config.json`:

```json
{
  "projectName": "my-project",
  "version": "1.0.0",
  "composeFileName": "docker-compose.devstack.yml",
  "services": {
    "postgres": {
      "enabled": true,
      "image": "postgres:latest",
      "containerName": "my-project_postgres",
      "port": "5432",
      "username": "postgres",
      "password": "postgres",
      "database": "postgres",
      "volume": true
    }
  }
}
```

Commit this file to version control and every team member gets an identical stack.

## Roadmap

- Redis — In-memory data store
- MongoDB — Document database
- MySQL / MariaDB — Relational database alternatives
- RabbitMQ — Message broker
- Real-time log streaming
- Service health checks
- Status dashboard
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
