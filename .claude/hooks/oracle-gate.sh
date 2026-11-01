#!/usr/bin/env bash
# Stop hook: before Claude finishes, run the package tests (unit + design-system
# oracle) if CSS, wrappers, shared variants, docs pages or intent/ changed.
# Exit 2 blocks the stop and feeds the failure back.
set -uo pipefail

input=$(cat)
if [[ "$input" == *'"stop_hook_active":true'* ]]; then exit 0; fi

cd "${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel)}" || exit 0

changed=$( { git diff --name-only HEAD; git ls-files --others --exclude-standard; } 2>/dev/null \
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
