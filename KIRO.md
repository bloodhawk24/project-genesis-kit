# KIRO.md — Steering for Implementation Tasks

Steering document for Kiro (the **implementer** role in [`OPERATING-PROCEDURE.md`](OPERATING-PROCEDURE.md)).
Read [`CLAUDE.md`](CLAUDE.md) for project state and [`PLAYBOOK.md`](PLAYBOOK.md) for the invariants you
must uphold. This file governs *how you take a task from brief to merged PR*.

---

## Runtime envelope

The boundary you operate inside. Stay within it; if a task requires stepping outside, surface it first.

- **Inputs:** an intent-only brief (what + why + acceptance criteria) and full codebase access. The brief carries **no file paths** (CC2) — you find the path.
- **Workspace:** a feature branch off `main`. Never commit to `main` directly.
- **Reversible by default.** File edits, tests, local builds: proceed. Hard-to-reverse or shared-system actions (force-push, history rewrite, dropping data, deleting remote branches, prod/infra changes): **ask first.**
- **Subprocess sandbox (TI3).** Never forward the full environment to child processes — allowlist required vars, use a temp cwd, route secrets through a dedicated channel, keep stdout for protocol and logs on stderr.
- **Secrets.** Don't read or echo credential files unless the task requires it; reference by key name, never by value.
- **Stop conditions.** If an approach fails twice, stop patching — diagnose the root cause and change track (P6). If the brief is ambiguous, ask rather than assume.

---

## Task sizing

Right-size before you start; a task that won't fit the size ceiling is two tasks.

- **One task = one coherent change** behind one PR a reviewer can hold in their head.
- **Respect the size ceiling (A5).** If the change would push a file/module past the project's stated cap, split it — propose the split in your plan, don't silently grow a god-object.
- **Multi-item briefs:** implement in the given dependency order (P5: foundation → correctness → tests/observability → perf/structure). Land them as separate commits or PRs, not one mega-diff.
- **If a task can't be sized down** to fit the ceiling and a single review, say so at the plan gate.

---

## Plan first (Gate 1 — CC1)

**Produce an implementation plan and stop. Do not write code until it's greenlit.**

The plan states:
1. **Branch name.**
2. **Approach** — which subsystems you'll touch and how, in intent terms.
3. **Which Playbook invariants apply** to this change (e.g. "adds a second writer to slice X → A1: route through the owner").
4. **Test strategy** — what proves it works, including the regression test (T4).
5. **Open questions** — anything ambiguous in the brief.

---

## Implementation discipline

While coding, uphold the invariants — these are the ones that bite implementers most:

- **A1 single writer:** route all mutations of a shared slice through its one owner; don't add a parallel writer.
- **A2 sync-gating:** gate UI/decisions on synchronously-set in-memory state, never on an awaited re-read.
- **A3 terminal state:** every async/external op ends in explicit success or failure on *every* exit path — including crash, timeout, kill.
- **A4 state machine:** create a successor only via its legitimate trigger; never fabricate records.
- **A6 one source of truth:** write each fact to exactly one store.
- **Match the codebase.** Read neighboring code first; follow existing style, conventions, and libraries instead of introducing new ones.

---

## Tests are mandatory

- Run the **full suite after every change** and report a one-line pass/fail summary.
- Every fix ships a **regression test that fails on the old code and passes on the new** (T4).
- Tests run against the **real schema with all constraints on** (T2).
- Tests use **named fixture constants over ≥3 inputs** and would fail if the implementation were replaced by a constant (T3).
- If no test framework exists, set up the standard one for the stack before claiming done.

---

## Commits & PR

- **Name the bug class** in fix commits: `fix(<class>): <imperative summary>` (P4).
- Stage specific files, not `git add .`. Flag any file that may contain secrets before committing.
- Only commit when asked; prefer new commits over `--amend`.
- Open a PR with: summary of changes, what was tested, anything deferred. Keep the title under 70 chars.

---

## Definition of Done

A task is done only when the [Operating Procedure DoD](OPERATING-PROCEDURE.md#definition-of-done) holds:
acceptance criteria met, tests pass (with regression + real-schema + mutation-resistant coverage), plan
was approved and an independent reviewer approved, fix commits name their class, living docs updated, and
**if a bug class recurred, the invariant is codified now (P1).**
