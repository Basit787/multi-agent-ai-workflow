# Turborepo, Docker and tooling — quote as `T2`

### T1 One pnpm workspace, run from the root

Root `package.json` (turbo + proxy scripts), `pnpm-workspace.yaml` (`apps/*`),
one `pnpm-lock.yaml`, `turbo.json` (`build`, `typecheck`, `dev`). Add a
dependency with `pnpm --filter <backend|frontend> add <pkg>`; never npm or yarn,
never a second lockfile.

### T2 One root Dockerfile

Targets `backend` (`node dist/index.js`) and `frontend` (`pnpm preview`, proxies
`/api` to `http://backend:3001`). `docker-compose.yml` builds each with
`context: .` + `target`. No nginx.

### T3 Ports

Frontend 3000, backend 3001, Postgres 5434 (host). Ollama runs on the host
(`host.docker.internal:11434`).

### T4 New Turbo tasks

A script both apps share goes in `turbo.json` `tasks` and a root
`turbo run <task>` script; an app-only script stays in that app's
`package.json`.

### T5 pnpm build approvals

A dependency with install scripts must be listed under `allowBuilds` in
`pnpm-workspace.yaml`, or `pnpm install` fails — in Docker too.

### T6 No linter or formatter configured

Match the file's style (double quotes, semicolons, 2 spaces). Do not add
ESLint, Prettier or Biome unless asked.

### T7 Checks before done

Root: `pnpm typecheck && pnpm build`. After a Dockerfile/compose change also
`docker compose build`.

### T8 Hands off env files and user data

Never read or edit `.env*` — tell the user what to change. Test backend
behaviour against a throwaway Postgres container, never the `pg_data` volume.
