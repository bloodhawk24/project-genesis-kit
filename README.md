# Project Genesis Kit

**The founding documents for a new project.** Clone this as your starting point on day one.

This kit is the distilled, domain-agnostic output of a full project retrospective: 24 invariants
that earned their place by costing real rework, plus the process and templates that keep them
enforced. The transferable asset isn't any single rule — it's the **enforcement ladder** (codify
on first repeat, promote in proportion to recurrence, never ship an unenforced convention) plus a
handful of invariants pre-loaded at the right tier.

---

## How to use it

1. **Clone this repo as the seed for your new project** (or copy these files into a fresh repo).
   ```bash
   git clone https://github.com/bloodhawk24/project-genesis-kit.git my-new-project
   cd my-new-project && rm -rf .git && git init
   ```
2. **Read [`PLAYBOOK.md`](PLAYBOOK.md) first.** It's the bible — the one document every contributor (human or agent) reads on day one.
3. **Adopt [`OPERATING-PROCEDURE.md`](OPERATING-PROCEDURE.md)** as your workflow. Pre-load the day-1 rules (A1, A3, A2) and TI3 at their starting tiers immediately.
4. **Fill in [`CLAUDE.md`](CLAUDE.md)** — replace every `<PLACEHOLDER>`, delete the guidance comments. This becomes your living cold-start doc; keep it under ~120 lines.
5. **Keep [`KIRO.md`](KIRO.md)** as the steering doc for your implementer agent.
6. **Promote rules up the tiers as your project teaches you which classes recur** (that's P1 + P2 in action).

---

## What's in the kit

| Artifact | What it is | Read it when |
|----------|------------|--------------|
| [`PLAYBOOK.md`](PLAYBOOK.md) | The 24 invariants by category, each with its principle, enforcement tier, and promotion trigger. The founding philosophy. | Day one, everyone. |
| [`OPERATING-PROCEDURE.md`](OPERATING-PROCEDURE.md) | Roles, the two human gates (plan + review), briefing format, the tiered CR process, and definition of done. | Setting up how work flows. |
| [`CLAUDE.md`](CLAUDE.md) | Template cold-start doc for AI agents — size-disciplined (~120 lines), fill-in-the-blanks with guidance comments. | First thing an agent reads each session. |
| [`KIRO.md`](KIRO.md) | Steering doc for the implementer: runtime envelope, task sizing, plan-first gate, implementation discipline, tests, DoD. | Before taking an implementation task. |

---

## The three enforcement tiers (at a glance)

- **Tier 0 — Day-One Doc:** written in the Playbook, read on start. Relies on recall.
- **Tier 1 — CR Checklist:** the reviewer verifies it on every PR.
- **Tier 2 — Automated Guardrail:** lint rule, CI gate, or structural refusal in code. Can't be forgotten.

Start every rule at the lowest sufficient tier and **promote on recurrence** — with three exceptions
that pre-load higher: security controls, inherently-automated mechanisms, and classes already proven
expensive in a prior project. See [`PLAYBOOK.md`](PLAYBOOK.md#promotion-policy) for the full policy.
