---
id: elasticsearch
title: Elasticsearch
sidebar_position: 6
---

# Elasticsearch

```bash
devstack add elasticsearch
```

## Options

| Flag | Default | Description |
|------|---------|-------------|
| `-p, --port` | `9200` | HTTP port |
| `-P, --password` | _(none)_ | Elastic password (enables security when set) |

When no password is set, Elasticsearch runs in single-node mode without security — ideal for local dev. Setting a password enables the built-in security features.

## Endpoint

```
http://localhost:9200
```

## Open in browser

```bash
devstack open elasticsearch
```

Opens `http://localhost:9200` — you'll see the cluster info JSON response.

## Application config examples

```bash title=".env"
ELASTICSEARCH_URL=http://localhost:9200
```

```ts title="TypeScript (@elastic/elasticsearch)"
import { Client } from '@elastic/elasticsearch';
const client = new Client({ node: process.env.ELASTICSEARCH_URL });
```

```python title="Python (elasticsearch-py)"
from elasticsearch import Elasticsearch
es = Elasticsearch('http://localhost:9200')
```
