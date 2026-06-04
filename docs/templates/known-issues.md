# Known Issues

The index a cold-starting agent skims so it doesn't re-discover bugs that are already understood
(TI1). Each issue names *where to look* and *a fix sketch* so the next person starts from the
diagnosis, not from zero. Close an issue by moving it to the "Resolved" section with the fixing
commit/PR — don't delete it.

**Columns:** `Symptom` (observable) · `Root Cause Area` (the class/subsystem) · `Where to Look` ·
`Fix Sketch` (the intended approach) · `Priority` (P0 blocker → P3 nice-to-have).

---

## Open

| # | Symptom | Root Cause Area | Where to Look | Fix Sketch | Priority |
|---|---------|-----------------|---------------|------------|:--------:|
| 1 | Long-running job occasionally stays "running" forever after the worker is killed. | Non-terminal lifecycle (A3) | worker exit/cleanup path; the kill/timeout handler | Set a terminal failure state on *every* exit path incl. SIGKILL; add a watchdog that fails jobs stuck past a deadline. | P0 |
| 2 | Status badge flickers between states on page load. | Async-gating (A2) | the component's gating condition | Gate on synchronously-set event state, not the awaited fetch; covered once the `no-async-gating` rule lands. | P2 |

## Resolved

| # | Symptom | Root Cause Area | Fixed by | Regression test |
|---|---------|-----------------|----------|-----------------|
| 0 | "orange-dot-stuck": status gated on a re-fetched column never cleared. | Async-gating (A2) | `<commit/PR>` | `<test that fails on old code>` (T4) |

---

<!--
  ADD a row to "Open" for each new known issue:
  | <n> | <observable symptom> | <bug class / subsystem> | <files or area to start in> | <intended fix, intent not code> | <P0–P3> |

  CLOSE by moving the row to "Resolved" with the fixing commit/PR and the regression test that
  guards it (T4). Keep the row — its history is the value.
-->
