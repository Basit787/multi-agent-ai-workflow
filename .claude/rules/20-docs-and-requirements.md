# Feature docs (`claude/<feature>/`) — quote as `D1`

### D1 Lint-clean markdown
`requirement.txt` and `implementation.md`: blank line around every heading,
list, table and fence; a language on every fence; consistent list markers;
aligned table pipes; no trailing spaces; one newline at EOF.

### D2 Docs move with the API — when asked
Only when the user mentions the docs (`W10`): a new or changed API is added to
both docs in the same turn as the code. Deletions are exempt (`W16`).

### D6 Never paste the prompt into a doc
No quoted prompt, curls, payloads, logs or meta-commentary. `## Task` restates
the ask neutrally; what the prompt supplied becomes Scenarios, Requirements or
Decisions.
