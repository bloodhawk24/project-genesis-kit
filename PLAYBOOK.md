# The Playbook

**The single document you read on day one.** 24 invariants distilled from a full project
retrospective, stripped of project-specifics, ready to drop into the next repo. Each is a
generalized rule — not advice. Read it once, then live by it.

If you internalize only three things, internalize the **day-1 pre-loads** (A1, A3, A2) and the
**meta-lesson** at the bottom. Everything else is detail.

---

## How enforcement works

Every rule sits at one of three tiers. The tier says *how* the rule is kept, not how important it is.

- **Tier 0 — Day-One Doc.** Written here; read on project start. Teaches, relies on recall.
- **Tier 1 — CR Checklist.** A check the reviewer verifies on every PR. Forces per-change self-review.
- **Tier 2 — Automated Guardrail.** Lint rule, CI gate, schema validator, or a structural refusal in code. Cannot be forgotten.

## Promotion policy

**Start at the lowest sufficient tier; promote on recurrence.** Most rules stay at Tier 0. Three
principled exceptions move higher *without* waiting for a repeat:

1. **Security controls pre-load at Tier 2** — you do not wait for a secret to leak (TI3).
2. **Inherently-automated mechanisms** (where the test/gate *is* the enforcement) start at Tier 2 (T1).
3. **Classes that already proved expensive in a prior project** may start at Tier 1 — recurrence "credit" carries across the project boundary (A2, A3).

Each rule below lists its **Start** tier and its **Promote when** trigger.

---

## Architecture & Design

### A1 — Single writer per state slice
**Principle:** Give every slice of shared mutable state exactly one owning writer; all other actors mutate it only by routing through that owner.
- **Start:** Tier 0 · **Promote when:** a second code path needs to write the same slice.
- *Absence cost:* reactive whack-a-mole — each new writer reopens every prior ordering bug; the slow writer wins nondeterministically.

### A2 — Gate state on synchronous events, never on async re-reads
**Principle:** Derive what the UI presents from in-memory state set synchronously by events, never from a value re-fetched over the network.
- **Start:** Tier 1 (known-expensive class) · **Promote when:** the bug class appears once in the new codebase → custom lint rule forbidding awaited/fetched values from gating visibility or status.
- *Absence cost:* status indicators that lie — stuck, flickering, stale — because the network read races the event stream.

### A3 — Every async/external operation has a guaranteed terminal state
**Principle:** Any operation that can run, crash, time out, or be killed must always end in an explicit success or failure state, set on every exit path including abnormal ones.
- **Start:** Tier 1 · **Promote when:** a "stuck running" bug recurs after the checklist exists → terminal-state lint + runtime watchdog past a deadline.
- *Absence cost:* orphaned operations stuck "running" forever; UIs and retries waiting on a state that never arrives.

### A4 — Model long-lived processes as an explicit state machine
**Principle:** Give lifecycle-bearing entities an explicit set of states and legal transitions, and create a successor only via its legitimate trigger — never by fabricating records.
- **Start:** Tier 0 (the state diagram) · **Promote when:** an entity exceeds two lifecycle states and transition code is written → runtime transition guard rejecting illegal transitions and out-of-band successor creation.
- *Absence cost:* duplicate/fabricated records, premature advancement, corruption that's expensive to untangle later.

### A5 — Set a size/responsibility ceiling on day one
**Principle:** Cap how much one file/module/component may own before it must be split, and state the cap before the first commit.
- **Start:** Tier 1 · **Promote when:** a second component has to be broken up after crossing the ceiling → lint threshold (max lines / max responsibilities) in CI.
- *Absence cost:* every change risks a 1000+-line file; refactor debt compounds and is paid all at once under pressure.

### A6 — One source of truth per fact
**Principle:** Each fact lives in exactly one store with one writer; never let two systems both claim authority over the same data.
- **Start:** Tier 0 (a decisions-log entry made once, early) · **Promote when:** a second store could plausibly hold the same fact → ownership/schema doc enforced in review.
- *Absence cost:* divergence bugs where two copies disagree and neither is trusted; unbounded reconciliation logic.

---

## Testing & Quality

### T1 — Gate every schema change behind an append-only migration replay test
**Principle:** Migrations are append-only and sequential, and an automated replay test gates every schema change; high churn on that test is the rule working, not a defect.
- **Start:** Tier 2 (the replay test *is* the enforcement — add it before the first migration) · **Promote when:** n/a, already top tier.
- *Absence cost:* edited-in-place migrations, environment drift, "works on my machine" schema surprises.

### T2 — Never weaken the schema or constraints to make a test pass
**Principle:** Tests run against the real schema with all constraints enabled; if a test needs a weaker schema, the test is wrong.
- **Start:** Tier 1 · **Promote when:** a constraint is disabled for a test even once → harness asserts full constraints on; CI fails if any test disables them.
- *Absence cost:* a suite that passes against a system that doesn't exist in production — the most dangerous false confidence.

### T3 — Write tests that fail if the implementation is replaced by a constant
**Principle:** Compute expected values from named fixture constants, cover at least three distinct inputs, and assert that a mutation to the implementation would break the test.
- **Start:** Tier 1 · **Promote when:** code hardcoded to its tests ships despite the checklist → mutation-testing gate + magic-number lint in test expectations.
- *Absence cost:* tests that pass against wrong code — the suite is green but proves nothing.

### T4 — Every bug fix ships with a regression test that would have caught it
**Principle:** No fix merges without a test that fails on the old code and passes on the new.
- **Start:** Tier 1 · **Promote when:** a previously-fixed bug recurs because it shipped without a regression test → CI requires fix-labeled PRs to add/modify a test and verifies it fails on the parent commit.
- *Absence cost:* the same bug returns after the next refactor; you re-pay the original debugging cost.

---

## Process & Workflow

### P1 — Codify an invariant the first time a bug class repeats
**Principle:** The moment two bugs share a root cause, write the invariant down — don't wait for the pattern to become obvious.
- **Start:** Tier 1 (review prompt: "second instance of a class? write the invariant now") · **Promote when:** the same class is fixed a third time without a written invariant.
- *Absence cost:* every repetition between bug #1 and codification is pure, avoidable rework.

### P2 — Promote a rule up the tiers in proportion to how often its absence bit you
**Principle:** Default to the lowest sufficient tier and spend automation effort only on rules whose recurrence justifies it; most rules correctly stay at the doc tier.
- **Start:** Tier 0 · **Promote when:** authoring a rule tied to a class that has already recurred.
- *Absence cost:* under-enforcement (rules forgotten, pain recurs) or over-investment (automating rules that never recur).

### P3 — An unenforced convention is worse than none
**Principle:** For every convention, decide on day one whether you can gate or automate it; if you can't, keep the rule set small enough to actually hold.
- **Start:** Tier 0 · **Promote when:** a new convention is proposed — require an enforcement plan before adoption.
- *Absence cost:* false confidence — everyone believes a rule holds while the data shows it never did.

### P4 — Name the bug class in commit subjects from commit #1
**Principle:** Tag fix commits with their class so the dominant problem is measurable during the project, not only in a retrospective.
- **Start:** Tier 1 · **Promote when:** class tags are applied inconsistently across a milestone → commit-message lint enforcing a `fix(<class>):` prefix.
- *Absence cost:* you can't measure, and therefore can't prioritize, your biggest source of rework while it's happening.

### P5 — Sequence hardening in dependency order
**Principle:** Harden as Foundation → Security/Correctness → Testing/Observability → Performance/Structure/Ops; you can't trust performance numbers or refactors before correctness and tests exist.
- **Start:** Tier 0 (a hardening playbook) · **Promote when:** planning any specific hardening pass — review the plan against the ordering.
- *Absence cost:* optimizing before correctness, or refactoring structure before tests exist to catch the regressions you introduce.

### P6 — Fix the class, not the symptom
**Principle:** Trace every bug to its root cause and fix the whole class, confirming the diagnosis before acting.
- **Start:** Tier 1 (review asks "what class does this belong to?") · **Promote when:** a symptom is patched without root-cause and the class resurfaces.
- *Absence cost:* symptom whack-a-mole — the same root cause resurfaces wearing a different mask.

### P7 — Treat fix-commit concentration in one subsystem as a missing-invariant signal
**Principle:** When a large share of commits are fixes clustered in one area, the gap is a missing abstraction, not bad luck — the fix files name the abstraction you forgot to build.
- **Start:** Tier 0 (periodic churn-review) · **Promote when:** the manual review proves valuable enough to run every milestone → scheduled fix-share-per-subsystem alert.
- *Absence cost:* systemic design gaps get rationalized as ordinary churn and never get fixed at the root.

---

## Collaboration & Communication

### CC1 — Bracket agent execution with two human gates: plan, then review
**Principle:** A human approves the plan before work starts and verifies the review before merge, so errors are caught when they're cheapest.
- **Start:** Tier 0 · **Promote when:** review confirms a plan was approved before code was written → branch protection requiring an approving review before merge (the plan gate stays human).
- *Absence cost:* errors surface only after a PR exists, when they're most expensive to unwind.

### CC2 — Briefs carry intent, not implementation
**Principle:** A brief states what and why — no file paths, function names, or code — and lets the executor find the path itself.
- **Start:** Tier 0 · **Promote when:** an intake check is added to confirm briefs contain no implementation detail.
- *Absence cost:* briefs that go stale the moment code is refactored; you fight the executor's strengths and inherit its blind spots.

### CC3 — The reviewer is a separate actor from the implementer
**Principle:** Whoever wrote a change does not approve it; an independent reviewer evaluates it against the design and criteria.
- **Start:** Tier 1 · **Promote when:** a self-approved change slips through → branch protection blocking self-approval and requiring a non-author review.
- *Absence cost:* implementer blind spots ship unchallenged; no adversarial check on "it works on my machine."

### CC4 — Capture review findings as tracked items
**Principle:** Convert review output into tracked work items so review knowledge outlives any single file or thread.
- **Start:** Tier 1 · **Promote when:** a finding is lost because it lived only in an ephemeral thread → bot/CI step that turns review reports into linked tracked issues before merge.
- *Absence cost:* hard-won review knowledge evaporates and the same issues get re-found later.

---

## Tooling & Infrastructure

### TI1 — Treat living docs as infrastructure
**Principle:** With stateless agents or rotating people the docs *are* the shared memory — maintain a cold-start doc, an append-only decision log, a known-issues index, and a rule that keeps them current after every change.
- **Start:** Tier 0 · **Promote when:** a post-commit/post-PR rule requires docs to be updated alongside the change → CI flags behavior changes that don't touch the relevant docs.
- *Absence cost:* re-deciding settled questions, re-discovering known bugs, painful cold starts whenever context is lost.

### TI2 — Cap the size of the cold-start doc; offload history elsewhere
**Principle:** The cold-start doc holds current state only under a hard size cap; history goes to a separate timeline doc, and the cap is itself the guardrail.
- **Start:** Tier 1 · **Promote when:** the doc exceeds the cap once → CI line-count check on the cold-start doc.
- *Absence cost:* the one doc everyone reads first becomes the one nobody can read — defeating its purpose.

### TI3 — Sandbox subprocesses by default
**Principle:** Never forward the full environment to child processes — allowlist only required variables, run with a temp working directory and tool restrictions, route secrets through a dedicated config channel, and reserve stdout for protocol while logs go to stderr.
- **Start:** Tier 2 (a security control — pre-load as code, don't wait for recurrence) · **Promote when:** n/a, top tier from day one.
- *Absence cost:* secret and path leakage into child processes, sandbox escape, protocol streams corrupted by stray log lines.

---

## The map

| Category | Rules | Tier 0 | Tier 1 | Tier 2 |
|----------|------:|:-------|:-------|:-------|
| Architecture & Design | A1–A6 | A1, A4, A6 | A2, A3, A5 | — |
| Testing & Quality | T1–T4 | — | T2, T3, T4 | T1 |
| Process & Workflow | P1–P7 | P2, P3, P5, P7 | P1, P4, P6 | — |
| Collaboration & Communication | CC1–CC4 | CC1, CC2 | CC3, CC4 | — |
| Tooling & Infrastructure | TI1–TI3 | TI1 | TI2 | TI3 |
| **Total (24)** | | **10** | **12** | **2** |

**Day-1 pre-loads (highest weight):** **A1** single-writer, **A3** guaranteed-terminal-state, **A2**
sync-gating — the recurring classes (races, non-terminal lifecycle) worth carrying into every new repo.

**The meta-lesson that governs the rest:** **P1** (codify on first repeat) + **P2** (promote in
proportion to recurrence) + **P3** (don't ship unenforced conventions). The transferable asset is
the *enforcement ladder itself*, plus the handful of invariants pre-loaded at the right tier.
