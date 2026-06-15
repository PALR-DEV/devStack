---
id: mysql
title: MySQL
sidebar_position: 2
---

# MySQL

```bash
devstack add mysql
```

## Options

| Flag | Default | Description |
|------|---------|-------------|
| `-p, --port` | `3306` | Host port to expose |
| `-R, --root-password` | `rootpassword` | MySQL root password |
| `-u, --username` | `mysql` | Database username |
| `-P, --password` | `mysql` | Database password |
| `-d, --database` | `mysql` | Default database name |

## Connection string

```
mysql://mysql:mysql@localhost:3306/mysql
```

## Connect interactively

```bash
devstack connect mysql
```

Opens the `mysql` CLI inside the running container.

## Application config examples

```bash title=".env"
DATABASE_URL=mysql://mysql:mysql@localhost:3306/mysql
```

```ts title="TypeScript (mysql2)"
import mysql from 'mysql2/promise';
const conn = await mysql.createConnection(process.env.DATABASE_URL);
```

```python title="Python (PyMySQL)"
import pymysql
conn = pymysql.connect(host='localhost', port=3306, user='mysql', password='mysql', db='mysql')
```
