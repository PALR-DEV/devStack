# Getting Started

This guide walks you through installing devStack, setting up your first project, and launching a local PostgreSQL database — all in under two minutes.

---

## Prerequisites

Before you begin, make sure you have the following installed on your machine:

| Requirement | Minimum Version | Check Command |
|-------------|----------------|---------------|
| **Node.js** | 18.0.0 | `node --version` |
| **npm** | 9.0.0 | `npm --version` |
| **Docker** | 20.10.0 | `docker --version` |
| **Docker Compose** | 2.0.0 (V2 plugin) | `docker compose version` |

> **Note:** devStack uses the `docker compose` V2 CLI (the plugin form), not the legacy `docker-compose` standalone binary. Most modern Docker Desktop installations include V2 by default.

---

## Installation

Install devStack globally via npm:

```bash
npm install -g @palr-dev/devstack-cli
```

Verify the installation:

```bash
devstack --version
```

You should see:

```
1.0.0
```

---

## Quick Start

### Step 1 — Initialize a New Project

Navigate to your project directory (or create a new one) and run:

```bash
mkdir my-app && cd my-app
devstack init my-app
```

**What happens:**

- A `devstack.config.json` file is created in the current directory.
- The config is pre-populated with your project name, a default compose filename, and an empty `services` object.

**Output:**

```
✅ DevStack initialized
✅ Created /path/to/my-app/devstack.config.json

Next steps:
  devstack add postgres
  devstack generate
  devstack up
```

The generated `devstack.config.json` looks like this:

```json
{
  "projectName": "my-app",
  "version": "1.0.0",
  "composeFileName": "docker-compose.devstack.yml",
  "services": {}
}
```

---

### Step 2 — Add a Service

Add PostgreSQL with default settings:

```bash
devstack add postgres
```

Or customize it:

```bash
devstack add postgres --port 5433 --user admin --password secret --database mydb
```

**What happens:**

- The `devstack.config.json` file is updated with a `postgres` entry inside `services`.
- The service includes an image, container name, port mapping, credentials, database name, and volume configuration.

**Output:**

```
✅ PostgreSQL added to DevStack

----Configuration----
  Port:      5432
  User:      postgres
  Database:  postgres

Next steps:
  devstack generate
  devstack up
```

---

### Step 3 — Generate the Docker Compose File

```bash
devstack gen
```

**What happens:**

- devStack reads `devstack.config.json` and converts the configured services into a valid Docker Compose YAML file.
- The file is written as `docker-compose.devstack.yml` (or whichever filename is in your config).

**Output:**

```
✅ Docker Compose configuration generated successfully
📄 File: /path/to/my-app/docker-compose.devstack.yml

Next steps:
  devstack up
```

The generated `docker-compose.devstack.yml`:

```yaml
services:
  postgres:
    image: postgres:latest
    container_name: my-app_postgres
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
volumes:
  postgres_data: {}
```

---

### Step 4 — Start Your Services

```bash
devstack up
```

**What happens:**

- devStack runs `docker compose -f docker-compose.devstack.yml up -d` behind the scenes.
- All services start in detached mode so your terminal stays free.

**Output:**

```
🚀 Starting DevStack services...
📄 Using: docker-compose.devstack.yml

 ✔ Network my-app_default        Created
 ✔ Volume "postgres_data"        Created
 ✔ Container my-app_postgres     Started

✅ DevStack services are up
```

Verify with Docker:

```bash
docker ps
```

You should see your PostgreSQL container running and accessible on the port you configured.

---

### Step 5 — Connect to Your Database

With the default settings you can connect to PostgreSQL at:

| Property | Value |
|----------|-------|
| Host | `localhost` |
| Port | `5432` |
| Username | `postgres` |
| Password | `postgres` |
| Database | `postgres` |

**Connection string:**

```
postgresql://postgres:postgres@localhost:5432/postgres
```

Use any PostgreSQL client (pgAdmin, DBeaver, `psql`, or your application's ORM) to connect.

---

### Step 6 — Stop Services

When you're done:

```bash
devstack down
```

To also remove volumes and images:

```bash
devstack down --all
```

---

## What's Next?

- Read the [Command Reference](README.md#command-reference) for full details on every command.
- See the [Configuration Reference](configuration.md) to understand every field in `devstack.config.json`.
- Check out the [Architecture Overview](architecture.md) to learn how the project is structured.
