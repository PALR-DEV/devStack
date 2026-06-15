---
id: configuration
title: Configuration Reference
sidebar_position: 5
---

# Configuration Reference

devstack stores everything in `devstack.config.json` at the root of your project.

## Example

```json
{
  "projectName": "my-project",
  "composeFileName": "docker-compose.devstack.yml",
  "services": {
    "postgres": {
      "enabled": true,
      "image": "postgres:16",
      "containerName": "my-project_postgres",
      "port": 5432,
      "username": "postgres",
      "password": "postgres",
      "database": "postgres",
      "volume": true
    },
    "redis": {
      "enabled": true,
      "image": "redis:7",
      "containerName": "my-project_redis",
      "port": 6379,
      "volume": true
    }
  }
}
```

## Fields

### Top-level

| Field | Type | Description |
|-------|------|-------------|
| `projectName` | `string` | Used as a prefix for container names |
| `composeFileName` | `string` | Name of the generated compose file (default: `docker-compose.devstack.yml`) |
| `services` | `object` | Map of service name → service config |

### Service fields (common)

| Field | Type | Description |
|-------|------|-------------|
| `enabled` | `boolean` | Whether the service is included in compose output |
| `image` | `string` | Docker image and tag |
| `containerName` | `string` | Fixed container name (set automatically) |
| `port` | `number` | Host port |
| `volume` | `boolean` | Whether to create a named volume for persistence |
| `restart` | `string` | Docker restart policy (e.g. `unless-stopped`) |

## Notes

- **Never edit this file manually** unless you know what you're doing. Use `devstack add` and `devstack remove` instead.
- The `composeFileName` field is there if you need to co-exist with an existing `docker-compose.yml` in your project.
- Container names use `projectName` as a prefix so multiple projects can run simultaneously without conflicts.
