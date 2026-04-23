import type { MenuItemRegistration } from './types'

const TYPEAHEAD_RESET_MS = 350

function normalize(value: string) {
  return value.trim().toLocaleLowerCase()
}

export function getMenuItemText(item: MenuItemRegistration) {
  return normalize(item.textValue ?? item.element?.textContent ?? '')
}

export interface MenuTypeaheadState {
  buffer: string
  timestamp: number
}

export function appendTypeaheadCharacter(
  state: MenuTypeaheadState,
  character: string,
  now = Date.now(),
): MenuTypeaheadState {
  const next = normalize(character)
  if (!next) return state

  if (now - state.timestamp > TYPEAHEAD_RESET_MS) {
    return { buffer: next, timestamp: now }
  }

  return { buffer: `${state.buffer}${next}`, timestamp: now }
}

export function findTypeaheadMatch(
  items: MenuItemRegistration[],
  buffer: string,
  currentId?: string | null,
) {
  const enabledItems = items.filter((item) => !item.disabled)
  if (enabledItems.length === 0 || !buffer) return null

  const matches = enabledItems.filter((item) => getMenuItemText(item).startsWith(buffer))
  if (matches.length === 0) return null

  const startIndex = currentId == null ? -1 : matches.findIndex((item) => item.id === currentId)
  return matches[(startIndex + 1) % matches.length] ?? null
}
