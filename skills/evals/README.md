# Skill evals

Static evals for the ZUI skills (`using-zui`, `zui-theme`, `migrate-to-zui`).

```sh
pnpm run eval:skills         # once
pnpm run eval:skills:watch   # watch
```

## What these check

A skill is a prompt the model trusts more than the codebase. When ZUI renames a
class, drops a token, or ships a new component, nothing else in this repo
notices that the SKILL.md now teaches something false — so these evals derive
ground truth from `packages/` and assert the skills agree with it.

| File | Checks |
| --- | --- |
| `frontmatter.test.ts` | `name` matches the directory, description exists / fits 1024 chars / lists `Triggers on:`, `user-invocable`, single h1 |
| `class-references.test.ts` | every `zui-*` class a skill writes has a CSS rule or is emitted by a component; every `zui-foo-*` family stem has a real member |
| `token-references.test.ts` | every custom property in a ZUI-owned namespace is declared in the CSS |
| `imports.test.ts` | every `@mrmartineau/*` specifier resolves to a declared `exports` subpath; every named import exists in that barrel; components are available in all five framework barrels |
| `conventions.test.ts` | no inline SVG (Phosphor rule), no hex colours, only declared `@layer` names, no unprefixed selector shadowing a ZUI component |
| `coverage.test.ts` | every exported component and CSS component is documented; every `zui-theme` export is documented |

No LLM calls, no network, ~400ms. Safe to run in CI on every commit.

## What these don't check

Whether the model *produces good markup* when it reads a skill. That needs
behavioural evals — a harness that runs prompts with and without the skill and
grades the output (`skill-creator`, promptfoo, or similar). These evals only
guarantee that what the skill claims is true, which is the cheap half.

## Layout

- `lib/source.ts` — ground truth derived from `packages/zui` and
  `packages/zui-theme`. Never hand-maintained.
- `lib/skills.ts` — parses the SKILL.md files into references that keep their
  line numbers, so a failure names the line to fix.
- `lib/allowlist.ts` — documented exceptions. Every entry carries a reason; if
  you can't write one, fix the skill instead.

## When one fails

The failure message is `<skill>/SKILL.md:<line> — <thing>`. Usually the skill is
stale and needs updating. Add an allowlist entry only when the skill is
deliberately naming something that doesn't exist — an anti-example ("don't write
`--zui-button-*`") or an internal primitive with no public surface.

## Adding a skill

Add its directory name to `SKILL_NAMES` in `lib/skills.ts`. The frontmatter,
class, token, import and convention evals pick it up automatically; coverage
evals are per-skill and need their own case.
