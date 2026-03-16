# `devstack add postgres`

Add a PostgreSQL database service to your devStack project.

---

## Usage

```bash
devstack add postgres [options]
```

## Options

| Flag | Alias | Type | Default | Description |
|------|-------|------|---------|-------------|
| `--port <port>` | `-p` | `string` | `5432` | Host port to expose PostgreSQL on. The container's internal port is always `5432`; this controls the host-side mapping. |
| `--user <user>` | `-u` | `string` | `postgres` | PostgreSQL superuser username. Maps to the `POSTGRES_USER` environment variable. |
| `--password <password>` | `-P` | `string` | `postgres` | PostgreSQL superuser password. Maps to the `POSTGRES_PASSWORD` environment variable. |
| `--database <database>` | `-d` | `string` | `postgres` | Name of the default database created on startup. Maps to the `POSTGRES_DB` environment variable. |

---

## What It Does

This command registers a PostgreSQL service in your `devstack.config.json`. It does **not** start the database or generate the Docker Compose file — those are separate steps (`devstack gen` and `devstack up`).

### Step by Step

1. **Reads the existing config** — Loads `devstack.config.json` from the current directory. Exits with an error if the file doesn't exist (run `devstack init` first).

2. **Checks for duplicates** — If a `postgres` service is already configured, the command exits to prevent accidental overwrites:

   ```
   ⚠️ Postgres is already configured.
   ```

3. **Validates the port** — Ensures the provided port is a valid number. If not:

   ```
   ⚠️ Invalid port number.
   ```

4. **Builds the service configuration** — Merges your options with defaults to create a complete service entry:

   ```json
   {
     "enabled": true,
     "image": "postgres:latest",
     "containerName": "<projectName>_postgres",
     "port": "5432",
     "username": "postgres",
     "password": "postgres",
     "database": "postgres",
     "volume": true
   }
   ```

5. **Writes the updated config** — Saves the updated `devstack.config.json` back to disk.

6. **Prints a summary** — Shows the configured values and next steps.

---

## Configuration Fields

When added, the PostgreSQL service entry includes these fields:

| Field | Description |
|-------|-------------|
| `enabled` | Always `true` when added. Set to `false` manually to disable without removing. |
| `image` | Docker image. Defaults to `postgres:latest`. Edit the JSON to pin a version (e.g., `postgres:16`). |
| `containerName` | Automatically set to `<projectName>_postgres` for easy identification in `docker ps`. |
| `port` | Host port mapping. The container always listens on `5432` internally. |
| `username` | Superuser name passed as `POSTGRES_USER`. |
| `password` | Superuser password passed as `POSTGRES_PASSWORD`. |
| `database` | Default database name passed as `POSTGRES_DB`. |
| `volume` | When `true`, a named volume `postgres_data` is mounted at `/var/lib/postgresql/data` for persistent storage. |

---

## Examples

### Add with all defaults

```bash
devstack add postgres
```

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

### Add with custom settings

```bash
devstack add postgres \
  --port 5433 \
  --user admin \
  --password supersecret \
  --database myapp_dev
```

**Output:**

```
✅ PostgreSQL added to DevStack

----Configuration----
  Port:      5433
  User:      admin
  Database:  myapp_dev

Next steps:
  devstack generate
  devstack up
```

### Resulting config (custom settings)

After running the command above, `devstack.config.json` looks like:

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
      "port": "5433",
      "username": "admin",
      "password": "supersecret",
      "database": "myapp_dev",
      "volume": true
    }
  }
}
```

---

## Error Cases

### No config file

```
No devstack.config.json found in the current directory.
```

**Fix:** Run `devstack init` first.

### Postgres already configured

```
⚠️ Postgres is already configured.
```

**Fix:** To reconfigure, edit `devstack.config.json` directly, or remove the `postgres` key from `services` and re-run the command.

### Invalid port number

```
⚠️ Invalid port number.
```

**Fix:** Provide a valid numeric port, e.g., `--port 5432`.

---

## What's Next

After adding PostgreSQL, generate the Docker Compose file:

```bash
devstack gen
```

See [`devstack gen`](gen.md) for full details.
