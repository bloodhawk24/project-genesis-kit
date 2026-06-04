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

### Supporting docs (`docs/`)

| Artifact | What it is | Read it when |
|----------|------------|--------------|
| [`docs/tenets/enforcement-ladder.md`](docs/tenets/enforcement-ladder.md) | How a tenet climbs Tier 0 → 1 → 2, with promotion triggers and the UI-gating worked example. | Deciding how hard to enforce a rule. |
| [`docs/tenets/starter-set.md`](docs/tenets/starter-set.md) | The 24 principles as a compact quick-reference card (principle · tier · promote-when). | You want the cheat sheet, not the full text. |
| [`docs/templates/decisions-log.md`](docs/templates/decisions-log.md) | Append-only decision log template with examples. | Setting up living docs (TI1); recording a decision. |
| [`docs/templates/known-issues.md`](docs/templates/known-issues.md) | Structured known-issues index template with examples. | Setting up living docs; logging a known bug. |
| [`docs/templates/state-machine.md`](docs/templates/state-machine.md) | Model entity states before code; every-edge-a-test rule + example (A4). | Designing any lifecycle-bearing entity. |
| [`docs/guides/deterministic-testing.md`](docs/guides/deterministic-testing.md) | Fake-before-mock + the P/N/E/C test taxonomy with template tests. | Writing tests; setting up the harness. |
| [`docs/guides/codebase-hardening.md`](docs/guides/codebase-hardening.md) | The 4-sprint audit framework in dependency order (P5). | Hardening a working-but-rough codebase. |
| [`docs/guides/collaboration.md`](docs/guides/collaboration.md) | The three-actor model (owner / orchestrator / implementer), intent briefs, fresh-context CR, plan-first gate. | Working as a human+AI team. |

### Scaffolding (drop-in starters)

| Artifact | What it is | Use it when |
|----------|------------|-------------|
| [`.github/workflows/ci.yml`](.github/workflows/ci.yml) | Minimal CI pipeline (lint → test → build) — CI from commit #0. | Setting up the repo (Tier-2 backstop). |
| [`eslint.config.mjs`](eslint.config.mjs) | Starter flat config with an "Architecture Enforcement Rules" section showing where custom tenets-as-lint go. | Setting up linting; promoting a tenet to a rule. |

---

## The three enforcement tiers (at a glance)

- **Tier 0 — Day-One Doc:** written in the Playbook, read on start. Relies on recall.
- **Tier 1 — CR Checklist:** the reviewer verifies it on every PR.
- **Tier 2 — Automated Guardrail:** lint rule, CI gate, or structural refusal in code. Can't be forgotten.

Start every rule at the lowest sufficient tier and **promote on recurrence** — with three exceptions
that pre-load higher: security controls, inherently-automated mechanisms, and classes already proven
expensive in a prior project. See [`PLAYBOOK.md`](PLAYBOOK.md#promotion-policy) for the full policy.
