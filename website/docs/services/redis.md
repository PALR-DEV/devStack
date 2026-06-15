---
id: redis
title: Redis
sidebar_position: 4
---

# Redis

```bash
devstack add redis
```

## Options

| Flag | Default | Description |
|------|---------|-------------|
| `-p, --port` | `6379` | Host port to expose |
| `--password` | _(none)_ | Optional password |

Password is optional. If omitted, Redis runs without authentication (fine for local dev).

## Connection string

```
redis://localhost:6379
# with password:
redis://:yourpassword@localhost:6379
```

## Connect interactively

```bash
devstack connect redis
```

Opens `redis-cli` inside the running container.

## Application config examples

```bash title=".env"
REDIS_URL=redis://localhost:6379
```

```ts title="TypeScript (ioredis)"
import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL);
```

```python title="Python (redis-py)"
import redis
r = redis.from_url('redis://localhost:6379')
```
