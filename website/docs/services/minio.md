---
id: minio
title: MinIO (S3-compatible storage)
sidebar_position: 7
---

# MinIO

MinIO gives you S3-compatible object storage locally. Any code that uses the AWS S3 SDK works against MinIO without changes — just point it at `localhost:9000`.

```bash
devstack add minio
```

## Options

| Flag | Default | Description |
|------|---------|-------------|
| `-p, --port` | `9000` | S3 API port |
| `-c, --console-port` | `9001` | Web console port |
| `-u, --root-user` | `minioadmin` | Root user (access key) |
| `-P, --root-password` | `minioadmin` | Root password (secret key) |

## Endpoints

| Purpose | URL |
|---------|-----|
| S3 API | `http://localhost:9000` |
| Web Console | `http://localhost:9001` |

## Open the console

```bash
devstack open minio
```

Opens the MinIO console at `http://localhost:9001`. Create buckets, upload files, manage policies — all from the browser.

## Application config examples

```bash title=".env"
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET=my-bucket
```

```ts title="TypeScript (AWS SDK v3)"
import { S3Client } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
  forcePathStyle: true, // required for MinIO
});
```

```python title="Python (boto3)"
import boto3
s3 = boto3.client(
    's3',
    endpoint_url='http://localhost:9000',
    aws_access_key_id='minioadmin',
    aws_secret_access_key='minioadmin',
)
```

:::tip forcePathStyle
Always set `forcePathStyle: true` (or `addressing_style: 'path'` in Python) when using MinIO. The default virtual-hosted-style URLs (`bucket.localhost`) don't work with a local server.
:::
