---
id: rabbitmq
title: RabbitMQ
sidebar_position: 5
---

# RabbitMQ

```bash
devstack add rabbitmq
```

## Options

| Flag | Default | Description |
|------|---------|-------------|
| `-p, --port` | `5672` | AMQP port |
| `-m, --management-port` | `15672` | Management UI port |
| `-u, --username` | `guest` | Username |
| `-P, --password` | `guest` | Password |

## Connection string

```
amqp://guest:guest@localhost:5672
```

## Management UI

```bash
devstack open rabbitmq
```

Opens the RabbitMQ Management UI at `http://localhost:15672`. Log in with your configured credentials.

## Connect to shell

```bash
devstack connect rabbitmq
```

Opens a bash shell inside the container (useful for `rabbitmqctl` commands).

## Application config examples

```bash title=".env"
RABBITMQ_URL=amqp://guest:guest@localhost:5672
```

```ts title="TypeScript (amqplib)"
import amqplib from 'amqplib';
const conn = await amqplib.connect(process.env.RABBITMQ_URL);
```

```python title="Python (pika)"
import pika
params = pika.URLParameters('amqp://guest:guest@localhost:5672')
conn = pika.BlockingConnection(params)
```
