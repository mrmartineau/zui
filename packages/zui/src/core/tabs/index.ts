export { createTabsController } from './controller'
export type { TabsDomController } from './dom'
export { attachTabsDom, autoAttachTabsDom } from './dom'
export {
  createTabsContentId,
  createTabsRootId,
  createTabsTriggerId,
} from './ids'
export {
  getNextEnabledValue,
  getPreviousEnabledValue,
  getTabsKeyboardIntent,
} from './keyboard'
export { TabsRegistry } from './registry'
export type {
  TabsActivationMode,
  TabsContentRegistration,
  TabsControllerApi,
  TabsDirection,
  TabsOrientation,
  TabsRootOptions,
  TabsSnapshot,
  TabsStateChangeEvent,
  TabsTriggerRegistration,
} from './types'
