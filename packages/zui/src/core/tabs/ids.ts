let tabsIdCount = 0

function sanitizeValue(value: string) {
  return value.trim().replace(/\s+/g, '-').replace(/[^a-zA-Z0-9_-]/g, '') || 'item'
}

export function createTabsRootId(explicitId?: string) {
  if (explicitId) return explicitId
  tabsIdCount += 1
  return `zui-tabs-${tabsIdCount}`
}

export function createTabsTriggerId(rootId: string, value: string) {
  return `${rootId}-trigger-${sanitizeValue(value)}`
}

export function createTabsContentId(rootId: string, value: string) {
  return `${rootId}-content-${sanitizeValue(value)}`
}
