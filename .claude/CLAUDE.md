# multi-agent-ai-workflow

Users sign up, submit a task, and a Planner → Researcher → Writer agent
pipeline on Ollama answers it; every step is stored in Postgres. Turborepo +
pnpm workspace; everything runs in Docker with `docker compose up --build`.

- `apps/backend/` — Hono 4 on `@hono/node-server` (ESM) + Drizzle ORM on
  Postgres + JWT (jose) + zod. Rules `B#` in `rules/10-backend-conventions.md`.
- `apps/frontend/` — Vite 6 + React 19 + Tailwind v4 + react-hook-form/zod.
  Rules `F#` in `rules/30-frontend-conventions.md`.
- Turborepo, pnpm, Docker, ports, checks: `T#` in `rules/40-tooling.md`.
- How to work: `W#` in `rules/00-working-agreement.md`. Feature docs: `D#`.

## Commands (repo root)

- `pnpm dev` (frontend <http://localhost:3000>, backend <http://localhost:3001/api>),
  `pnpm build`, `pnpm typecheck`.
- DB: `pnpm db:up`, `pnpm db:generate`, `pnpm db:migrate`, `pnpm db:seed`,
  `pnpm db:reset`, `pnpm db:studio`.
- One app: `pnpm --filter backend <script>` / `pnpm --filter frontend <script>`.
- Checks: `T7`. No tests exist.

## Data model

`users` 1—n `workflows` (task, user_id) 1—n `workflow_steps` (agent, input,
output). Schema `apps/backend/src/db/schema.ts`; migrations in
`apps/backend/drizzle/`, applied on backend start.

## API (all under `/api`, Bearer token unless marked public)

`POST auth/register` (public), `POST auth/login` (public), `GET auth/me`,
`POST workflow/run` (runs the three agents, returns `{ task, workflowId, steps }`),
`GET admin/workflows` (role `admin`).

## Skills and agents

- `add-rule` — any durable "always/never/from now on/remember" from the user.
- `feature-requirement` — only when the user asks for a requirement or plan.
- `strict-execution`, `token-budget` — only when asked by name.
- Agents `debug`, `review` — only when the user names them (`W9`).
