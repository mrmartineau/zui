# Intent

What ZUI promises, why, and how each promise is checked. AGENTS.md says how
to write code here; this says what must stay true, in a form tests can check.

| File                                     | Covers                                              | Checked by                                                  |
| ---------------------------------------- | --------------------------------------------------- | ----------------------------------------------------------- |
| [design-system.md](design-system.md)     | Variants ↔ CSS, knob rules, layers, parity, docs    | `packages/zui/src/intent/design-system.oracle.test.ts`      |
| [decisions/](decisions/)                 | Why things are the way they are                     | Read before changing the area they cover                    |

## Workflow

1. Read the relevant rule before changing CSS, `shared/` variants or wrappers.
2. If a check fails: fix the change, or edit the rule here first and say why in
   the PR. Never grow a `KNOWN_*` baseline to get green.
3. If a session settles something that isn't written down, record it with the
   `record-intent` skill.
4. Checks run in CI (`pnpm --filter @mrmartineau/zui test`) and on the Claude
   Code Stop hook.
