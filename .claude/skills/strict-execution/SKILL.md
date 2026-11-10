---
name: strict-execution
description: Long form of rules W1/W11/W12 (scope and terse output). Load only when the user asks for strict or minimal execution by name — the rules already apply on every ask.
---

# Strict Execution

## Core Behavior

- Do exactly what the user asks. Nothing extra.
- For simple and unambiguous requests, execute immediately.
- Do not overthink simple changes.
- Do not perform broad exploration when the target file/location is already known.
- Use the minimum number of tool calls necessary.
- Do not reread files unnecessarily.
- Do not search the project unnecessarily.
- Do not inspect unrelated files.
- Do not refactor.
- Do not improve or optimize anything unless explicitly requested.
- Do not add tests, documentation, comments, dependencies, or features unless requested.
- Make the smallest possible change.

## Simple File Changes

When the user specifies:
- the file
- what to remove/change
- and the requested change is unambiguous

then:

1. Open/read only the relevant part of the file if needed.
2. Make the requested edit immediately.
3. Do not investigate unrelated code.
4. Do not run unnecessary tests or builds.
5. Stop. Say nothing — the diff is the report (`W12`).

Example:

User: "Remove X and Y from `src/config.js`."

Expected behavior:
- Read `src/config.js` only as necessary.
- Remove X and Y.
- Save the file.
- Stop, silently.

Do NOT:
- scan the entire repository
- inspect unrelated files
- refactor surrounding code
- run the entire test suite
- explain the change at all
- summarise or recap what was changed
- suggest additional improvements or next steps

## Ambiguity

- If the request is clear, do not ask for confirmation.
- If a required detail is genuinely missing, ask one concise question.
- Never invent missing information.
- Do not ask unnecessary questions.

## Accuracy

- Never hallucinate.
- Never claim an action was completed unless it actually was.
- Never claim something was tested unless it was actually tested.
- If an operation fails, report the actual failure.
- Do not guess the cause of an error.

## Token Efficiency

- Keep reasoning and tool usage proportional to task complexity.
- Simple task = minimal inspection + immediate execution.
- Complex task = inspect only what is necessary.
- Avoid repeating information already known.
- "Make it exactly like X" = copy X: one cleaned read of the
  reference, verbatim copy into the target, data slots mapped to existing
  fields, one type-check. Never re-derive what the reference already decides.
- Default final response: nothing. Speak only for a failed check, something
  skipped, an assumption, or a blocking question (`W8`, `W12`).

## Completion

Once the exact requested task is complete, STOP.

Do not perform additional work.
Do not proactively improve the code.
Do not provide unsolicited suggestions.
Do not write a summary of what you just did.
