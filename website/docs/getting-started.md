---
id: getting-started
title: Getting Started
sidebar_position: 2
---

# Getting Started

## Prerequisites

- [Node.js](https://nodejs.org) 18 or later
- [Docker](https://www.docker.com/products/docker-desktop) (running)

## Install

```bash
npm install -g @palr-dev/devstack-cli
```

Verify the install:

```bash
devstack --version
```

## Initialize a project

Run this in your project root (or any directory you want to manage):

```bash
devstack init my-project
```

This creates `devstack.config.json` — the single source of truth for your local stack.

## Add services

Add any services your project needs:

```bash
devstack add postgres
devstack add redis
devstack add mongo
```

Each command updates `devstack.config.json` with the service and its defaults. You can add as many services as you need.

## Generate the compose file

```bash
devstack gen
```

This reads your config and writes `docker-compose.devstack.yml`. You can inspect this file — it's just standard Docker Compose.

## Start everything

```bash
devstack up
```

All your services start in the background. Volumes are created, containers are named, everything is ready.

## Check what's running

```bash
devstack info
```

Shows each service, its running status, and its connection string.

## Stop everything

```bash
devstack down
```

## The full workflow at a glance

```
devstack init           # create config
devstack add <service>  # declare what you need
devstack gen            # generate compose file
devstack up             # start services
devstack info           # verify everything is running
devstack down           # stop when done
```

:::tip Commit your config, not the compose file
Add `devstack.config.json` to git. Add `docker-compose.devstack.yml` to `.gitignore`. Teammates run `devstack gen && devstack up` and get the exact same environment.
:::
