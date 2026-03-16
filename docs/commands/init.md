# `devstack init`

Initialize a new devStack project in the current directory.

---

## Usage

```bash
devstack init [project-name]
```

## Arguments

| Argument | Required | Default | Description |
|----------|----------|---------|-------------|
| `project-name` | No | Name of the current directory | A human-readable name for your project. Used as a prefix for Docker container names. |

---

## What It Does

The `init` command bootstraps a new devStack project by creating a `devstack.config.json` file in your current working directory. This file acts as the single source of truth for all your local development services.

### Step by Step

1. **Checks for an existing config** — If a `devstack.config.json` already exists in the current directory, the command exits with an error to prevent accidental overwrites.

2. **Determines the project name** — If you pass a project name argument, that name is used. Otherwise, devStack uses the basename of the current directory (e.g., if you're in `/home/user/my-app`, the project name defaults to `my-app`).

3. **Creates the configuration file** — A `devstack.config.json` is written to disk with the following default structure:

   ```json
   {
     "projectName": "my-app",
     "version": "1.0.0",
     "composeFileName": "docker-compose.devstack.yml",
     "services": {}
   }
   ```

4. **Prints next steps** — Guides you toward adding a service and generating the Docker Compose file.

---

## Generated File

### `devstack.config.json`

| Field | Value | Description |
|-------|-------|-------------|
| `projectName` | Your project name or directory name | Used to name Docker containers (e.g., `my-app_postgres`) |
| `version` | `"1.0.0"` | Config schema version (reserved for future use) |
| `composeFileName` | `"docker-compose.devstack.yml"` | The filename for the generated Docker Compose file |
| `services` | `{}` | Empty object — services are added later via `devstack add` |

---

## Examples

### Initialize with a custom project name

```bash
devstack init my-app
```

**Output:**

```
✅ DevStack initialized
✅ Created /path/to/my-app/devstack.config.json

Next steps:
  devstack add postgres
  devstack generate
  devstack up
```

### Initialize using the directory name

```bash
cd my-project
devstack init
```

The project name is automatically set to `my-project`.

---

## Error Cases

### Config file already exists

If `devstack.config.json` is already present in the current directory:

```
A devstack.config.json already exists in this directory.
```

The command exits with code `1`. To re-initialize, delete the existing file first:

```bash
rm devstack.config.json
devstack init
```

---

## What's Next

After initializing your project, the typical next step is to add a service:

```bash
devstack add postgres
```

See [`devstack add postgres`](add-postgres.md) for full details.
