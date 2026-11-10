---
name: feature-requirement
description: Run this repo's plan-to-code sequence for a piece of work — new claude/<feature>/ folder, then requirement.txt, then (after approval) implementation.md, then code only on an explicit go-ahead. Use whenever the user shares a plan, describes a new feature or a piece of work to scope, asks to write down the requirements they just gave, or asks for an implementation plan before coding.
---

# Feature requirement doc

One folder per feature under `claude/<feature>/`, two files, **in this order**:

    claude/<feature>/requirement.txt     the ask, restated (`D6`)       (FIRST)
    claude/<feature>/implementation.md   analysis + plan  (only AFTER the
                                         requirement is approved)

Read `.claude/rules/00-working-agreement.md` (`W1`) and
`.claude/rules/20-docs-and-requirements.md` (`D1`, `D2`, `D6`) first — they
define the sequence and
the format, and this skill just executes them.

Not for deletions: "remove this file / route" is `W16` — delete it, fix the
imports, type-check, stop. Do not open this skill for that.

**The gates are the point.** Write `requirement.txt`, then STOP and hand it over.
Write `implementation.md` only once the requirement is approved, then STOP again.
Write code only on an explicit go-ahead. Never produce two of these in one turn,
and never start coding in the turn that produced a doc.

## Steps

1. **Find the folder.** Check `claude/` for an existing folder for this feature
   before creating one (`ls claude/`). Update the existing file rather than
   starting a parallel one. Match the neighbours' naming.

2. **House voice**: if a sibling `claude/*/requirement.txt` exists, read it and
   match it. Markdown inside a `.txt`, written from the requester's side.

3. **Write `requirement.txt`** in this order, dropping sections that do not
   apply:

   ```
   # <Feature> — <what this doc is>

   ## Task            the ask restated in neutral wording (never the prompt itself)
   ## Objective       what the result must do
   ## <Scenario>      one heading per case, with the expected behaviour
   ## Requirements    numbered R1..Rn, one checkable statement each
   ## Constraints / Non-goals
   ## Before Development   what must be understood first (new work)
   ## Implementation Plan  what the plan must cover (new work)
   ## Decisions       each question asked, the answer, options rejected
   ## Verification    how each requirement was or will be proven
   ```

   - Never paste the user's message into `## Task` — no verbatim quoting, no
     pasted curls, payloads or logs, no meta-commentary about what they said
     (`D6`). Restate the ask in your own neutral wording: what is being built
     and which cases it covers. Do not turn `## Task` into the spec either —
     the spec is the Requirements section.
   - Every requirement is one yes/no statement. If a requirement needs a
     paragraph, it is two requirements.
   - New build work keeps "Do not start coding until the plan is reviewed and
     approved" at the end of the plan section.

4. **Stop.** Hand `requirement.txt` over for review. Say plainly that
   `implementation.md` comes next, after they approve it.

5. **`implementation.md` — only after the requirement is approved.** Current
   implementation and data flow, models/services/jobs involved, the design,
   files to change, edge cases, risks, and how each requirement will be
   verified. Head it with its status line (`W10`). Then stop again.

6. **Code only on an explicit go-ahead.** "Looks good" on a plan is approval of
   the plan, not permission to implement — wait to be told. Two exceptions: the
   user says up front to implement directly, and a curl or raw payload added to
   a feature that already has a folder — that is itself the go-ahead, so the
   docs and the code land in the same turn.

7. **Name the path in one line**, plus the parts most likely to be wrong
   (assumed requirements, decisions recorded on their behalf, non-goals). No
   section-by-section summary — the doc is right there (`W12`).
