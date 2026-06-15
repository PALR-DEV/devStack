---
id: mailpit
title: Mailpit (email catcher)
sidebar_position: 8
---

# Mailpit

Mailpit catches all outgoing emails from your app and shows them in a browser UI. Your app sends email normally — Mailpit intercepts it instead of delivering it. No real emails are ever sent.

```bash
devstack add mailpit
```

## Options

| Flag | Default | Description |
|------|---------|-------------|
| `-p, --smtp-port` | `1025` | SMTP port your app sends to |
| `-u, --ui-port` | `8025` | Web UI port to inspect emails |

## Open the inbox

```bash
devstack open mailpit
```

Opens `http://localhost:8025` where you can read every email your app sends.

## Application config examples

Point your app's mailer at `localhost:1025` with no authentication:

```bash title=".env"
MAIL_HOST=localhost
MAIL_PORT=1025
MAIL_FROM=noreply@devstack.local
```

```ts title="TypeScript (Nodemailer)"
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'localhost',
  port: 1025,
  secure: false,
  ignoreTLS: true,
});

await transporter.sendMail({
  from: 'noreply@devstack.local',
  to: 'user@example.com',
  subject: 'Hello',
  text: 'This appears in Mailpit, not in anyone\'s inbox.',
});
```

```python title="Python (smtplib)"
import smtplib
from email.message import EmailMessage

msg = EmailMessage()
msg['From'] = 'noreply@devstack.local'
msg['To'] = 'user@example.com'
msg['Subject'] = 'Hello'
msg.set_content('This appears in Mailpit.')

with smtplib.SMTP('localhost', 1025) as smtp:
    smtp.send_message(msg)
```

:::info No auth needed
Mailpit accepts any SMTP connection without authentication. You don't need to set a username or password in your mailer config.
:::
