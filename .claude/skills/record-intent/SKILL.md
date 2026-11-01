---
name: record-intent
description: At the end of a design or investigation session, write what was decided into intent/ and strengthen the design-system oracle, so the next session inherits the reasoning. Use when a session settled a convention, found something the oracle missed, or changed a rule.
---

# Record intent

Goal: the next agent gets the decision and the reasoning, not just the code.

1. **List what was settled** that isn't already in `intent/` or AGENTS.md.
   Keep only things that constrain future changes ("knobs for parts are read
   inline", "Vue exports ZuiLink").
2. **Pick where each goes.**
   - Checkable promise → new or revised rule in `intent/design-system.md`.
     Next free id (D7…). Fields: rule, Why, Assumes, Check.
   - Choice between options → `intent/decisions/NNNN-slug.md` (Status,
     Context, Decision, Consequences). Short.
   - Undecided → note under the closest rule. Don't invent an answer.
   - A convention for writing code (not a promise to check) → AGENTS.md.
3. **Strengthen the check** in
   `packages/zui/src/intent/design-system.oracle.test.ts`. Use the lightningcss
   AST and captured cva configs already there; no regex over CSS structure.
4. **Mutation-test it.** Copy the file you'll break to the scratchpad, break
   it, confirm the new check fails and names the right file, then copy the
   backup back. Don't use `git checkout` to revert; it discards other
   uncommitted work in the file.
5. **Run** `pnpm --filter @mrmartineau/zui test` and `pnpm run check`.
6. Summarise in 3 lines: rules added/changed, checks added, open questions.

Never add to a `KNOWN_*` baseline to get green. Baselines only shrink.
