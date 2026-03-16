# `devstack up`

Start all configured devStack services using Docker Compose.

---

## Usage

```bash
devstack up [options]
```

## Options

| Flag | Alias | Type | Default | Description |
|------|-------|------|---------|-------------|
| `--build` | `-b` | `boolean` | `false` | Rebuild Docker images before starting containers. Useful when Dockerfiles or build contexts have changed. |

---

## What It Does

The `up` command launches all services defined in your generated Docker Compose file. It is a thin wrapper around `docker compose up` that handles file discovery, flag assembly, and error reporting for you.

### Step by Step

1. **Reads the configuration** — Loads `devstack.config.json` to determine the compose filename (default: `docker-compose.devstack.yml`).

2. **Verifies the compose file exists** — If the file is missing, the command exits with a helpful message:

   ```
   ⚠️ docker-compose.devstack.yml not found.
   Please run `devstack generate` first.
   ```

3. **Assembles the Docker command** — Builds the argument list:

   ```
   docker compose -f <composeFileName> up -d
   ```

   Services always run in **detached mode** (`-d`), so your terminal is returned immediately.

   If `--build` is passed, `--build` is appended:

   ```
   docker compose -f <composeFileName> up -d --build
   ```

4. **Spawns the Docker process** — Runs `docker compose` as a child process with `stdio: 'inherit'`, so you see real-time output from Docker directly in your terminal.

5. **Reports the result** — On success, prints a confirmation. On failure, prints an error and exits with the Docker Compose exit code.

---

## Docker Command Executed

Under the hood, `devstack up` runs:

```bash
docker compose -f docker-compose.devstack.yml up -d
```

With the `--build` flag:

```bash
docker compose -f docker-compose.devstack.yml up -d --build
```

---

## Examples

### Start services

```bash
devstack up
```

**Output:**

```
🚀 Starting DevStack services...
📄 Using: docker-compose.devstack.yml

 ✔ Network my-app_default        Created
 ✔ Volume "postgres_data"        Created
 ✔ Container my-app_postgres     Started

✅ DevStack services are up
```

### Start with image rebuild

```bash
devstack up --build
```

This is useful when:
- You've modified a custom Dockerfile
- You want to force-pull the latest version of base images
- You've added build arguments or changed the build context

### Verify services are running

After `devstack up`, you can verify with Docker:

```bash
docker ps
```

Expected output:

```
CONTAINER ID   IMAGE             COMMAND                  PORTS                    NAMES
a1b2c3d4e5f6   postgres:latest   "docker-entrypoint.s…"   0.0.0.0:5432->5432/tcp   my-app_postgres
```

### Connect to PostgreSQL

With default settings:

```bash
psql -h localhost -p 5432 -U postgres -d postgres
```

Or use a connection string:

```
postgresql://postgres:postgres@localhost:5432/postgres
```

---

## Error Cases

### Compose file not found

```
⚠️ docker-compose.devstack.yml not found.
Please run `devstack generate` first.
```

**Fix:** Generate the compose file first:

```bash
devstack gen
```

### Docker not running

```
❌ Failed to run Docker Compose.
Cannot connect to the Docker daemon. Is Docker running?
```

**Fix:** Start Docker Desktop or the Docker daemon, then retry.

### Docker Compose error

```
❌ Docker Compose exited with an error.
```

The exit code from `docker compose` is forwarded. Check the Docker output above the error message for details (e.g., port conflicts, image pull failures).

---

## Detached Mode

Services always start in detached mode (`-d`). This means:

- Containers run in the background.
- Your terminal is returned immediately after startup.
- To view logs, use `docker compose logs` or the upcoming `devstack logs` command.
- To stop services, use `devstack down`.

---

## What's Next

- To view logs: `docker compose -f docker-compose.devstack.yml logs -f` (or wait for `devstack logs`).
- To stop services: [`devstack down`](down.md).
