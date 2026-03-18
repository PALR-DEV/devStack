# `devstack restart`

Restarts one or all DevStack services without stopping the entire stack.

## Usage

```bash
devstack restart [service]
```

## Arguments

| Argument  | Description                                      | Required |
|-----------|--------------------------------------------------|----------|
| `service` | Name of a specific service to restart (e.g. `redis`, `postgres`) | No |

## Examples

### Restart all services

```bash
devstack restart
```

### Restart a specific service

```bash
devstack restart redis
devstack restart postgres
```

## Notes

- The command requires a generated `docker-compose.devstack.yml` file. Run [`devstack gen`](gen.md) first if you haven't already.
- Restarting a service preserves its volumes and data.
- This is equivalent to running `docker compose restart [service]` against the devstack compose file.

## Related Commands

- [`devstack up`](up.md) — Start services
- [`devstack down`](down.md) — Stop services
- [`devstack logs`](logs.md) — View service logs
- [`devstack ps`](ps.md) — Show service status
