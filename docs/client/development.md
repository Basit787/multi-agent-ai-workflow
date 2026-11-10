# Client development

## Run it

```bash
pnpm -C client install
pnpm -C client dev        # http://localhost:3000, HMR
```

Start the server too (see [server development](../server/development.md)).
Vite proxies `/api` to `SERVER_URL` (default `http://localhost:3001`) in both
`dev` and `preview`.

## Adding things

- **A route**: a file or folder under `src/routes/`. Put its API calls in
  `_lib/api/api.ts` (through `http` or `authClient`, inside try/catch that
  rethrows `toApiError(error)`), its TanStack hooks in `_lib/api/hook.ts`, its
  components in `_lib/components/`, its types in `_lib/types.ts` and parsers
  in `_lib/parser.ts`.
- **A mutation**: toast from the hook with `useToast()`
  (`showSuccessToast` / `showErrorToast`) and invalidate the affected query
  keys with the shared `queryClient` from `#/lib/query-client`.
- **A shadcn component**: `pnpm dlx shadcn@latest add <name>`; use shadcn
  components rather than native `button`, `input`, `table`, etc.
- **Colours**: only the theme tokens in `src/styles.css`.

## Checks and style

```bash
pnpm -C client typecheck && pnpm -C client build
pnpm -C client check      # Biome (Prettier style): 2 spaces, double quotes
```

Import from `src/` with `#/`.
