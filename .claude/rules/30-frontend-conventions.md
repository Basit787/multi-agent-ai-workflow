# Frontend conventions (`apps/frontend/`, React) — quote as `F2`

### F1 Stack

Vite 6, React 19, Tailwind v4 (`@tailwindcss/vite`), react-hook-form +
`zodResolver`, zod 3. No router, state, fetch or UI library unless asked.

### F2 Layout

`index.html`, `src/main.tsx`, `src/App.tsx` (auth form + task screen),
`src/index.css` (theme tokens), `src/lib/utils.ts` (`cn`). Import with `@/`
(→ `src/`). New components go in `src/components/` only when asked.

### F3 Calls to the backend

Relative `fetch("/api/...")` only; Vite proxies `/api` to `BACKEND_URL`
(default `http://localhost:3001`) in both `dev` and `preview`. Never hard-code
a backend host. The token lives in `localStorage` under `workflow_token` and is
sent as `Authorization: Bearer`; the backend decides access (`B4`).

### F4 Mirror the server reply

Types such as `Step` match what `apps/backend/src/app.ts` returns — never add a
field the server does not send. A changed endpoint updates `App.tsx` in the same
change (`W2`).

### F5 Forms

`useForm` + `zodResolver`; user-facing messages live in the zod schema; show the
server's `error` string as-is.

### F6 Colours only via tokens

Use the `@theme` tokens in `src/index.css` (`bg-background`, `bg-card`,
`text-primary`, `text-muted-foreground`, `border-border`, `text-destructive`…).
No hex, `slate-*`/`teal-*` palette classes or inline styles.
