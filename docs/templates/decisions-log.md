# Decisions Log

**Append-only.** One row per settled decision. Never edit or delete a row — if a decision is
reversed, add a new row that supersedes it and note which entry it replaces. This is how the
project stops re-deciding settled questions (TI1) and how a cold-starting agent learns *why*
things are the way they are.

> **What belongs here:** decisions with lasting consequences — source of truth for a fact (A6),
> a single-writer assignment (A1), a tech choice, a convention and its enforcement plan (P3).
> **What doesn't:** transient task notes (those go in `progress.md`), open bugs (`known-issues.md`).

**Format:** `Date | Decision | Context | Alternatives Considered | Rationale`

---

## Entries

### 2026-01-12 — SQLite is the single source of truth for portfolio data

- **Context:** Data briefly lived in both Markdown files and a database; both were written, risking divergence and overwrite (violates A6).
- **Alternatives considered:** (a) Markdown as source with DB as cache; (b) dual-write with a reconciler; (c) DB as sole source.
- **Rationale:** One fact, one store, one writer. The DB is authoritative; Markdown is render-only output, never read back. Eliminates the divergence class entirely rather than reconciling it.

### 2026-01-20 — UI status derives from synchronous event state, not re-fetched values (A2)

- **Context:** A status indicator gated on a re-fetched DB column raced the event stream and stuck ("orange-dot-stuck").
- **Alternatives considered:** (a) add a retry/poll on the fetch; (b) debounce the indicator; (c) gate on in-memory state set synchronously by the event.
- **Rationale:** (a) and (b) treat the symptom and stay racy. (c) removes the race by construction. Promoted to a `no-async-gating` lint rule after recurrence — see [`../tenets/enforcement-ladder.md`](../tenets/enforcement-ladder.md).

---

<!--
  COPY THIS TEMPLATE for each new decision (newest at the bottom — append-only):

### YYYY-MM-DD — <decision in one line, imperative>

- **Context:** <what forced the decision; the problem or ambiguity.>
- **Alternatives considered:** (a) … (b) … (c) …
- **Rationale:** <why the chosen option won; link the tenet/issue it relates to.>
-->
