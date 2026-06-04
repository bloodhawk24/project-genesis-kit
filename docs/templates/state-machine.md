# State Machine Template

For any entity with a lifecycle — a job, a session, an order, a connection — **model its states
before you write the code that moves it between them** (A4). The diagram is the design; the code is
just the diagram made executable.

---

## Why state machines first

- **Illegal transitions become unrepresentable.** If "paid → paid" isn't an edge, the code that
  would double-charge can't be written by accident.
- **Terminal states get named up front (A3).** Every lifecycle ends *somewhere* explicit —
  including the abnormal exits (crash, timeout, kill). Drawing the machine forces you to ask
  "what happens if this dies here?" before it dies in production.
- **Successors are created only by their legitimate trigger.** You never fabricate the next record
  out of band; it can only arrive via a real edge.
- **It's the cheapest place to catch a design hole.** Fixing a missing edge in a diagram costs a
  pencil stroke; fixing it after corruption costs a migration.

---

## How to draw it

1. **List the states.** Nouns the entity can *be* (`pending`, `running`, `succeeded`, `failed`, `cancelled`). Mark the **initial** state and every **terminal** state.
2. **List the triggers.** Events/commands that cause movement (`start`, `complete`, `error`, `timeout`, `kill`).
3. **Draw the edges.** `from --trigger--> to`. Only legal moves get an edge.
4. **Hunt the gaps.** For every state, ask: what happens on *each* trigger, including failure ones? An unanswered cell is a design hole.
5. **Assign one owner (A1).** Exactly one component performs transitions; everyone else requests them through it.

---

## The rule

> **Every edge gets at least one test. Every dead end is a bug.**

- **Every edge → a test.** A transition with no test is an unverified claim. Cover the legal move *and* assert the illegal one is rejected.
- **Dead ends → bugs.** A non-terminal state with no outgoing edge is a place the entity can get *stuck* — that's the A3 "stuck running forever" class. Either add the exit edge or mark the state terminal on purpose.
- **No fabricated successors.** The only way into a state is along a drawn edge.

---

## Minimal example — a background job

```
States:   [pending] (initial) · running · succeeded (terminal) · failed (terminal)
Triggers: start · complete · error · timeout · kill

  pending  --start-->     running
  running  --complete-->  succeeded
  running  --error-->     failed
  running  --timeout-->   failed     # abnormal exit still reaches a terminal state (A3)
  running  --kill-->      failed     # SIGKILL path must mark failed, not orphan the job
```

**Transition table** (the same machine, as a guard the owner enforces):

| From \ Trigger | start | complete | error | timeout | kill |
|----------------|:-----:|:--------:|:-----:|:-------:|:----:|
| pending | running | ✗ | ✗ | ✗ | ✗ |
| running | ✗ | succeeded | failed | failed | failed |
| succeeded | ✗ | ✗ | ✗ | ✗ | ✗ |
| failed | ✗ | ✗ | ✗ | ✗ | ✗ |

`✗` = illegal; the guard rejects it. Note there is **no cell where `running` stays `running`** —
every trigger out of `running` reaches a terminal state, so the job can't get stuck.

**Tests this demands:** one per non-`✗` cell (4 legal transitions) + at least one assertion that an
illegal transition (e.g. `succeeded --start-->`) is rejected.

---

<!--
  COPY for your entity: replace the states/triggers, redraw the edges, fill the transition table,
  then write one test per legal edge and one rejection test per illegal cell you care about.
-->
