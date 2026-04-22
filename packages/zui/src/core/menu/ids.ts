function randomId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return Math.random().toString(36).slice(2, 10)
}

export function createMenuRootId(explicitId?: string) {
  if (explicitId) return explicitId
  return `zui-menu-${randomId()}`
}

export function createMenuTriggerId(rootId: string) {
  return `${rootId}-trigger`
}

export function createMenuContentId(rootId: string) {
  return `${rootId}-content`
}

export function createMenuItemId(rootId: string, explicitId?: string) {
  if (explicitId) return explicitId
  return `${rootId}-item-${randomId()}`
}
