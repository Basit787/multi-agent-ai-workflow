# Server development

## Run it

```bash
pnpm -C server install
docker compose up -d postgres redis      # Postgres :5434, Redis :6379
pnpm -C server start:dev                 # watch mode on :3001
```

The server reads `.env` from the repository root and applies pending
migrations on start.

## Environment

| Variable             | Default                                                                  |
| -------------------- | ------------------------------------------------------------------------ |
| `DATABASE_URL`       | none; local: `postgresql://postgres:postgres@localhost:5434/multi_agent` |
| `REDIS_URL`          | `redis://localhost:6379`                                                 |
| `BETTER_AUTH_SECRET` | dev value; set a long random string outside dev                          |
| `BETTER_AUTH_URL`    | `http://localhost:3000` (the client's origin)                            |
| `COOKIE_SECURE`      | `false` (`true` behind HTTPS)                                            |
| `OLLAMA_URL`         | `http://127.0.0.1:11434`                                                 |
| `OLLAMA_MODEL`       | `llama3.2`                                                               |
| `PORT`               | `3001`                                                                   |
| `ADMIN_EMAIL`        | `admin@example.com` (seed)                                               |
| `ADMIN_PASSWORD`     | `Admin123!` (seed)                                                       |

## Database

| Task                              | Command                                                         |
| --------------------------------- | --------------------------------------------------------------- |
| Change the schema                 | edit `libs/db/src/schema.ts`, then `pnpm -C server db:generate` |
| Apply migrations without starting | `pnpm -C server db:migrate`                                     |
| Create or reset the admin user    | `pnpm -C server db:seed`                                        |
| Drop everything and re-migrate    | `pnpm -C server db:reset`                                       |
| Browse data                       | `pnpm -C server db:studio`                                      |

Commit the generated files in `libs/db/src/drizzle/`. Never use
`drizzle-kit push`. For data changes, `drizzle-kit generate --custom` creates an
empty migration to write SQL into.

## Adding to a module

- Request bodies: a class-validator DTO in `<module>/dto/`, used as
  `@Body() body: SomeDto`.
- Types in `<module>/types/`, parsers (turning input into data) in
  `<module>/parser/`, helpers in `<module>/utils/`.
- Database access: inject `DbService` from `@app/db` in the service.
- Signed-in routes: `@UseGuards(AuthGuard)`; admin-only methods add
  `@UseGuards(RolesGuard)` and `@Roles(['admin'])`.

## Checks and style

```bash
pnpm -C server typecheck && pnpm -C server build
pnpm -C server check      # Biome (Prettier style): 2 spaces, single quotes
```

Relative imports end in `.js` (ESM, NodeNext).
