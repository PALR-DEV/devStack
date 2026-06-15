---
id: intro
title: What is devstack?
sidebar_position: 1
---

# What is devstack?

devstack is a CLI framework for managing local development infrastructure. It lets you declare which services your project needs — PostgreSQL, Redis, MongoDB, and more — and handles spinning them all up through Docker Compose with sane defaults.

## The problem

Every time you start a new project you go through the same ritual: pull the right Docker image, figure out the right flags, write a `docker-compose.yml` from scratch, copy-paste connection strings into `.env`, repeat for every service. Then do it again on your teammate's machine. And again when you onboard someone new.

That friction compounds. People skip local infrastructure and use shared dev databases instead. Environments drift. "Works on my machine" becomes the norm.

## What devstack does

devstack replaces that ritual with three commands:

```bash
devstack init my-project
devstack add postgres
devstack up
```

That's it. Your database is running, the volume is named, the container has a predictable name, and the connection string is always the same.

## The philosophy

**Conventions over configuration.** devstack picks defaults that work and sticks with them. You shouldn't have to decide whether Postgres runs on 5432 today. It always does.

**Declaration, then generation.** You describe what you need in `devstack.config.json`. devstack generates the `docker-compose.yml`. The compose file is always a build artifact — you can inspect, modify, or delete it, and `devstack gen` will rebuild it.

**Local-only by design.** devstack is not for production. It's not trying to be Kubernetes or Terraform. It solves the specific problem of getting your local environment up fast and keeping it consistent across your team.

## Next

- [Getting Started →](./getting-started)
- [Browse services →](./services/postgres)
- [Full command reference →](./commands)
