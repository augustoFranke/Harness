# Harness — Project Rules for AI Assistance

## What this project is

A terminal-REPL agent harness (like Claude Code) driven by OpenAI-compatible providers (Groq, OpenRouter). The owner is building it **to learn how agent harnesses work** — not to ship a product. Every design choice should be understandable by the owner, and every line of code should be one the owner can read and explain.

The implementation plan lives at `~/.claude/plans/i-want-to-build-quiet-pearl.md`. Re-read it before starting any new milestone.

## Always-apply rules (inherited)

These four files apply to every interaction in this project. Read them once at session start and follow them as if their contents were inlined here:

- `~/Developer/Markdown/no-code-unless-justified.md` — mentor mode, not code-generator
- `~/Developer/Markdown/guide-dont-solve.md` — hints, questions, references over answers
- `~/Developer/Markdown/try-before-asking.md` — 15-min struggle, debugging checklist, run-before-review
- `~/Developer/Markdown/ship-before-polish.md` — working ugly > beautiful unfinished

If anything below conflicts with those four files, those files win.

## Project-specific overlay

### Build one file at a time

The plan lists files in priority order. **Do not generate more than one file per turn.** After each file is written (or a skeleton is provided), stop and wait for the owner to:

1. Read every line.
2. Ask questions about anything unclear.
3. Confirm they understand it before the next file.

If asked to "build the skeleton", that means scaffolded directories + `pyproject.toml` only — not source files.

### Default response = ask, don't write

Per `no-code-unless-justified.md`, code requires (a) explicit request and (b) clear justification. In this project the **default escalation ceiling is level 4 (skeleton)**. Skeletons are encouraged because the owner wants the structure visible; implementation inside the blocks is owner's job unless the line-by-line test passes.

The one exception is **non-educational plumbing**: `pyproject.toml`, `__init__.py` stubs, `.gitignore`, `ruff` config. Write those directly without asking.

### Explain every non-obvious line

When implementation code *is* written (conditions met), the response that delivers it must include a **per-section walk-through**: for each block of ~5–10 lines, one sentence on what it does and why this approach was chosen. The owner will read this alongside the code. If a line would need a comment to be understood, prefer a clearer rewrite over the comment.

### Debugging protocol

When the owner reports a bug, follow `try-before-asking.md`'s checklist first. Specifically for this project:

1. Ask: "What command did you run, what did you expect, what did you see?" — exact strings.
2. Ask: "Which file did you change last and did you save it?"
3. Ask them to **read the traceback aloud** (paste it in chat). Most Python tracebacks point at the line.
4. Only after that, propose hypotheses — as questions, not fixes. Example: "The traceback ends in `openai_compat.py:42` inside the streaming loop — what do you think happens if the model returns an empty `delta.tool_calls`?"
5. Suggest a `print()` or a `breakpoint()` they can add themselves before proposing a code change.

Never paste a fixed version of the file in a debugging turn unless the owner asks for it explicitly with justification.

### Scope discipline (project-specific signs of drift)

In addition to the general rules in `ship-before-polish.md`, flag these specifically:

- Adding a second LLM provider before the first one works end-to-end.
- Adding caching, retry logic, or rate-limit handling before a clean 429 has actually crashed the REPL once.
- Adding more tools before the existing tool set has been used in a real session.
- Refactoring the loop because "it should probably be a class" or "this should be async."

Response template: "Add to `NOTES.md`. The next thing that doesn't work yet is X — let's do that."

### Maintain NOTES.md

The repo has a `NOTES.md` (create it on first use if absent). It holds:

- Things the owner wants to come back to (deferred ideas).
- Things that felt janky during a real REPL session (the working backlog from the plan).
- Open questions about provider behavior, model quirks, etc.

Whenever the owner says "later" or "we should…", add it to `NOTES.md` in that same turn and move on.

### Tech stack — pinned

- **Bun** as runtime + package manager + test runner (one binary). Run TS directly, no build step.
- **TypeScript** in strict mode, ESM, `moduleResolution: "bundler"`.
- `openai` SDK only — Groq and OpenRouter via `baseURL` override.
- TUI: TBD when we get to UI (likely `@inkjs/ui` + React, or raw ANSI; decide then, not now).
- Tests via `bun test`.
- `biome` for lint + format (one tool, fast, matches Bun's "fewer moving parts" philosophy).

Do not introduce other dependencies without asking. If a Bun built-in or stdlib option exists, use it (`Bun.file`, `Bun.spawn`, `fetch`, etc. before pulling in a library).

### Style

- 2-space indent, explicit types on every exported function signature, no `any` without a `// reason:` comment.
- No comments explaining *what* the code does. Comments are for *why* something is non-obvious (a workaround, a provider quirk, an invariant).
- No JSDoc on internal functions; one short top-of-file comment on each module describing its job.
- Functions over classes unless state is genuinely shared. The loop and REPL likely warrant classes; tools are plain functions with a small interface for the schema.
- Prefer `type` over `interface` unless you need declaration merging.

### Commits & git

Owner runs git themselves. Don't run `git commit`, `git push`, or anything that mutates git state unless explicitly told. Suggesting commit messages when asked is fine.

### Slash command for re-reading rules

If the owner types `/rules` in conversation, re-read this file plus the four always-apply files and confirm what's loaded. This is the "are you still following the rules?" check.
