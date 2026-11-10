---
name: token-budget
description: Long form of rule W11 (how much to read, run and say). Load only when the user asks to keep it cheap, short or "low token" by name — W11 already applies on every ask.
---

# Token budget

Cost here is dominated by **reading** and by **re-reading**. The task is done when
the requested change is made — not when the codebase has been surveyed.

## Locating code

1. `grep -rln "<symbol>" apps/backend/src apps/frontend/src` to find the file.
   The layout is small and fixed: backend routes in `src/app.ts`, middleware in
   `src/middleware.ts`, agents' LLM call in `src/ollama.ts`, tables in
   `src/db/schema.ts` (`B2`); frontend screen in `src/App.tsx` (`F2`).
2. `grep -n` inside that file to find the line.
3. `sed -n 'A,Bp' <file>` to read only that region, padded a little.

Read a whole file only when you actually need the whole file (rewriting it,
or matching its style across the file). Never `cat` a large file
to find one function.

## Cheap by default

- Batch independent commands into ONE call: `cmd1 && echo --- && cmd2`.
- Send independent tool calls in the same message, not one per turn.
- Pipe through `head`/`tail`; cap noisy output (`| head -50`).
- `git diff --stat` before `git diff`.
- Never re-read a file you just wrote — the edit already failed loudly if it
  did not apply.
- Never re-search for something established earlier in this conversation.
- Run the checks once, at the end, not after each edit (`T7`).

## Do not spend tokens on

- Exploring files unrelated to the change.
- Reading tests, docs or config that the change does not touch.
- Subagents or workflows (`W9`) — they re-read everything you already read.
- Requirement/plan/summary files (`W10`).
- Restating the request, narrating what you are about to do, summarising what
  you changed, or pasting back a diff the user can already see (`W12`).
- Re-investigating a reference you were told to copy: read it once, copy it,
  check once. No version comparisons, no doc or git archaeology.

## When to spend

Spend freely on the thing that is actually risky: the exact call site being
changed, auth and role checks (`B4`), route contracts (`W2`), and the evidence
that the change works (`W5`). Cheap is not the same as unverified — if a check
was skipped, say so (`W8`).

## Output shape

Nothing, by default — finish the edit and stop (`W12`). The only things worth
saying: a check that failed (with its output), something asked for that was
skipped, an assumption made to get unblocked, or a blocking question.
