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
> **🚧 Work in Progress** — This project is actively being developed. Features and configuration options may evolve between releases.

---

## The Problem

Every new project starts the same way. You need a database. Maybe a cache. Maybe a message queue. So you spend the first hour of your day writing Docker Compose files, looking up environment variable names, figuring out which port conflicts with something else already running, and copy-pasting connection strings into your `.env`.

That's not engineering. That's setup tax — and you pay it every single time.

## What devstack is

devstack is a CLI framework for managing local development infrastructure. It sits on top of Docker Compose and gives you a single, consistent interface for spinning up, inspecting, and tearing down the services your application depends on.

You describe your stack once. devstack handles the rest — generating the Compose configuration, starting the containers, and giving you the connection strings your app needs to connect to them.

```bash
devstack init my-project
devstack add postgres
devstack add redis
devstack add mailpit
devstack gen
devstack up
```

That's it. Postgres, Redis, and a local email catcher are running. Your stack is defined in a single `devstack.config.json` you can commit to version control so every person on your team starts from the same place.

## The Philosophy

**Convention over configuration.** Every service comes with sensible defaults. You don't need to know the Postgres environment variable names, the Redis volume mount path, or the Elasticsearch Java heap flags. devstack knows them. You override only what you need to.

**One config, zero drift.** Your infrastructure lives in `devstack.config.json` alongside your code. When a teammate clones the repo and runs `devstack up`, they get the exact same environment you have. No "works on my machine."

**Get out of your way.** devstack doesn't try to be a platform or a deployment tool. It's a development utility. Its job is to get your local services running so you can focus on the code that actually matters.

## What it includes

devstack ships with first-class support for the services developers reach for most:

- **PostgreSQL** — Relational database
- **MySQL** — Relational database alternative
- **MongoDB** — Document database
- **Redis** — In-memory cache and data store
- **RabbitMQ** — Message broker with management UI
- **Elasticsearch** — Search and analytics engine
- **MinIO** — S3-compatible local object storage
- **Mailpit** — Local SMTP catcher with web UI — test email flows without sending a single real email

## Beyond just running services

Spinning up containers is the baseline. devstack goes further:

- **`devstack info`** shows you a live dashboard of every service — what's running, what's stopped, and the exact connection string to paste into your app.
- **`devstack env`** generates a ready-to-use `.env` file with connection strings for every configured service.
- **`devstack open`** opens the web UI for services that have one — RabbitMQ's management console, MinIO's dashboard, Mailpit's inbox — directly in your browser.
- **`devstack nuke`** tears everything down and resets your config when you need to start fresh.

## Installation

```bash
npm install -g @palr-dev/devstack-cli
```

> **Prerequisites:** [Node.js](https://nodejs.org/) >= 18 and [Docker](https://www.docker.com/) must be installed and running.

## Contributing

Contributions are welcome. See the [GitHub repository](https://github.com/palr-dev/devstack) for development setup and contribution guidelines.

## License

MIT

---

<p align="center">
  Built with ❤️ by developers, for developers.
  <br />
  <b>Stop configuring. Start building.</b>
</p>
