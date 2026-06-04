# Deterministic Testing

A test that sometimes passes and sometimes fails proves nothing and trains the team to ignore red.
The goal: **every test is deterministic** — same inputs, same result, every run. That requires
controlling the things that aren't naturally deterministic (subprocesses, network, clocks,
databases, concurrency) and writing assertions that actually pin behavior.

This guide pairs with the testing tenets: T2 (real schema/constraints), T3 (mutation-resistant),
T4 (regression per fix).

---

## Fake before mock

When you need to stand in for an external dependency, prefer the leftmost option that works:

1. **Real, sandboxed (best).** Use the actual thing in a controlled box — a temp SQLite file with
   full constraints on (T2), a tmpdir, a sandboxed subprocess (TI3). Tests the real behavior.
2. **Fake.** A working lightweight implementation (in-memory store, scripted subprocess, local HTTP
   stub) that obeys the dependency's *contract*. Tests behavior, survives refactors.
3. **Mock (last resort).** Records calls and returns canned values. Use only when you must assert an
   *interaction* (e.g. "the API was called exactly once with these args"). Mocks couple the test to
   the implementation's call shape, so they break on refactor and can pass against wrong logic.

> **Rule of thumb:** mock the *boundary you're verifying the call across*, fake everything else,
> use the real thing whenever it's cheap to sandbox. Don't mock your own code.

### Making the un-deterministic deterministic

| Source of flakiness | Make it deterministic by… |
|---------------------|---------------------------|
| Subprocess / CLI | a scripted fake binary (or sandboxed real one) emitting fixed output on stderr/stdout per TI3 |
| Network / API | a local stub server or fake client returning fixture responses; never hit the real network |
| Clock / timers | inject a controllable clock; never read wall-clock time in assertions |
| Database | a fresh temp DB per test, migrations replayed (T1), constraints ON (T2) |
| Randomness | a seeded RNG or injected values |
| Concurrency / ordering | drive events through a controllable scheduler; assert on final state, await explicit signals — never `sleep()` |

---

## The P/N/E/C taxonomy

Every unit under test gets coverage across four kinds of input. Reaching for all four is how you
find the bugs a single happy-path test misses.

| Class | Asks | Catches |
|-------|------|---------|
| **P — Positive** | Does it do the right thing on valid input? | Broken core logic |
| **N — Negative** | Does it reject/handle invalid input correctly? | Missing validation, silent wrong answers |
| **E — Edge case** | Boundaries, empties, max/min, off-by-one. | Boundary bugs |
| **C — Concurrency** | Races, ordering, interleaving, terminal state under abnormal exit. | A1/A3 class bugs |

### Template test per class

Computed from **named fixture constants over ≥3 inputs** so a constant-return implementation fails (T3):

```js
import { describe, it, expect } from "<your-runner>";

const RATE = 0.2;                 // named fixture constants, not magic numbers
const CASES = [                   // ≥3 distinct inputs
  { gross: 100, expected: 80 },
  { gross: 250, expected: 200 },
  { gross: 0,   expected: 0   },
];

// P — Positive: correct output on valid input, multiple cases.
describe("net() [P]", () => {
  for (const { gross, expected } of CASES) {
    it(`gross ${gross} → ${expected}`, () => {
      expect(net(gross, RATE)).toBe(expected);   // would fail if net() returned a constant
    });
  }
});

// N — Negative: invalid input is rejected, not silently coerced.
it("net() rejects a negative rate [N]", () => {
  expect(() => net(100, -0.1)).toThrow(/rate/);
});

// E — Edge: boundary values behave.
it("net() handles the zero and max boundaries [E]", () => {
  expect(net(0, RATE)).toBe(0);
  expect(net(Number.MAX_SAFE_INTEGER, 0)).toBe(Number.MAX_SAFE_INTEGER);
});

// C — Concurrency: terminal state on abnormal exit; assert final state, no sleeps.
it("job reaches a terminal state when killed mid-run [C]", async () => {
  const job = startJob();          // uses a fake/sandboxed worker
  await job.kill();                // abnormal exit path (A3)
  expect(job.state).toBe("failed");// not stuck "running"
});
```

**Don't:** assert against magic numbers, use `sleep()` to "wait for" async work, disable a
constraint to make a test green (T2), or write a test that still passes if you replace the function
body with `return <constant>` (T3).
