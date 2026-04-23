let menuIdCount = 0

export function createMenuRootId(explicitId?: string) {
  if (explicitId) return explicitId
  menuIdCount += 1
  return `zui-menu-${menuIdCount}`
}

export function createMenuTriggerId(rootId: string) {
  return `${rootId}-trigger`
}

export function createMenuContentId(rootId: string) {
  return `${rootId}-content`
}

export function createMenuItemId(rootId: string, explicitId?: string) {
  if (explicitId) return explicitId
  menuIdCount += 1
  return `${rootId}-item-${menuIdCount}`
}
