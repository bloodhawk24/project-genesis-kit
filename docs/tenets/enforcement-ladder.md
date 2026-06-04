# The Enforcement Ladder

The meta-principle behind every rule in this kit: a tenet is only as good as its enforcement.
A rule progresses up three rungs, and **you climb only as far as recurrence justifies** — most
rules correctly stay on the bottom rung forever.

This is the transferable asset. The specific 24 invariants matter; the ladder that decides *how
hard* to enforce each one matters more, because it ports to any project.

---

## The three rungs

| Tier | Form | How it's kept | Failure mode it removes |
|------|------|---------------|-------------------------|
| **Tier 0 — Day-One Doc** | A line in the playbook. | Read on project start; relies on recall. | Nobody knew the rule existed. |
| **Tier 1 — CR Checklist** | A check the reviewer verifies on every PR. | Forced per-change self-review. | Knew the rule, forgot to apply it. |
| **Tier 2 — Automated Guardrail** | Lint rule, CI gate, schema validator, or a structural refusal in code. | Can't be merged if violated. | Can't forget; can't bypass. |

A higher tier costs more to build and maintain. Tier 2 is the most reliable *and* the most
expensive, so you spend it only where the pain has proven it's worth it.

---

## Promotion policy

**Default: start at the lowest sufficient tier; promote on recurrence.**

| From → To | Trigger |
|-----------|---------|
| Tier 0 → Tier 1 | The rule's bug class appears, or a second code path now needs the rule applied per change. |
| Tier 1 → Tier 2 | The class recurs *despite* the checklist — review caught it inconsistently, so automate it. |

### Three pre-load exceptions

You jump straight to a higher rung — without waiting for a repeat — in exactly three cases:

1. **Security controls → pre-load at Tier 2.** You do not wait for a secret to leak.
2. **Inherently-automated mechanisms → start at Tier 2.** When the test/gate *is* the enforcement (e.g. a migration replay test), there's no cheaper rung.
3. **Classes already expensive in a prior project → start at Tier 1.** Recurrence "credit" carries across the project boundary.

### Demotion

Rare, but allowed: if a Tier 2 guardrail produces mostly false positives and the class hasn't
recurred in a long time, drop it back to a checklist. An annoying gate that everyone learns to
bypass is worse than an honest checklist.

---

## Worked example: the UI-gating rule (A2)

This is the one rule in the source project that climbed the **entire** ladder. It's the model for
how promotion is supposed to feel.

**Rung 0 → bug, not yet a rule.** A status indicator was gated on a value re-fetched from the
database. The network read raced the event stream and the indicator stuck — the "orange-dot-stuck"
bug. Fixed once, locally. No rule yet.

**Rung 0 → tenet.** The fix was generalized into a written tenet: *"UI visibility/content must
derive from synchronous reactive state; async/re-fetched values must never gate UI."* Now it's in
the playbook, taught on day one.

**Rung 1 → checklist.** The same shape of bug surfaced again in review. Recall wasn't enough, so
the tenet became a CR checklist item: *every PR, the reviewer confirms no awaited value gates
visibility or status.*

**Rung 2 → custom lint rule.** It kept being easy to reintroduce. The team wrote a custom
`no-async-gating` ESLint rule that flags any awaited/fetched value used in a gating condition. Now
it's structurally impossible to merge the bug. The class went extinct.

```
orange-dot-stuck bug  →  "no async gating" tenet  →  CR checklist item  →  no-async-gating ESLint rule
   (one local fix)          (Tier 0, recall)          (Tier 1, per-PR)       (Tier 2, can't merge it)
```

**The lesson:** only **one** of ~35 rules earned a custom lint rule — the one tied to the
highest-churn class. Don't automate rules that never recur; do automate the one that keeps biting.
See [`starter-set.md`](starter-set.md) for where each of the 24 starts, and [`../../PLAYBOOK.md`](../../PLAYBOOK.md) for the full text.
