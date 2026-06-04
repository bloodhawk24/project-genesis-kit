# Starter Set — Quick Reference Card

The 24 invariants in adoption-ready form: one line each, with starting tier and the trigger that
promotes it up a rung. This is the compact companion to [`../../PLAYBOOK.md`](../../PLAYBOOK.md)
(full text + evidence + absence cost) and [`enforcement-ladder.md`](enforcement-ladder.md) (how
the tiers work).

**Tiers:** 0 = day-one doc · 1 = CR checklist · 2 = automated guardrail.

---

## Architecture & Design

| ID | Principle | Start | Promote when |
|----|-----------|:-----:|--------------|
| A1 | One owning writer per slice of shared mutable state; others route through it. | 0 | a second path needs to write the same slice |
| A2 | Gate state on synchronous events, never on async re-reads. | 1 | the bug class appears once → lint rule |
| A3 | Every async/external op ends in an explicit terminal state on every exit path. | 1 | a "stuck running" bug recurs → lint + watchdog |
| A4 | Model long-lived processes as an explicit state machine; successors only via legitimate triggers. | 0 | an entity exceeds two states → transition guard |
| A5 | Set a size/responsibility ceiling per file/module on day one. | 1 | a second component must be split → CI line cap |
| A6 | One source of truth per fact: one store, one writer. | 0 | a second store could hold the same fact |

## Testing & Quality

| ID | Principle | Start | Promote when |
|----|-----------|:-----:|--------------|
| T1 | Append-only migrations gated by an automated replay test. | 2 | n/a — top tier (the test *is* the enforcement) |
| T2 | Never weaken the schema/constraints to make a test pass. | 1 | a constraint is disabled for a test once → harness asserts constraints on |
| T3 | Tests fail if the implementation is replaced by a constant (named fixtures, ≥3 inputs). | 1 | code hardcoded to tests ships → mutation gate |
| T4 | Every bug fix ships a regression test that fails on the old code. | 1 | a fixed bug recurs untested → CI requires a test |

## Process & Workflow

| ID | Principle | Start | Promote when |
|----|-----------|:-----:|--------------|
| P1 | Codify an invariant the first time a bug class repeats. | 1 | the class is fixed a third time uncodified |
| P2 | Promote a rule in proportion to how often its absence bit you. | 0 | authoring a rule tied to a recurred class |
| P3 | An unenforced convention is worse than none — have an enforcement plan or drop it. | 0 | a new convention is proposed |
| P4 | Name the bug class in fix-commit subjects from commit #1. | 1 | class tags applied inconsistently → commit lint |
| P5 | Sequence hardening: Foundation → Security/Correctness → Testing/Observability → Perf/Structure/Ops. | 0 | planning a hardening pass |
| P6 | Fix the class, not the symptom — confirm root cause first. | 1 | a patched symptom resurfaces |
| P7 | Treat fix-commit concentration in one subsystem as a missing-invariant signal. | 0 | the manual churn review proves valuable every milestone |

## Collaboration & Communication

| ID | Principle | Start | Promote when |
|----|-----------|:-----:|--------------|
| CC1 | Bracket execution with two human gates: plan, then review. | 0 | review confirms a plan preceded code → branch protection |
| CC2 | Briefs carry intent, not implementation (no file paths/code). | 0 | add an intake check for implementation detail |
| CC3 | The reviewer is a separate actor from the implementer. | 1 | a self-approved change slips → block self-approval |
| CC4 | Capture review findings as tracked items. | 1 | a finding is lost in an ephemeral thread → auto-track |

## Tooling & Infrastructure

| ID | Principle | Start | Promote when |
|----|-----------|:-----:|--------------|
| TI1 | Treat living docs as infrastructure (cold-start, decisions log, known-issues, freshness rule). | 0 | a post-change rule requires doc updates → CI doc check |
| TI2 | Cap the cold-start doc size; offload history to a timeline doc. | 1 | the doc exceeds the cap once → CI line-count check |
| TI3 | Sandbox subprocesses by default (env allowlist, tmpdir cwd, secrets channel, stdout=protocol). | 2 | n/a — security control, top tier from day one |

---

## Day-1 pre-loads

Adopt these at their starting tier **immediately**, before the first feature:

- **A1, A3, A2** — the recurring classes (races, non-terminal lifecycle, async-gating).
- **TI3** — security control, Tier 2 from the first subprocess.
- **T1** — Tier 2 before the first migration.

Everything else: start where the table says and let recurrence pull it up the ladder (P1 + P2).
