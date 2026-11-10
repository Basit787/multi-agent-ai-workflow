# Backend conventions (`apps/backend/`, Hono) — quote as `B2`

### B1 ESM Node

`"type": "module"`, `NodeNext`: every relative import ends in `.js`. Entry
`src/index.ts` runs Drizzle migrations, then serves `app` on `PORT` (3001).
`tsc` builds to `dist/`.

### B2 File layout

`src/app.ts` (Hono app, `basePath("/api")`, every route), `src/middleware.ts`
(validation, auth, roles, error handler), `src/auth.ts` (hash, JWT),
`src/ollama.ts` (LLM call), `src/db/` (`index.ts` client, `schema.ts`,
`seed.ts`, `reset.ts`). No barrels, no repository layer, no second `db` client.

### B3 Validation is zod through `validateJson`

Every JSON body: a zod schema at the top of `app.ts` + `validateJson(schema)`
on the route, then `c.get("validatedBody") as z.infer<typeof schema>`. No
hand-written `typeof` checks.

### B4 Every non-auth route is authenticated

Add `authenticate` to every route except register/login; read the user with
`c.get("user")`, never from the body. Admin routes add `requireRole("admin")`
after `authenticate`. Tokens carry `sub`, `email`, `role` (HS256, 7d).

### B5 Errors

Reply `c.json({ error: "<user-readable>" }, status)` or throw `HTTPException`;
`onError` turns both into `{ error, details? }`. Never return `password` or
tokens other than from register/login.

### B6 Schema and migrations

Edit `src/db/schema.ts` (camelCase keys, snake_case column names, `serial` ids,
`createdAt` timestamp), run `pnpm db:generate`, keep the generated files in
`drizzle/`. Migrations apply on start. Never `drizzle-kit push`.

### B7 Agents

Each agent is one `ollamaChat(prompt)` call in `POST /workflow/run`, followed by
an insert into `workflow_steps` (`agent`, `input`, `output`). A new agent copies
that pair. `ollamaChat` returns a `[Simulated]` reply when Ollama is down —
keep that fallback.

### B8 Env

Read only `DATABASE_URL` (`db/index.ts`), `JWT_SECRET` (`auth.ts`),
`OLLAMA_URL`/`OLLAMA_MODEL` (`ollama.ts`), `PORT` (`index.ts`). A new variable
goes into `docker-compose.yml` and the user is told to add it to `.env` (`T8`).
