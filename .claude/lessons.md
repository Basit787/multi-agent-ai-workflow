# Lessons — how to get a fast answer out of Claude here

The biggest cost is searching for the file. Name it and the change takes
seconds.

## Where things live

| You want to change…                  | Say…                                                         |
| ------------------------------------ | ------------------------------------------------------------ |
| an endpoint or its input schema      | `apps/backend/src/app.ts`                                    |
| an agent's prompt or the agent chain | `POST /workflow/run` in `apps/backend/src/app.ts`            |
| the Ollama call, model, fallback     | `apps/backend/src/ollama.ts`                                 |
| auth, roles, validation, errors      | `apps/backend/src/middleware.ts`, `apps/backend/src/auth.ts` |
| the database shape                   | `apps/backend/src/db/schema.ts` (then `pnpm db:generate`)    |
| the UI, forms, step cards            | `apps/frontend/src/App.tsx`                                  |
| colours, theme                       | `apps/frontend/src/index.css`                                |
| the `/api` proxy, ports              | `apps/frontend/vite.config.ts`, `docker-compose.yml`         |
| Turbo tasks, workspace               | `turbo.json`, `pnpm-workspace.yaml`, root `package.json`     |

## Phrasing that works

| Instead of               | Say                                                                            |
| ------------------------ | ------------------------------------------------------------------------------ |
| "add a reviewer agent"   | "add a Reviewer step after Writer in `/workflow/run` and show it in `App.tsx`" |
| "the workflow is broken" | "debug: Run on the task screen returns `<error>`" + the log                    |
| "make it look better"    | "in `App.tsx`, give step cards more spacing"                                   |

## Things that cost a full round-trip

- Asking for "everything" without a file — Claude has to map the repo first.
- Changing the schema without saying a migration is fine — it will ask.
- Editing `.env` — Claude cannot read or edit it; change it yourself.
