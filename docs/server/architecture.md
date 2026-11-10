# Server architecture

NestJS 12 (ESM) on Express, Drizzle ORM on PostgreSQL, Better Auth for
accounts and sessions, class-validator for request bodies. Everything is
served under `/api` on port 3001.

## Layout

```text
server/
├── src/
│   ├── main.ts                     bootstrap(): helmet, Better Auth handler,
│   │                               JSON parser, validation pipe, error filter
│   ├── app.module.ts               DbModule + WorkflowModule
│   ├── auth/
│   │   ├── auth.guard.ts           AuthGuard (session) + RolesGuard/@Roles
│   │   ├── utils/auth.ts           the Better Auth instance
│   │   ├── parser/auth.parser.ts   session user → AuthUser
│   │   └── types/auth.types.ts     Role, AuthUser, AuthRequest
│   ├── workflow/
│   │   ├── workflow.module.ts
│   │   ├── workflow.controller.ts  /workflows: list, start, run, all (admin), get, delete
│   │   ├── workflow.service.ts     agent pipeline + all workflow queries
│   │   ├── dto/task.dto.ts         { task } validation
│   │   ├── types/workflow.types.ts
│   │   └── utils/ollama.ts         one LLM call (with [Simulated] fallback)
│   └── common/                     validation pipe, exception filter
└── libs/db/src/                    the @app/db library
    ├── db.module.ts                global; runs migrations on start
    ├── db.service.ts            DbService: shared DB operations
    ├── db.client.ts                drizzle client (DATABASE_URL)
    ├── schema.ts, types.ts
    ├── migrate.ts, reset.ts
    ├── seed.ts                     create or reset the admin user
    └── drizzle/                    SQL migrations
```

## Request flow

1. `/api/auth/*` goes straight to Better Auth (`toNodeHandler`), mounted before
   the JSON body parser because Better Auth reads the raw body.
2. Every other route is a Nest controller. `AuthGuard` asks Better Auth for the
   session behind the request's cookie and sets `req.user` (`id`, `email`,
   `role`). `RolesGuard` with `@Roles(['admin'])` restricts admin routes.
3. `@Body()` DTOs are validated by the global `ValidationPipe`
   (class-validator): unknown fields are stripped, failures return
   `{ error: "Validation failed", details: { field: [messages] } }`.
4. `HttpExceptionFilter` turns every error into `{ error, details? }`.

## Auth (Better Auth)

Configured in `src/auth/utils/auth.ts`:

- Email and password, 8–128 characters, hashed with **bcrypt** (so passwords
  from before Better Auth still verify).
- Sessions live in the `sessions` table; the browser holds an `httpOnly`
  `better-auth.session_token` cookie. A session lasts 7 days and is extended
  once a day while used. Sign-out deletes it.
- `role` (`user` | `admin`) is an extra user field that sign-up cannot set.
- Serial integer ids, matching the rest of the schema.
- `BETTER_AUTH_URL` is the public origin (the client, which proxies `/api`);
  requests from other origins are rejected. `COOKIE_SECURE=true` behind HTTPS.

## Database (`@app/db`)

`libs/db` is a NestJS library (monorepo mode in `nest-cli.json`, project `db`,
builder `tsc`): imported as `@app/db` through `tsconfig.json` paths, built with
`nest build db` on its own or together with the app by `nest build`.

`DbModule` is imported once in `AppModule`. It runs the migrations in
`libs/db/src/drizzle/` when the app starts and provides `DbService`
everywhere. Services inject `DbService` and use:

| Method                               | For                                           |
| ------------------------------------ | --------------------------------------------- |
| `findById(table, id)`                | one row by id                                 |
| `insert(table, values)`              | insert and return the row                     |
| `update(table, id, values)`          | update one row                                |
| `updateWhere(table, where, values)`  | update many rows                              |
| `delete(table, id)`                  | delete one row                                |
| `query.<table>.findFirst / findMany` | relational reads (`with`, `orderBy`, `where`) |

### Data model

```text
users 1 ── n workflows 1 ── n workflow_steps
users 1 ── n sessions
users 1 ── n accounts
```

| Table            | Columns                                                                                     |
| ---------------- | ------------------------------------------------------------------------------------------- |
| `users`          | `id`, `name`, `email` (unique), `email_verified`, `image`, `role`, timestamps               |
| `sessions`       | `id`, `user_id`, `token` (unique), `expires_at`, `ip_address`, `user_agent`, timestamps     |
| `accounts`       | `id`, `user_id`, `account_id`, `provider_id`, `password` (bcrypt), OAuth fields, timestamps |
| `verifications`  | `id`, `identifier`, `value`, `expires_at`, timestamps                                       |
| `workflows`      | `id`, `task`, `user_id`, `status`, `completed_at`, `created_at`                             |
| `workflow_steps` | `id`, `workflow_id`, `agent`, `input`, `output`, `created_at`                               |

`users`, `sessions`, `accounts` and `verifications` belong to Better Auth.
Deleting a workflow cascades to its steps.

## Agent pipeline (BullMQ queue)

`POST /api/workflows` (`workflow.service.ts`):

1. Insert a `workflows` row with `status = queued` and add a job to the
   `workflows` BullMQ queue (Redis, `REDIS_URL`; job id `workflow-<id>`).
2. `WorkflowProcessor` (concurrency 1) takes jobs one at a time: the row
   becomes `running`, then **Planner** → **Researcher** → **Writer**, each one
   `ollamaChat(prompt)` call and one `workflow_steps` insert.
3. The row becomes `completed`, or `failed` if anything throws.

Every change is emitted by `WorkflowEvents` and streamed to the owner over
`GET /api/workflows/events` (SSE), so the client never polls.

On start, runs left `running` by a restart are marked `failed` and `queued`
runs are added to the queue again. `POST /api/workflows/run` queues the same
way and waits for the run to finish.
