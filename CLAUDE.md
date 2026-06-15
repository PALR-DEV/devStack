# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Run CLI via tsx (no build needed)
npm run build        # Compile to dist/ via tsup (CJS output)
npm run start        # Run compiled dist/index.cjs
```

There is no test suite. Development uses `npm run dev` to exercise CLI commands directly.

## Architecture

This is a TypeScript CLI tool (`@palr-dev/devstack-cli`) that generates and manages Docker Compose files for local development. It is published to npm as `devstack` binary and has no runtime UI — everything runs in the terminal via [commander](https://github.com/tj/commander.js).

### Data flow for every command

1. **`src/index.ts`** — entry point; registers all `commander` commands and subcommands, then calls the appropriate `run*Config` function.
2. **`src/functions/run*Config.ts`** — one file per command. Each reads `devstack.config.json` from `process.cwd()` via `src/utils/config.ts`, mutates it or acts on it, then either writes it back or shells out to Docker.
3. **`src/utils/config.ts`** — thin helpers: `readConfig()`, `writeConfig()`, `convertToYAML()`. All config I/O goes through here.
4. **`src/models/devstack-config.ts`** — all TypeScript interfaces (`DevStackConfig`, `DevStackServices`, `PostgresServiceConfig`, `RedisServiceConfig`, `MongoServiceConfig`, `ComposeConfig`).

### `devstack gen` path

`runGenerateConfig` iterates `config.services`, looks up each service key in a **registry map** (`serviceGenerators: Record<string, fn>`), and delegates to `src/addServices/add*Service.ts`. Each `add*Service` function receives the full config and a mutable `ComposeConfig` object, and appends its service block (and any named volumes) directly onto `composeConfig.services` / `composeConfig.volumes`. The final object is serialised to YAML and written to `docker-compose.devstack.yml`.

### Adding a new service

1. Add a new interface to `src/models/devstack-config.ts` and extend `DevStackServices`.
2. Create `src/addServices/add<Name>Service.ts` — implements `(config, composeConfig) => void`.
3. Register it in the `serviceGenerators` map in `src/functions/runGenerateConfig.ts`.
4. Create `src/functions/runAdd<Name>Config.ts` — reads config, sets defaults, calls `writeConfig`.
5. Wire up the `addCommand.command('<name>')` subcommand in `src/index.ts`.

### Build output

`tsup` compiles everything to a single `dist/index.cjs` (CommonJS). The `bin` field in `package.json` points there. Source uses ESM (`"type": "module"`) with `.js` import extensions on all relative imports (required by `moduleResolution: nodenext`).
