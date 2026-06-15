---
id: commands
title: Commands
sidebar_position: 4
---

# Commands

## Project setup

### `devstack init [project-name]`

Creates `devstack.config.json` in the current directory.

```bash
devstack init my-project
```

---

### `devstack add <service>`

Adds a service to your config. Run `devstack gen` after to apply.

```bash
devstack add postgres
devstack add redis
devstack add mongo
devstack add mysql
devstack add rabbitmq
devstack add elasticsearch
devstack add minio
devstack add mailpit
```

Each service accepts options — see the [Services](./services/postgres) section for flags.

---

### `devstack gen`

Generates `docker-compose.devstack.yml` from your config. Safe to re-run any time.

```bash
devstack gen
```

---

## Running services

### `devstack up`

Starts all services defined in your config.

```bash
devstack up
devstack up --build   # rebuild images before starting
```

---

### `devstack down`

Stops all services.

```bash
devstack down
devstack down --remove-volumes   # also delete data volumes
devstack down --remove-images    # also remove pulled images
devstack down --all              # volumes + images
```

---

### `devstack restart [service]`

Restarts all services, or a specific one.

```bash
devstack restart
devstack restart redis
```

---

## Observability

### `devstack info`

Shows a dashboard with the status and connection string for every configured service.

```bash
devstack info
```

---

### `devstack list`

Prints a table of all configured services with their ports.

```bash
devstack list
```

---

### `devstack ps [service]`

Shows the Docker Compose status for running containers.

```bash
devstack ps
devstack ps postgres
```

---

### `devstack logs [service]`

Streams logs. Omit service name to tail all services.

```bash
devstack logs
devstack logs postgres
```

---

### `devstack env [--output <file>]`

Prints `.env`-ready connection strings for every configured service. Optionally writes to a file.

```bash
devstack env             # print to stdout
devstack env -o .env     # write to .env
```

---

## Interaction

### `devstack connect <service>`

Opens an interactive shell into a running service.

```bash
devstack connect postgres   # psql
devstack connect mysql      # mysql CLI
devstack connect mongo      # mongosh
devstack connect redis      # redis-cli
devstack connect rabbitmq   # bash
```

---

### `devstack open [service]`

Opens a service's web UI in your default browser.

```bash
devstack open              # lists available UIs
devstack open rabbitmq     # RabbitMQ Management (port 15672)
devstack open minio        # MinIO Console (port 9001)
devstack open mailpit      # Mailpit inbox (port 8025)
devstack open elasticsearch
```

---

## Cleanup

### `devstack remove <service>`

Removes a service from your config. Run `devstack gen` after to apply.

```bash
devstack remove redis
```

---

### `devstack nuke --yes`

Stops all services, removes the compose file, and clears your config. Use with care.

```bash
devstack nuke --yes
```
