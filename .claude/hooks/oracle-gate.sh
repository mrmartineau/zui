#!/usr/bin/env bash
# Stop hook: before Claude finishes, run the package tests (unit + design-system
# oracle) if CSS, wrappers, shared variants, docs pages or intent/ changed on
# this branch, committed or not. Exit 2 blocks the stop and feeds the failure
# back.
set -uo pipefail

input=$(cat)
# Already continuing because of this hook: don't loop forever.
if [[ "$input" =~ \"stop_hook_active\"[[:space:]]*:[[:space:]]*true ]]; then exit 0; fi

# Test where Claude is working (may be a worktree), not where the session began.
cwd=""
if [[ "$input" =~ \"cwd\"[[:space:]]*:[[:space:]]*\"([^\"]*)\" ]]; then cwd="${BASH_REMATCH[1]}"; fi
cd "${cwd:-${CLAUDE_PROJECT_DIR:-.}}" 2>/dev/null || exit 0
cd "$(git rev-parse --show-toplevel 2>/dev/null)" || exit 0

# Everything this branch changed vs main, plus uncommitted and untracked work.
base=$(git merge-base HEAD origin/main 2>/dev/null || git merge-base HEAD main 2>/dev/null || echo HEAD)
changed=$( { git diff --name-only "$base"; git ls-files --others --exclude-standard; } 2>/dev/null \
  | grep -E '^(packages/zui/src|docs/src/pages|intent)/' || true)
[[ -z "$changed" ]] && exit 0

if ! out=$(pnpm --filter @mrmartineau/zui test 2>&1); then
  {
    echo "Tests failed. If a design-system check (D1-D6) failed, read intent/design-system.md."
    echo "Fix the change, or if the rule should change, edit intent/ first and say why."
    echo "Never add to a KNOWN_* baseline to get green."
    echo
    echo "$out" | tail -60
  } >&2
  exit 2
fi
exit 0
