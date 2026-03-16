# devStack CLI Documentation

> **devstack** — A CLI tool for managing your development stack with Docker Compose.

devStack eliminates the pain of manually writing and maintaining Docker Compose files for local development services. Instead of copying YAML snippets from project to project, devStack lets you declare what you need through a simple JSON config and generates a production-ready `docker-compose.yml` for you.

---

## Table of Contents

| Section | Description |
|---------|-------------|
| [Getting Started](getting-started.md) | Installation, prerequisites, and quick-start walkthrough |
| [Configuration Reference](configuration.md) | Full schema reference for `devstack.config.json` |
| [Architecture Overview](architecture.md) | How the project is structured and how the pieces fit together |

### Command Reference

| Command | Description | Docs |
|---------|-------------|------|
| [`devstack init`](commands/init.md) | Initialize a new devStack project | [→ Read more](commands/init.md) |
| [`devstack add postgres`](commands/add-postgres.md) | Add a PostgreSQL service to your project | [→ Read more](commands/add-postgres.md) |
| [`devstack gen`](commands/gen.md) | Generate a Docker Compose file from your config | [→ Read more](commands/gen.md) |
| [`devstack up`](commands/up.md) | Start all configured services | [→ Read more](commands/up.md) |
| [`devstack down`](commands/down.md) | Stop and clean up services | [→ Read more](commands/down.md) |
| [`devstack logs`](commands/logs.md) | View service logs *(coming soon)* | [→ Read more](commands/logs.md) |

---

## Typical Workflow

```text
┌──────────────┐     ┌───────────────────┐     ┌──────────────┐     ┌──────────────┐
│ devstack init│ ──▶ │ devstack add ...   │ ──▶ │ devstack gen │ ──▶ │ devstack up  │
│              │     │ (postgres, etc.)   │     │              │     │              │
└──────────────┘     └───────────────────┘     └──────────────┘     └──────────────┘
                                                                           │
                                                                           ▼
                                                                    ┌──────────────┐
                                                                    │ devstack down│
                                                                    └──────────────┘
```

1. **Initialize** — `devstack init` creates a `devstack.config.json` in your project root.
2. **Add services** — Commands like `devstack add postgres` register services into the config.
3. **Generate** — `devstack gen` reads the config and produces a Docker Compose YAML file.
4. **Start** — `devstack up` launches all services via `docker compose up`.
5. **Stop** — `devstack down` tears everything down and optionally cleans up volumes/images.

---

## Technology Stack

| Component | Technology |
|-----------|-----------|
| Language | TypeScript |
| CLI Framework | [Commander.js](https://github.com/tj/commander.js) v14 |
| Docker Integration | Docker Compose (spawned as a subprocess) |
| Configuration Format | JSON (`devstack.config.json`) |
| Output Format | YAML (`docker-compose.devstack.yml`) |
| Build Tool | [tsup](https://github.com/egoist/tsup) |
| Runtime | Node.js ≥ 18 |

---

## Further Reading

- [Getting Started Guide](getting-started.md) — Step-by-step walkthrough from install to running services.
- [Configuration Reference](configuration.md) — Every field in `devstack.config.json` explained.
- [Architecture Overview](architecture.md) — Source code layout, design decisions, and extension points.
