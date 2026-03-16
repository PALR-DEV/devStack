# `devstack down`

Stop all running devStack services and optionally clean up associated resources.

---

## Usage

```bash
devstack down [options]
```

## Options

| Flag | Alias | Type | Default | Description |
|------|-------|------|---------|-------------|
| `--remove-volumes` | `-v` | `boolean` | `false` | Remove named Docker volumes associated with the stack. This **deletes all persisted data** (e.g., database contents). |
| `--remove-images` | `-i` | `boolean` | `false` | Remove all Docker images used by the stack's services. |
| `--all` | `-a` | `boolean` | `false` | Shorthand for `--remove-volumes --remove-images`. Removes everything. |

---

## What It Does

The `down` command stops and removes all containers, networks, and optionally volumes and images created by `devstack up`. It also performs a Docker builder cache cleanup.

### Step by Step

1. **Reads the configuration** — Loads `devstack.config.json` to determine the compose filename. Exits if no compose filename is specified.

2. **Assembles the Docker command** — Builds the argument list:

   ```
   docker compose -f <composeFileName> down
   ```

   Additional flags are appended based on the options:

   | Option | Docker Flag | Effect |
   |--------|------------|--------|
   | `--remove-volumes` | `-v` | Removes named volumes declared in the `volumes` section of the compose file and anonymous volumes attached to containers. |
   | `--remove-images` | `--rmi all` | Removes all images used by any service in the compose file. |
   | `--all` | `-v --rmi all` | Enables both of the above. |

3. **Spawns the Docker process** — Runs `docker compose down` as a child process with `stdio: 'inherit'` so you see real-time output.

4. **Cleans the builder cache** — After stopping services, runs:

   ```bash
   docker builder prune -f
   ```

   This removes dangling build cache entries to free up disk space.

5. **Exits** — The process exits with the same exit code as `docker compose down`.

---

## Docker Commands Executed

### Basic stop

```bash
docker compose -f docker-compose.devstack.yml down
docker builder prune -f
```

### Stop and remove volumes

```bash
docker compose -f docker-compose.devstack.yml down -v
docker builder prune -f
```

### Stop and remove images

```bash
docker compose -f docker-compose.devstack.yml down --rmi all
docker builder prune -f
```

### Full cleanup

```bash
docker compose -f docker-compose.devstack.yml down -v --rmi all
docker builder prune -f
```

---

## Examples

### Stop services (keep data)

```bash
devstack down
```

**Output:**

```
⏹  Stopping DevStack services...

 ✔ Container my-app_postgres     Removed
 ✔ Network my-app_default        Removed

🧹 Cleaning Docker builder cache...

✅ DevStack stopped and cleaned successfully.
```

Containers and networks are removed, but **volumes (data) and images are preserved**. Next time you run `devstack up`, services will start quickly using the cached images and your data will still be there.

### Stop and remove everything

```bash
devstack down --all
```

or equivalently:

```bash
devstack down -v -i
```

**Output:**

```
⏹  Stopping DevStack services...

 ✔ Container my-app_postgres     Removed
 ✔ Volume "postgres_data"        Removed
 ✔ Image postgres:latest         Removed
 ✔ Network my-app_default        Removed

🧹 Cleaning Docker builder cache...

✅ DevStack stopped and cleaned successfully.
```

This removes **all data, images, and containers**. The next `devstack up` will need to pull images again and all database data will be lost.

### Remove only volumes (keep images)

```bash
devstack down -v
```

Useful when you want to reset your database to a clean state but keep the Docker images cached for faster restarts.

### Remove only images (keep data)

```bash
devstack down -i
```

Useful when you want to force a fresh image pull on the next `devstack up` but preserve your existing database data.

---

## Error Cases

### No config file

```
No devstack.config.json found in the current directory.
```

**Fix:** Make sure you're in the correct project directory where `devstack init` was run.

### No compose filename in config

```
⚠️ No compose file name specified in config.
```

**Fix:** Ensure your `devstack.config.json` includes a `composeFileName` field:

```json
{
  "composeFileName": "docker-compose.devstack.yml"
}
```

### Docker Compose failure

```
❌ Failed to stop DevStack services.
```

This occurs when `docker compose down` returns a non-zero exit code. Common causes:

- Docker daemon is not running.
- The compose file references resources that no longer exist.
- Permissions issues with Docker.

---

## Understanding Cleanup Levels

| Command | Containers | Networks | Volumes | Images | Builder Cache |
|---------|-----------|----------|---------|--------|---------------|
| `devstack down` | ✅ Removed | ✅ Removed | ❌ Kept | ❌ Kept | ✅ Pruned |
| `devstack down -v` | ✅ Removed | ✅ Removed | ✅ Removed | ❌ Kept | ✅ Pruned |
| `devstack down -i` | ✅ Removed | ✅ Removed | ❌ Kept | ✅ Removed | ✅ Pruned |
| `devstack down -a` | ✅ Removed | ✅ Removed | ✅ Removed | ✅ Removed | ✅ Pruned |

---

## What's Next

- To restart services: [`devstack up`](up.md).
- To reconfigure: Edit `devstack.config.json` and [`devstack gen`](gen.md).
