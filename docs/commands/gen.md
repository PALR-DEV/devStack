# `devstack gen`

Generate a Docker Compose file from your `devstack.config.json`.

---

## Usage

```bash
devstack gen
```

This command takes no arguments or options. It reads your configuration and produces a ready-to-use Docker Compose YAML file.

---

## What It Does

The `gen` command is the bridge between your devStack configuration and Docker Compose. It reads `devstack.config.json`, translates each configured service into the equivalent Docker Compose service definition, and writes the result as a YAML file.

### Step by Step

1. **Reads the configuration** — Loads `devstack.config.json` from the current directory. Exits if the file doesn't exist.

2. **Validates that services exist** — If the `services` object is empty or has no keys, the command exits:

   ```
   ⚠️ No services configured. Please add a service before generating the configuration.
   ```

3. **Builds the Compose structure** — For each supported and enabled service, a Docker Compose service definition is built:

   - **PostgreSQL** — Creates a service with image, container name, port mapping, environment variables, and optional volume.

4. **Validates generation output** — If no supported services were found (e.g., all services are disabled or unrecognized), the command exits:

   ```
   ⚠️ No supported services found to generate.
   ```

5. **Serializes to YAML** — The Compose structure is converted to YAML using the [yaml](https://github.com/eemeli/yaml) library.

6. **Writes the file** — The YAML content is written to the filename specified in `config.composeFileName` (default: `docker-compose.devstack.yml`).

---

## Generated File

### Output: `docker-compose.devstack.yml`

For a project with PostgreSQL configured with defaults, the generated file looks like:

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

### Structure Breakdown

| Section | Description |
|---------|-------------|
| `services` | Contains one key per configured service. Each service has its Docker image, container name, port mappings, environment variables, and volume mounts. |
| `volumes` | Top-level named volumes used by services. Only included if at least one service has `volume: true` in its configuration. |

---

## How Services Map to Compose

### PostgreSQL

| Config Field | Compose Field | Example |
|-------------|--------------|---------|
| `image` | `services.postgres.image` | `postgres:latest` |
| `containerName` | `services.postgres.container_name` | `my-app_postgres` |
| `port` | `services.postgres.ports[0]` | `"5433:5432"` |
| `username` | `services.postgres.environment.POSTGRES_USER` | `admin` |
| `password` | `services.postgres.environment.POSTGRES_PASSWORD` | `secret` |
| `database` | `services.postgres.environment.POSTGRES_DB` | `mydb` |
| `volume: true` | `services.postgres.volumes` + `volumes.postgres_data` | `postgres_data:/var/lib/postgresql/data` |
| `volume: false` | *(omitted)* | No volume section |
| `enabled: false` | *(entire service omitted)* | Service not generated |

---

## Examples

### Generate with default PostgreSQL

```bash
devstack gen
```

**Output:**

```
✅ Docker Compose configuration generated successfully
📄 File: /path/to/my-app/docker-compose.devstack.yml

Next steps:
  devstack up
```

### Regenerate after config changes

If you manually edit `devstack.config.json` (e.g., change the port or image version), simply re-run:

```bash
devstack gen
```

The existing compose file is overwritten with the updated configuration.

---

## Error Cases

### No config file

```
No devstack.config.json found in the current directory.
```

**Fix:** Run `devstack init` first.

### No services configured

```
⚠️ No services configured. Please add a service before generating the configuration.
```

**Fix:** Add at least one service:

```bash
devstack add postgres
```

### No supported services

```
⚠️ No supported services found to generate.
```

This occurs when services exist in the config but none are recognized or enabled. Check that your service entries have `"enabled": true` and are supported by the current version.

---

## Custom Compose Filename

By default, devStack writes to `docker-compose.devstack.yml`. You can change this by editing the `composeFileName` field in `devstack.config.json`:

```json
{
  "composeFileName": "docker-compose.yml"
}
```

Then re-run `devstack gen` to generate a file with the new name. The `up` and `down` commands also read this field, so they'll automatically use the new filename.

---

## What's Next

After generating the Docker Compose file, start your services:

```bash
devstack up
```

See [`devstack up`](up.md) for full details.
