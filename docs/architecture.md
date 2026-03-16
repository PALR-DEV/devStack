# Architecture Overview

This document explains how the devStack CLI project is structured, how the pieces connect, and where to look when extending or debugging the tool.

---

## High-Level Design

devStack follows a straightforward pipeline architecture:

```
 User runs CLI command
         │
         ▼
  ┌──────────────┐
  │  Commander.js │   ← Parses commands, flags, and arguments
  │  (index.ts)   │
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │  Command Fn  │   ← Business logic for each command (functions/)
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │ Config Utils │   ← Read/write devstack.config.json (utils/)
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │  File System │   ← JSON config, YAML compose file
  │  / Docker    │   ← docker compose up/down (child process)
  └──────────────┘
```

1. **CLI Parsing** — `src/index.ts` uses Commander.js to define commands, options, and route to handler functions.
2. **Command Functions** — Each command has its own file under `src/functions/`. These contain the business logic.
3. **Shared Utilities** — `src/utils/config.ts` provides helpers for reading and writing the `devstack.config.json` file.
4. **Models** — `src/models/devstack-config.ts` defines TypeScript interfaces for type-safe configuration handling.
5. **External Integration** — The `up` and `down` commands spawn `docker compose` as a child process using Node.js `spawnSync`.

---

## Directory Structure

```
src/
├── index.ts                          # CLI entry point & command definitions
├── functions/                        # One file per command
│   ├── createDevstackConfig.ts       # devstack init
│   ├── runAddPostgresConfig.ts       # devstack add postgres
│   ├── runGenerateConfig.ts          # devstack gen
│   ├── runUpConfig.ts                # devstack up
│   └── runDownConfig.ts              # devstack down
├── models/                           # TypeScript interfaces
│   └── devstack-config.ts            # DevStackConfig, PostgresServiceConfig, etc.
└── utils/                            # Shared helpers
    └── config.ts                     # readConfig(), writeConfig(), getConfigPath()
```

---

## Source File Breakdown

### `src/index.ts` — CLI Entry Point

This is the main entry point registered in `package.json` under the `bin` field:

```json
{
  "bin": {
    "devstack": "./dist/index.cjs"
  }
}
```

**Responsibilities:**

- Displays the ASCII art header with version and system info.
- Defines all CLI commands using Commander.js (`program.command(...)`).
- Maps commands and flags to their handler functions.
- Handles nested commands via `addCommand` (e.g., `devstack add postgres` is a subcommand of `add`).

**Command registration pattern:**

```typescript
program
  .command('init')
  .description('Initialize a new DevStack project')
  .argument("[project name]", "project name")
  .action((projectName) => {
    createDevstackConfig(projectName);
  });
```

---

### `src/functions/` — Command Implementations

Each command is a standalone function exported from its own file. This separation keeps the code modular and testable.

| File | Function | Command |
|------|----------|---------|
| `createDevstackConfig.ts` | `createDevstackConfig(projectName?)` | `devstack init` |
| `runAddPostgresConfig.ts` | `runAddPostgresConfig(options)` | `devstack add postgres` |
| `runGenerateConfig.ts` | `runGenerateConfig()` | `devstack gen` |
| `runUpConfig.ts` | `runUpConfig(options)` | `devstack up` |
| `runDownConfig.ts` | `runDownConfig(options)` | `devstack down` |

---

### `src/models/devstack-config.ts` — Type Definitions

Defines the shape of the configuration data:

```typescript
interface DevStackConfig {
  projectName: string;
  version: string;
  composeFileName: string;
  services: DevStackServices;
}

interface DevStackServices {
  postgres?: PostgresServiceConfig;
  redis?: RedisServiceConfig;        // Defined but not yet implemented
}

interface PostgresServiceConfig {
  enabled: boolean;
  image: string;
  containerName: string;
  port: string;
  username: string;
  password: string;
  database: string;
  volume: boolean;
}
```

> **Note:** A `RedisServiceConfig` interface is already defined, anticipating future Redis support.

---

### `src/utils/config.ts` — Configuration Helpers

Three shared utility functions used by most commands:

| Function | Purpose |
|----------|---------|
| `getConfigPath()` | Returns the absolute path to `devstack.config.json` in the current directory. |
| `readConfig()` | Reads and parses the config file. Exits with an error if the file doesn't exist. |
| `writeConfig(config)` | Serializes the config object to JSON and writes it to disk with 2-space indentation. |

---

## Build System

devStack uses [tsup](https://github.com/egoist/tsup) to bundle TypeScript source into a single CommonJS file:

```bash
# Build command (defined in package.json)
tsup src/index.ts --format cjs --out-dir dist --clean
```

| Input | Output |
|-------|--------|
| `src/index.ts` (+ all imports) | `dist/index.cjs` |

**Why CommonJS?** The `bin` field in `package.json` points to `dist/index.cjs`. This ensures compatibility across different Node.js environments, including those that don't fully support ESM for CLI binaries.

**Development mode:**

```bash
# Run directly from TypeScript source using tsx
npm run dev
```

---

## Data Flow

### Init Flow

```
devstack init my-app
  │
  ├─ Check if devstack.config.json already exists → error if yes
  ├─ Create DevStackConfig object with projectName, version, composeFileName
  └─ Write devstack.config.json to disk
```

### Add Service Flow

```
devstack add postgres --port 5433
  │
  ├─ Read devstack.config.json
  ├─ Validate service not already configured → error if yes
  ├─ Validate port is numeric → error if not
  ├─ Merge service config into config.services.postgres
  └─ Write updated devstack.config.json to disk
```

### Generate Flow

```
devstack gen
  │
  ├─ Read devstack.config.json
  ├─ Validate at least one service exists → error if empty
  ├─ For each enabled service, build Docker Compose structure:
  │     ├─ Service definition (image, ports, environment, volumes)
  │     └─ Top-level volume definitions
  ├─ Convert structure to YAML using the yaml library
  └─ Write docker-compose.devstack.yml to disk
```

### Up Flow

```
devstack up --build
  │
  ├─ Read devstack.config.json for compose filename
  ├─ Verify compose file exists on disk → error if missing
  ├─ Build docker compose args: ["compose", "-f", <file>, "up", "-d"]
  │     └─ Append "--build" if --build flag is set
  ├─ Spawn docker compose as a child process (stdio: inherit)
  └─ Report success or failure based on exit code
```

### Down Flow

```
devstack down -a
  │
  ├─ Read devstack.config.json for compose filename
  ├─ Build docker compose args: ["compose", "-f", <file>, "down"]
  │     ├─ Append "-v" if --remove-volumes or --all
  │     └─ Append "--rmi all" if --remove-images or --all
  ├─ Spawn docker compose as a child process (stdio: inherit)
  ├─ Run "docker builder prune -f" for cache cleanup
  └─ Exit with compose exit code
```

---

## Extension Points

To add a new service (e.g., Redis):

1. **Define the interface** in `src/models/devstack-config.ts` (a `RedisServiceConfig` already exists).
2. **Add the key** to `DevStackServices` (already done for Redis).
3. **Create a command function** in `src/functions/` (e.g., `runAddRedisConfig.ts`) following the same pattern as `runAddPostgresConfig.ts`.
4. **Register the subcommand** in `src/index.ts` under the `addCommand` group.
5. **Add a generator** in `runGenerateConfig.ts` — a function like `addRedisService()` that populates the compose config.
6. **Rebuild** with `npm run build`.

---

## Dependencies

| Package | Purpose |
|---------|---------|
| `commander` | CLI command parsing, flag handling, help text generation |
| `yaml` | Serializing JavaScript objects to Docker Compose YAML |
| `tsup` | Bundling TypeScript to CJS for distribution |
| `typescript` | Type checking during development |
| `tsx` | Running TypeScript directly during development (`npm run dev`) |
| `@types/node` | Node.js type definitions for TypeScript |
