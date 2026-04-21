export type TabsOrientation = 'horizontal' | 'vertical'
export type TabsActivationMode = 'auto' | 'manual'
export type TabsDirection = 'ltr' | 'rtl'

export interface TabsRootOptions {
  activationMode?: TabsActivationMode
  defaultValue?: string
  dir?: TabsDirection
  disabled?: boolean
  id?: string
  onValueChange?: (value: string) => void
  orientation?: TabsOrientation
  value?: string
}

export interface TabsTriggerRegistration {
  disabled: boolean
  element: HTMLElement | null
  order: number
  panelId: string
  triggerId: string
  value: string
}

export interface TabsContentRegistration {
  element: HTMLElement | null
  panelId: string
  triggerId: string
  value: string
}

export interface TabsSnapshot {
  activationMode: TabsActivationMode
  dir: TabsDirection
  disabled: boolean
  focusedValue: string | null
  orientation: TabsOrientation
  rootId: string
  selectedValue: string | null
}

export interface TabsStateChangeEvent {
  previousValue: string | null
  value: string | null
}

export interface TabsControllerApi {
  blurTrigger(value: string): void
  clickTrigger(value: string): void
  focusTrigger(value: string): void
  getContent(value: string): TabsContentRegistration | undefined
  getSnapshot(): TabsSnapshot
  getTrigger(value: string): TabsTriggerRegistration | undefined
  getTriggers(): TabsTriggerRegistration[]
  handleTriggerKeydown(event: KeyboardEvent, value: string): void
  registerContent(registration: TabsContentRegistration): () => void
  registerTrigger(registration: TabsTriggerRegistration): () => void
  selectValue(value: string): void
  setOptions(options: TabsRootOptions): void
  subscribe(listener: (snapshot: TabsSnapshot) => void): () => void
}
