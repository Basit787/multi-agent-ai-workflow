# Multi-Agent AI Workflow

Users sign up, submit a task, and a **Planner → Researcher → Writer** agent
pipeline answers it with a local LLM (Ollama). Every step is stored in
PostgreSQL.

| Part       | Stack                                                            | Port |
| ---------- | ---------------------------------------------------------------- | ---- |
| `client/`  | TanStack Start (React 19), TanStack Form, Tailwind, shadcn       | 3000 |
| `server/`  | NestJS 12, Drizzle ORM, PostgreSQL, Better Auth, class-validator | 3001 |
| PostgreSQL | `postgres:16-alpine`                                             | 5434 |
| Ollama     | LLM runtime (default model `llama3.2`)                           | —    |
| Floci      | Local AWS emulator (S3, SQS, …)                                  | 4566 |

## Quick start

Run everything in Docker. Nothing is needed on the host except Docker:

```bash
make up   # Postgres, Ollama (+ model pull), Floci, server, client
docker compose exec server node dist/db/seed.js   # optional: admin user
```

Open <http://localhost:3000>. The first start downloads the Ollama model,
which takes a few minutes.

Or run the apps on the host with only Postgres in Docker:

```bash
make install
docker compose up -d postgres   # Postgres on localhost:5434
pnpm -C server start:dev   # server on :3001
pnpm -C client dev         # client on :3000 (second terminal)
```

See [docs/makefile.md](docs/makefile.md) for every target.

## Documentation

| Doc                                                | What it covers                               |
| -------------------------------------------------- | -------------------------------------------- |
| [Server architecture](docs/server/architecture.md) | Modules, auth, `@app/db`, data model, agents |
| [Server API](docs/server/api.md)                   | Every endpoint, request and response, errors |
| [Server development](docs/server/development.md)   | Env vars, database, checks                   |
| [Client architecture](docs/client/architecture.md) | Routes, `_lib`, components, data flow        |
| [Client development](docs/client/development.md)   | Running, adding routes, checks               |
| [Docker](docs/docker.md)                           | The compose stack: services, Ollama, Floci   |
| [Makefile](docs/makefile.md)                       | Every `make` target                          |
