---
id: mongo
title: MongoDB
sidebar_position: 3
---

# MongoDB

```bash
devstack add mongo
```

## Options

| Flag | Default | Description |
|------|---------|-------------|
| `-p, --port` | `27017` | Host port to expose |
| `-u, --username` | `mongo` | Root username |
| `-P, --password` | `mongo` | Root password |
| `-d, --database` | `mongo` | Default database name |

## Connection string

```
mongodb://mongo:mongo@localhost:27017/mongo
```

## Connect interactively

```bash
devstack connect mongo
```

Opens `mongosh` inside the running container.

## Application config examples

```bash title=".env"
MONGODB_URI=mongodb://mongo:mongo@localhost:27017/mongo
```

```ts title="TypeScript (mongoose)"
import mongoose from 'mongoose';
await mongoose.connect(process.env.MONGODB_URI);
```

```python title="Python (PyMongo)"
from pymongo import MongoClient
client = MongoClient('mongodb://mongo:mongo@localhost:27017/')
```
