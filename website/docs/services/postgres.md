---
id: postgres
title: PostgreSQL
sidebar_position: 1
---

# PostgreSQL

```bash
devstack add postgres
```

## Options

| Flag | Default | Description |
|------|---------|-------------|
| `-p, --port` | `5432` | Host port to expose |
| `-u, --username` | `postgres` | Database username |
| `-P, --password` | `postgres` | Database password |
| `-d, --database` | `postgres` | Default database name |

```bash
# Custom credentials
devstack add postgres --username myapp --password secret --database myapp_dev
```

## Connection string

```
postgresql://postgres:postgres@localhost:5432/postgres
```

## Connect interactively

```bash
devstack connect postgres
```

Opens `psql` inside the running container.

## Application config examples

```bash title=".env"
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres
```

```ts title="TypeScript (pg)"
import { Pool } from 'pg';
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
```

```python title="Python (psycopg2)"
import psycopg2
conn = psycopg2.connect("postgresql://postgres:postgres@localhost:5432/postgres")
```
