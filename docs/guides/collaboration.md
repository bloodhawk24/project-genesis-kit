# Collaboration: The Three-Actor Model

How humans and AI build software together. This guide is the *how we work together* layer;
[`../../OPERATING-PROCEDURE.md`](../../OPERATING-PROCEDURE.md) is the *process steps* and
[`../../PLAYBOOK.md`](../../PLAYBOOK.md) the *invariants*. It operationalizes CC1–CC4.

---

## The three actors

| Actor | Owns | Best at | Avoid |
|-------|------|---------|-------|
| **Human Product Owner** | *What* to build and why; final acceptance. | Judgment, priorities, taste, real-world context. | Dictating implementation; rubber-stamping plans without reading them. |
| **AI Orchestrator** | *How* the work is shaped: design, briefs, coordination, living docs. | Decomposition, holding the whole design, intent-based briefs. | **Being prescriptive** — handing the implementer file paths/code instead of intent. |
| **AI Implementer** | *Executing* one task: plan → code → passing tests on a branch. | Navigating the codebase, writing the change, exhaustive tests. | Starting before the plan is greenlit; reviewing its own work. |

The split exists so no actor checks its own homework: the human approves intent, the orchestrator
shapes it, the implementer executes it, and **a separate reviewer** judges the result (CC3).

---

## Communication patterns

### Intent-based briefs (CC2)
A brief states **what + why**, never **how**. It contains only:
1. **Problem** — the symptom and root cause, or the capability needed.
2. **Design rule / intent** — the principle that governs the solution.
3. **Acceptance criteria** — observable "done" conditions, as checkboxes.

**No file paths. No function names. No code.** The implementer has full codebase access and finds
the path itself — that keeps the brief durable across refactors and plays to the implementer's
navigation strength instead of fighting it.

### Context pointers, not code locations
When the implementer needs background, **cite the relevant doc** ("see the session-lifecycle design
and the concurrency invariants"), not a line number. Docs survive refactors; line numbers rot. This
is why the living-docs set (TI1) exists — it's the shared memory the pointers point at.

### Fresh context for code review (CC3)
The reviewer reads the change **cold**, never as the author who already "knows" it works. The
implementer that wrote a change does not review it. A reviewer with fresh context against the design
+ acceptance criteria is what surfaces a whole class of issues in one pass — the adversarial check
that "works on my machine" can't provide. Findings become tracked items (CC4), not lost threads.

### Task sizing to the runtime envelope
Size a task to what one actor can do in one coherent pass behind one reviewable PR. In particular:

- **Break tasks that bundle multiple test runs / verification cycles** into separate tasks — each
  with its own plan, implementation, and green suite. A task that says "implement A, then B, then
  run the migration suite, then refactor C" is four tasks wearing a trenchcoat.
- If a change would push a file past the size ceiling (A5), it's already two tasks — split it.
- Respect dependency order (P5): foundation before correctness before tests before perf.

---

## The plan-first gate (CC1)

> **The cheapest place to catch a misunderstanding is the plan, before any code exists.**

The implementer produces a plan — branch, approach in intent terms, which Playbook invariants apply,
test strategy, open questions — **and stops.** A human (usually the orchestrator) reads it, answers
the questions, and greenlights. Only then does code get written.

A misread requirement caught here costs a sentence. The same misread caught after a PR exists costs a
rewrite, a re-review, and the trust tax of a wrong-looking diff. Spend the sentence.

```
human: what + why  →  orchestrator: intent brief  →  implementer: PLAN  →  [human greenlights]  →  code  →  [separate reviewer]  →  merge
```
