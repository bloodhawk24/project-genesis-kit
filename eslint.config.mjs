// Starter ESLint flat config.
//
// PRINCIPLE: A tenet you can lint, you should lint. This file is where a Tier-0 doc rule that
// keeps recurring graduates into a Tier-2 guardrail it's impossible to merge past (see the
// enforcement ladder + P2). Most tenets stay in docs; the handful tied to your highest-churn
// bug class earn a custom rule here.

export default [
  {
    rules: {
      // Baseline hygiene.
      'no-unused-vars': 'warn',
      'no-undef': 'error',

      // ──────────────────────────────────────────────────────────────────────
      // Architecture Enforcement Rules
      // ──────────────────────────────────────────────────────────────────────
      // Add custom rules here that enforce *architectural* tenets — not style, but the
      // invariants from PLAYBOOK.md whose absence has bitten you more than once.
      //
      // Promotion path: bug → tenet in docs (Tier 0) → CR checklist (Tier 1) → a rule here
      // (Tier 2). Only promote a tenet to a rule once it has recurred despite the checklist.
      //
      // EXAMPLE — `no-async-gating` (enforces A2):
      //   The single rule that earned automation in the source project. UI status was gated on
      //   a value re-fetched over the network; the read raced the event stream and the status
      //   stuck ("orange-dot-stuck"). The rule flags any awaited/fetched value used in a gating
      //   condition (visibility, status, enabled-state), forcing gates onto synchronously-set
      //   in-memory event state instead.
      //
      //   Wire a custom rule by importing your local plugin and enabling it, e.g.:
      //     'local/no-async-gating': 'error',
      //   (define the rule in a local ESLint plugin and add it to `plugins` above).
    },
  },
];
