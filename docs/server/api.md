# Server API

Everything is under `/api` on port 3001. The client reaches it through its own
`/api` proxy on port 3000.

Signed-in requests carry the `better-auth.session_token` cookie (`httpOnly`),
set by sign-up and sign-in. Routes marked **user** need it; **admin** also
needs `role = admin`.

| Method | Path                  | Access | Purpose                             |
| ------ | --------------------- | ------ | ----------------------------------- |
| POST   | `/auth/sign-up/email` | public | Create an account and sign in       |
| POST   | `/auth/sign-in/email` | public | Sign in                             |
| POST   | `/auth/sign-out`      | user   | End the session                     |
| GET    | `/auth/get-session`   | public | Current session and user, or `null` |
| GET    | `/workflows`          | user   | Your workflows                      |
| POST   | `/workflows`          | user   | Start a run in the background       |
| GET    | `/workflows/:id`      | user   | One run with its steps (poll it)    |
| DELETE | `/workflows/:id`      | user   | Delete a finished run               |
| POST   | `/workflows/run`      | user   | Run the three agents and wait       |
| GET    | `/workflows/all`      | admin  | Every workflow with its steps       |
| GET    | `/workflows/events`   | user   | Live status of your runs (SSE)      |

## Auth (Better Auth)

These endpoints are Better Auth's own. POST requests must come from a trusted
origin (`BETTER_AUTH_URL`, the client's origin); the browser sends `Origin`
itself.

### POST /auth/sign-up/email

```json
{ "email": "user@example.com", "password": "at-least-8-chars", "name": "user" }
```

Response `200`: `{ "token": "…", "user": { "id": "1", "email": "…", "name": "…", "role": "user", … } }`
and the session cookie. Errors: `422` "User already exists. Use another email.",
`400` password too short or long.

### POST /auth/sign-in/email

```json
{ "email": "user@example.com", "password": "…" }
```

Response `200`: same shape as sign-up, with the session cookie. Errors: `401`
"Invalid email or password".

### POST /auth/sign-out

Response `200`: `{ "success": true }`; deletes the session and the cookie.

### GET /auth/get-session

Response `200`: `{ "session": { … }, "user": { … } }`, or `null` when signed
out.

Better Auth errors are `{ "message": "…", "code": "…" }`.

## Workflows

### GET /workflows

The signed-in user's runs, newest first.

```json
{
  "workflows": [
    {
      "id": 12,
      "task": "Plan a three-day trip to Lisbon",
      "userId": 3,
      "status": "completed",
      "createdAt": "2026-11-10T10:59:10.346Z",
      "completedAt": "2026-11-10T10:59:18.502Z",
      "stepCount": 3
    }
  ]
}
```

`status` is `queued`, `running`, `completed` or `failed`; `stepCount` is how many agents
have finished (0–3).

### POST /workflows

Request: `{ "task": "…" }` (3–4000 characters). Response `201`:
`{ "workflow": { …same fields…, "status": "queued", "stepCount": 0 } }`. The run
waits in the queue; runs are processed one at a time, oldest first.

### GET /workflows/events

Server-Sent Events for the signed-in user's runs. Each `workflow` event:

```json
{ "workflowId": 12, "status": "running", "stepCount": 1 }
```

Sent when a run is queued, starts, finishes each agent, and ends (`completed`
or `failed`). A `ping` event every 25 s keeps the connection open.

### GET /workflows/:id

```json
{
  "workflow": {
    "id": 12,
    "task": "…",
    "userId": 3,
    "status": "running",
    "createdAt": "…",
    "completedAt": null,
    "steps": [
      {
        "id": 34,
        "workflowId": 12,
        "agent": "Planner",
        "input": "…",
        "output": "…",
        "createdAt": "…"
      }
    ]
  }
}
```

Steps appear as each agent finishes. Owners and admins can read a run; anyone
else gets `404`.

### DELETE /workflows/:id

Response `204`. Owner only; a `queued` or `running` run returns `409`
"Workflow is still running".

### POST /workflows/run

Request: `{ "task": "…" }`. Response `200` after all three agents finish:
`{ "task", "workflowId", "steps": [{ "agent", "input", "output" }] }`.

### GET /workflows/all

Admin only. `{ "workflows": [ { …workflow, "steps": [ … ] } ] }`. Create an
admin with `pnpm -C server db:seed`.

## Errors (non-auth routes)

```json
{
  "error": "Validation failed",
  "details": { "task": ["task must be longer than or equal to 3 characters"] }
}
```

| Status | When                                                |
| ------ | --------------------------------------------------- |
| 400    | Body fails validation, or `:id` is not a number     |
| 401    | "Authentication required" (no or expired session)   |
| 403    | "Insufficient permissions" (not an admin)           |
| 404    | Unknown route, or "Workflow not found"              |
| 409    | "Workflow is still running"                         |
| 500    | "Internal server error" (logged on the server only) |
