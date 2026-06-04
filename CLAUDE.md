<!--
  TEMPLATE — CLAUDE.md (cold-start doc for AI agents)
  ───────────────────────────────────────────────────
  This is the FIRST file any agent reads. Replace every <PLACEHOLDER> and delete the
  HTML guidance comments as you fill it in. Keep it CURRENT-STATE ONLY.

  HARD RULE (TI2): keep this file under ~120 lines. History does NOT live here — it lives
  in progress.md / a timeline doc. When a milestone completes, collapse it into the
  "Completed" summary line. The cap is the guardrail; if you're over, you're doing it wrong.
-->

# <PROJECT NAME> — Agent Session Guide

Cold-start document for every agent session. Read this fully, then follow "How to Continue" before doing any work.

> **Size discipline (TI2):** keep this file under ~120 lines. Current-state only — history lives in `progress.md`.

---

## What This Project Is

<!-- 2–4 sentences. Stack, purpose, and the ONE interaction model that matters most.
     Name the single source of truth for data (A6). -->
<One paragraph: what it does, the tech stack, and how an agent interacts with it.>

---

## Current Status

<!-- The only section that changes most sessions. Keep the table tight. -->

| What | Detail |
|------|--------|
| Completed | <phases/milestones done — collapse old ones into one line> |
| Tests | <count + command + pass/fail + coverage> |
| Last milestone | <what just shipped> |
| Known issues | <pointer to known-issues.md; only call out the live ones> |
| Next up | <the immediate next task, or "Open — awaiting direction"> |

---

## Key Architecture

<!-- A map, not a manual. One row per layer/subsystem with its entry point and one-line note.
     This is where an agent learns WHERE things live so briefs don't need file paths (CC2). -->

| Layer | Entry point | Notes |
|-------|-------------|-------|
| <e.g. Backend> | `<path>` | <one line> |
| <e.g. Frontend> | `<path>` | <one line> |
| <e.g. Data store> | `<path>` | single source of truth (A6); single writer (A1) |
| <e.g. Migrations> | `<path>` | append-only, replay-tested (T1) |

<!-- If the project has long-lived processes, link the state-machine diagram here (A4). -->

---

## How to Continue Work in a New Session

<!-- The exact reading order for a cold start. Link the living docs (TI1). -->

1. Read this file fully.
2. Check `<progress.md>` — what's done, what's next.
3. Skim `<known-issues.md>` — don't re-discover known bugs.
4. Read `<decisions-log.md>` — don't re-decide settled questions.
5. Read `<architecture.md>` / domain docs before touching that subsystem.

---

## Conventions

<!-- The short, enforced rule set. If you can't gate it, don't list it (P3). Link PLAYBOOK.md
     for the full set; surface only the project-specific bindings here. -->

- **Single writer per state slice (A1).** <name the owning module for each shared slice.>
- **Gate UI/decisions on synchronous events, not async re-reads (A2).** <lint rule name, if any.>
- **Every async/external op reaches a terminal state (A3).** <watchdog/deadline, if any.>
- **Size ceiling (A5):** <max lines per file/component before it must split.>
- **Tests:** run the full suite after every change → `<command>`. Every fix ships a regression test (T4).
- **Commits:** name the bug class → `fix(<class>): …` (P4). <link commit convention.>
- **Subprocess sandbox (TI3):** <env-allowlist fn / tmpdir cwd / secrets channel — if applicable.>

---

## Session Learnings

<!-- Non-obvious gotchas ONLY. Remove each when it stops being relevant. Not a changelog. -->

- <gotcha that would otherwise burn a future session an hour.>

---

## Post-Commit Rule (TI1)

After every commit, ensure a fresh session could pick up cold:
- Update `progress.md` (tick items, add new scope).
- Update this file if status, test count, or "Next up" changed.
- Prune: fold any completed milestone older than one session into the "Completed" line.
- If a bug class recurred, codify the invariant now (P1) and promote it if warranted (P2).
