# Client architecture

TanStack Start (React 19) with file-based routes, TanStack Query for server
state, TanStack Form for forms, TanStack Table for the list, shadcn/ui on
Tailwind v4, React Flow for the agent pipeline. Served on port 3000; `/api` is
proxied to the server.

## Layout

```text
client/src/
├── routes/
│   ├── __root.tsx                  html shell, theme script, toasts, tooltips
│   ├── index.tsx                   "/" sign in / register
│   ├── _lib/                       for "/" and the session
│   │   ├── api/api.ts              Better Auth calls (try/catch → ApiError)
│   │   ├── api/hook.ts             useSession, useAuthenticate, useLogout, …
│   │   ├── components/             sign-in screen
│   │   ├── parser.ts, types.ts
│   └── workflows/
│       ├── route.tsx               layout: signed-in only, AppShell
│       ├── index.tsx               "/workflows" table
│       ├── $workflowId.tsx         "/workflows/:id" live run
│       └── _lib/
│           ├── api/api.ts          HttpClient calls (try/catch → ApiError)
│           ├── api/hook.ts         useWorkflows, useWorkflow, useCreateWorkflow, …
│           ├── components/list/    table, create dialog, delete confirm
│           ├── components/detail/  pipeline card, React Flow, results dialog
│           ├── agents.ts, parser.ts, types.ts, workflow-pdf.ts
├── components/
│   ├── common/                     AppCard, AppAlert, ConfirmDialog, EmptyState,
│   │                               IconTile, PageHeader, DownloadMenu
│   ├── data-table/                 config-driven TanStack Table
│   ├── layout/                     AppShell, header, theme toggle
│   ├── markdown.tsx                react-markdown with shadcn tables
│   └── ui/                         shadcn components (generated)
├── hooks/                          useToast, useCopy
└── lib/
    ├── axios.ts                    HttpClient (interceptors, get/post/put/patch/delete)
    ├── auth-client.ts              Better Auth client
    ├── query-client.ts             the one TanStack Query cache
    ├── parser.ts                   toApiError
    └── format.ts, download.ts, utils.ts
```

Folders named `_lib` are ignored by the router (`routeFileIgnorePattern` in
`vite.config.ts`): they hold a route's API, hooks and components.

## Data flow

- **Auth**: `authClient` (Better Auth) signs up, signs in, signs out and reads
  the session. The session is an `httpOnly` cookie; no script ever sees it.
  `useSession()` is a TanStack query on `getSession()` under the key `["me"]`.
- **API**: `http` (`HttpClient` over axios) calls `/api/*` with the cookie.
  Its response interceptor treats a `401` as an ended session: the user is
  marked signed out, a toast says so, and the layout sends them to `/`.
- **Queries**: `["workflows"]` is the list, `["workflows", id]` one run. No
  polling: `useWorkflowEvents` (in the `/workflows` layout) opens one
  `EventSource` on `/api/workflows/events`, refetches `["workflows"]` on each
  event and toasts "Workflow generated" / "Workflow failed" with a View link.
  Mutations invalidate `["workflows"]` and show a success or error toast.
- **Routes** run in the browser only (`ssr: false`), because they need the
  session cookie.

## UI building blocks

- **DataTable** takes arrays of objects: `columns`, `rowActions`,
  `bulkActions`, `toolbarActions`. Each action has a Lucide icon, `tooltip`
  and `disabled` (fixed or computed from the rows). Search, sorting, row
  selection and pagination (rows per page, first/prev/next/last) are built in.
- **Run page**: three fixed React Flow cards (Planner → Researcher → Writer)
  showing Waiting / Working / Done / Failed; the card header has Download (PDF
  or JSON) and View results, or Run again when failed.
- **Results dialog**: one stage per agent, fixed height, scrolls, Markdown.
- **Theme**: shadcn tokens in `src/styles.css` (light and dark, plus
  `success`); the toggle stores the choice in `localStorage`.
