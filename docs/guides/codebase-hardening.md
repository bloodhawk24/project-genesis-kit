# Codebase Hardening

A framework for taking a working-but-rough codebase to production-grade, run as a sequence of
audits. The order is not arbitrary — it's the dependency order from **P5**: you cannot trust
performance numbers or a refactor before correctness and tests exist to back them.

> **The ordering rule:** Foundation → Security/Correctness → Testing/Observability →
> Performance/Structure/Ops. Each sprint depends on the one before it. Optimizing before
> correctness, or refactoring before tests exist, just moves bugs around faster.

Run it as one audit numbered end-to-end (e.g. `AP-01 … AP-NN`) so nothing is lost, items keep their
dependency order, and progress is measurable. A ~100-item audit across four sprints is a realistic
shape.

---

## Sprint 1 — Foundation / Tooling

**Goal:** a baseline every later sprint stands on. Nothing here changes behavior; it makes change *safe and consistent*.

- Central config and constants modules — no magic values scattered across files.
- Structured logging to **stderr** (stdout reserved for protocol/data) (TI3).
- Lint + formatter + pre-commit hooks; a CI pipeline (lint → test → build) on every PR.
- Dependency hygiene: pinned versions, zero known vulnerabilities.
- The living-docs scaffold (TI1): cold-start doc, decisions log, known-issues.

**Exit criteria:** CI is green and gates merges; one command builds; lint/format are automated.

## Sprint 2 — Security / Correctness

**Goal:** the system does the right thing and leaks nothing. Highest-value sprint — do not skip ahead.

- **Subprocess sandboxing (TI3):** env allowlist, tmpdir cwd, tool restrictions, secrets via a dedicated channel.
- Input validation at every boundary (schema-validate requests); parameterized queries only.
- **Terminal state on every exit path (A3)** for all async/external operations.
- **Single writer per state slice (A1)** and **one source of truth per fact (A6)** enforced.
- AuthN/AuthZ on every network-exposed endpoint — flag anything unauthenticated.
- Real schema with constraints on; **append-only migrations behind a replay test (T1)**.

**Exit criteria:** no secret/path leaks into child processes; no orphaned "running" states; every endpoint has access control; constraints enforced in tests (T2).

## Sprint 3 — Testing / Observability

**Goal:** prove correctness and make the running system legible. Only meaningful *after* Sprint 2 — there's no point testing logic that's still wrong.

- Coverage across the **P/N/E/C** taxonomy (see [`deterministic-testing.md`](deterministic-testing.md)); mutation-resistant tests (T3).
- A regression test for every previously-fixed bug (T4).
- Deterministic test harness — fakes/sandboxes for external deps, no sleeps, seeded randomness.
- Metrics + request/error middleware; health checks; meaningful structured logs.

**Exit criteria:** suite is deterministic and green; coverage is real (not constant-passing); you can see what the system is doing in production from logs/metrics alone.

## Sprint 4 — Performance / Structure / Ops

**Goal:** make it fast, maintainable, and operable. Last on purpose — you now have tests to catch the regressions a refactor introduces and metrics to prove a perf change helped.

- Profile against real workloads; optimize the measured hot path, not the guessed one.
- **Enforce the size ceiling (A5):** split god-objects that crossed the cap into focused modules.
- Extract data-access / tool registries / sub-components; reduce coupling.
- Operational concerns: rate limiting, graceful shutdown, recovery on startup, backpressure.

**Exit criteria:** perf changes are backed by before/after numbers; no file exceeds the size ceiling; the system degrades and recovers gracefully.

---

## Running the audit

1. **Inventory** every item across the four sprints, numbered in dependency order (`AP-01…`).
2. **Don't reorder across sprint boundaries** — finishing Sprint 2 before Sprint 3 is the whole point.
3. **Each item lands as its own reviewed change** (Operating Procedure), with a regression test if it fixes a class (T4).
4. **Tag fix commits with their class (P4)** so the dominant problem stays measurable during the audit, not just after.
5. **If one subsystem dominates the fix items (P7),** stop and name the missing invariant — that's a design hole, not bad luck.
