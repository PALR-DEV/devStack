<p align="center">
  <img src="https://img.shields.io/badge/devstack-cli-blueviolet?style=for-the-badge&logo=docker&logoColor=white" alt="devstack badge" />
  <img src="https://img.shields.io/badge/version-1.0.3-brightgreen?style=for-the-badge" alt="version" />
  <img src="https://img.shields.io/badge/license-MIT-blue?style=for-the-badge" alt="license" />
  <img src="https://img.shields.io/badge/node-%3E%3D18-orange?style=for-the-badge&logo=node.js&logoColor=white" alt="node version" />
  <img src="https://img.shields.io/badge/typescript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="typescript" />
  <img src="https://img.shields.io/npm/dw/devstack-cli?style=for-the-badge&logo=npm" alt="npm downloads" />
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
  <b>devstack</b> is an open-source CLI tool that eliminates the complexity of spinning up databases and services for local development. Stop wrestling with Docker configurations — start building.
</p>

---

## 🌟 Why devstack?

Setting up local development infrastructure shouldn't be a bottleneck. Every minute spent configuring databases, wiring Docker Compose files, and debugging port conflicts is a minute stolen from shipping features.

**devstack** was built to solve this. It provides an opinionated, batteries-included workflow that takes you from zero to a fully running development stack in seconds — not hours.

- 🏗️ **Instant Infrastructure** — Spin up production-grade services with a single command
- 🎯 **Zero Configuration Overhead** — Sensible defaults that just work, with full customizability when you need it
- 🐳 **Docker-Native** — Leverages Docker Compose under the hood for reliable, reproducible environments
- 📦 **Declarative Config** — Your entire stack is defined in a single `devstack.config.json` file, version-controllable and shareable across your team
- 🔌 **Pluggable Architecture** — Add services incrementally as your project evolves

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/your-username/devstack.git
cd devstack

# Install dependencies
npm install

# Build the CLI
npm run build

# Link globally for system-wide access
npm link
```

> **Prerequisites:** [Node.js](https://nodejs.org/) >= 18 and [Docker](https://www.docker.com/) must be installed and running on your machine.

## 🚀 Quick Start

Get a PostgreSQL database running in **under 30 seconds**:

```bash
# 1. Initialize your devstack project
devstack init my-project

# 2. Add a PostgreSQL service
devstack add postgres

# 3. Generate the Docker Compose configuration
devstack gen

# 4. Launch your stack
devstack up
```

That's it. Your PostgreSQL database is live at `localhost:5432` and ready for connections. 🎉

## 📖 Commands

| Command | Description |
|---|---|
| `devstack init [name]` | Initialize a new devstack project in the current directory |
| `devstack add postgres` | Add a PostgreSQL service to your stack |
| `devstack gen` | Generate a Docker Compose file from your config |
| `devstack up` | Start all configured services |
| `devstack down` | Stop all running services |
| `devstack logs` | View service logs *(coming soon)* |

### `devstack init [project-name]`

Scaffolds a new `devstack.config.json` in your current directory. If no project name is provided, it defaults to the directory name.

```bash
devstack init my-awesome-app
```

### `devstack add postgres`

Adds a PostgreSQL service to your stack with fully configurable options:

```bash
devstack add postgres --port 5433 --user admin --password secret --database mydb
```

| Flag | Description | Default |
|---|---|---|
| `-p, --port <port>` | Port to expose PostgreSQL on | `5432` |
| `-u, --user <user>` | PostgreSQL username | `postgres` |
| `-P, --password <password>` | PostgreSQL password | `postgres` |
| `-d, --database <database>` | Database name | `postgres` |

### `devstack gen`

Reads your `devstack.config.json` and generates a production-ready `docker-compose.devstack.yml` file. Re-run this command any time you modify your config.

### `devstack up`

Launches all configured services in detached mode via Docker Compose.

```bash
devstack up           # Start services
devstack up --build   # Rebuild images before starting
```

### `devstack down`

Gracefully stops all running services with optional cleanup:

```bash
devstack down                # Stop services
devstack down -v             # Stop and remove volumes
devstack down -i             # Stop and remove images
devstack down -a             # Stop and remove everything (volumes + images)
```

| Flag | Description |
|---|---|
| `-v, --remove-volumes` | Remove associated volumes |
| `-i, --remove-images` | Remove images used by the stack |
| `-a, --all` | Remove all resources (volumes + images) |

## ⚙️ Configuration

All project configuration lives in a single `devstack.config.json` file:

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

This file is the single source of truth for your development infrastructure. Commit it to version control and every team member gets an identical stack.

## 🗺️ Roadmap

devstack is actively evolving. Here's what's on the horizon:

- [ ] 🟥 **Redis** — In-memory data store support
- [ ] 🍃 **MongoDB** — Document database support
- [ ] 🐬 **MySQL / MariaDB** — Relational database alternatives
- [ ] 📡 **RabbitMQ** — Message broker integration
- [ ] 📝 **Logs** — Real-time service log streaming
- [ ] 🩺 **Health Checks** — Service readiness monitoring
- [ ] 📊 **Status Dashboard** — Visual overview of running services
- [ ] 🔐 **Secrets Management** — Secure credential handling via `.env` integration

## 🤝 Contributing

Contributions are what make the open-source community such an extraordinary place to learn, inspire, and create. Any contribution you make is **genuinely appreciated**.

1. **Fork** the repository
2. **Create** your feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

Whether it's fixing a typo, reporting a bug, suggesting a feature, or writing code — every contribution matters.

## 🛠️ Development

### Setup for development

Clone the repository:

git clone https://github.com/palr-dev/devstack.git
cd devstack

Install dependencies:

npm install

Build the project:

npm run build

Link the CLI globally:

npm link

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ by developers, for developers.
  <br />
  <b>Stop configuring. Start building.</b>
</p>
