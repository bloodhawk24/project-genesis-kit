# Operating Procedure

How work moves from idea to merged code. This is the *process* layer; the *principles* layer is
[`PLAYBOOK.md`](PLAYBOOK.md). The procedure exists to enforce two ideas from the Playbook:
**two human gates** (CC1) and **a reviewer separate from the implementer** (CC3).

---

## Roles

| Role | Owns | Does not |
|------|------|----------|
| **Product owner** | What to build and why; final acceptance; UX validation. | Does not dictate implementation. |
| **Orchestrator** | Designs the solution, writes briefs, coordinates the cycle, keeps living docs current. | Does not write production code or self-approve. |
| **Implementer** | Produces the plan, then the code, then passing tests, on a feature branch. | Does not approve own work; does not start coding before the plan is greenlit. |
| **Reviewer** | Evaluates the diff against design + criteria with **fresh context**; files tiered findings. | Did not write the change (CC3). |

One person may wear several hats on a small team — but never the **implementer and reviewer hat on the same change**.

---

## The two gates (CC1)

Agent/implementer execution is bracketed by two human checkpoints. Errors are cheapest before
either gate.

```
idea → DESIGN → [GATE 1: plan approved] → implement → PR → review → [GATE 2: review verified] → merge → docs
```

- **Gate 1 — Plan.** The implementer produces an implementation plan (branch, approach, open questions) and **does not write code** until a human greenlights it. This catches missed requirements and architectural mismatches while changes are still free.
- **Gate 2 — Review.** A human verifies the independent review before merge. No self-approval.

---

## Workflow

1. **Product owner describes** the feature/fix/improvement.
2. **Orchestrator designs:** problem statement + design rule/intent + acceptance criteria + implementation order + out-of-scope boundary + open questions.
3. **Product owner approves** or iterates.
4. **Orchestrator briefs the implementer** (see Briefing format).
5. **Implementer produces a plan** — branch, approach, questions. **No coding yet.**
6. **【Gate 1】** Orchestrator reviews the plan, answers questions, greenlights.
7. **Implementer implements**, commits to a feature branch (tagging fix classes per P4), opens a PR.
8. **Reviewer reviews** the diff with fresh context against the design doc + criteria; produces a CR report with tiered comments.
9. Findings are **captured as tracked items** (CC4) — not left in an ephemeral thread.
10. **Implementer addresses feedback** (re-plan if non-trivial); cycle repeats from step 8.
11. **【Gate 2】** Reviewer satisfied → CR approved → merge to main.
12. **Living docs updated** to reflect final state (TI1).

---

## Briefing format (CC2)

A brief carries **intent, not implementation**. It contains ONLY:

1. **What's broken / what to build** — symptom and root cause, or the capability needed.
2. **Design rule / intent** — the principle that governs the solution.
3. **Acceptance criteria** — observable "done" conditions, as checkboxes.
4. **Implementation order** — if multiple items, which depends on which.

**Never include** file paths, function names, or code snippets. The implementer has full codebase
access and finds the path itself — that keeps the brief durable across refactors and plays to the
executor's navigation strength.

---

## Code review process (CC3, CC4)

- **Fresh context.** The reviewer reads the change cold, against the design and acceptance criteria — not as the author who already "knows" it works.
- **Separate actor.** The author never approves their own change.
- **Tiered comments** — every finding is labeled by severity so triage is unambiguous:

  | Tier | Meaning | Merge impact |
  |------|---------|--------------|
  | **Critical** | Correctness, security, data-loss, or a Playbook invariant violated. | Blocks merge. |
  | **Major** | Design mismatch, missing test, or acceptance criterion unmet. | Blocks merge until resolved or explicitly deferred. |
  | **Minor** | Style, naming, small refactor, nit. | Non-blocking; address or note. |

- **Track every finding** as a work item before merge so review knowledge outlives the thread.

---

## Definition of Done

A change is done only when **all** hold:

- [ ] Acceptance criteria met and demonstrated.
- [ ] Tests pass; the fix ships with a regression test that fails on the old code (T4); tests run against the real schema/constraints (T2) and would fail if the implementation were replaced by a constant (T3).
- [ ] Plan was approved (Gate 1) and an independent reviewer approved (Gate 2).
- [ ] Fix commits name their bug class (P4).
- [ ] Living docs updated — cold-start doc, decisions log, known-issues as applicable (TI1), cold-start doc still under its size cap (TI2).
- [ ] **Codify the class if recurring** — if this is the second time a bug class appeared, the invariant is written down now (P1), and promoted a tier if its recurrence justifies it (P2).
