# `devstack logs`

View logs from running devStack services.

> **🚧 Status: Not Yet Implemented**
>
> This command is currently a placeholder. Running it will display:
>
> ```
> 🚧 Logs functionality is not implemented yet. Stay tuned! 🚧
> ```

---

## Usage

```bash
devstack logs [options]
```

## Options

| Flag | Alias | Type | Default | Description |
|------|-------|------|---------|-------------|
| `--service <service>` | `-s` | `string` | *(none)* | Specify a particular service to view logs for (e.g., `postgres`). |

---

## Planned Behavior

When implemented, this command will:

1. Read `devstack.config.json` to determine the compose filename.
2. Run `docker compose -f <composeFileName> logs` to display logs from all services.
3. With `--service`, filter logs to a specific service (e.g., `docker compose logs postgres`).

---

## Workaround

Until this command is implemented, you can view logs directly with Docker Compose:

### View all service logs

```bash
docker compose -f docker-compose.devstack.yml logs
```

### Follow logs in real time

```bash
docker compose -f docker-compose.devstack.yml logs -f
```

### View logs for a specific service

```bash
docker compose -f docker-compose.devstack.yml logs postgres
```

### Follow logs for a specific service

```bash
docker compose -f docker-compose.devstack.yml logs -f postgres
```

### View last N lines

```bash
docker compose -f docker-compose.devstack.yml logs --tail 100
```

---

## What's Next

- Check the [project roadmap](../README.md) for updates on when this feature will be available.
- In the meantime, use the Docker Compose workarounds above.
