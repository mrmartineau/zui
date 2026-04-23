export type MenuDirection = 'ltr' | 'rtl'
export type MenuSide = 'top' | 'right' | 'bottom' | 'left'
export type MenuAlign = 'start' | 'center' | 'end'
export type MenuItemKind = 'button' | 'link'
export type MenuFocusTarget = 'first' | 'last' | 'next' | 'previous' | null

export interface MenuRootOptions {
  align?: MenuAlign
  defaultOpen?: boolean
  dir?: MenuDirection
  disabled?: boolean
  id?: string
  modal?: boolean
  onOpenChange?: (open: boolean) => void
  open?: boolean
  side?: MenuSide
}

export interface MenuTriggerRegistration {
  disabled: boolean
  element: HTMLElement | null
  triggerId: string
}

export interface MenuContentRegistration {
  contentId: string
  element: HTMLElement | null
}

export interface MenuItemRegistration {
  disabled: boolean
  element: HTMLElement | null
  id: string
  kind: MenuItemKind
  order: number
  textValue?: string
}

export interface MenuSnapshot {
  align: MenuAlign
  contentId: string
  dir: MenuDirection
  disabled: boolean
  highlightedItemId: string | null
  modal: boolean
  open: boolean
  rootId: string
  side: MenuSide
  triggerId: string
  triggerDisabled: boolean
}

export interface MenuControllerApi {
  closeMenu(options?: { restoreFocus?: boolean }): boolean
  focusItem(id: string): boolean
  focusNextItem(currentId?: string | null): boolean
  focusPreviousItem(currentId?: string | null): boolean
  focusFirstItem(): boolean
  focusLastItem(): boolean
  getContent(): MenuContentRegistration | undefined
  getItem(id: string): MenuItemRegistration | undefined
  getItems(): MenuItemRegistration[]
  getSnapshot(): MenuSnapshot
  getTrigger(): MenuTriggerRegistration | undefined
  handleContentKeydown(event: KeyboardEvent): void
  handleDocumentPointerDown(target: EventTarget | null): void
  handleItemPointerEnter(id: string): void
  handleItemTextInput(character: string): boolean
  handleTriggerClick(): void
  handleTriggerKeydown(event: KeyboardEvent): void
  openMenu(options?: { focus?: MenuFocusTarget }): boolean
  registerContent(registration: MenuContentRegistration): () => void
  registerItem(registration: MenuItemRegistration): () => void
  registerTrigger(registration: MenuTriggerRegistration): () => void
  selectItem(id: string): boolean
  setOptions(options: MenuRootOptions): void
  subscribe(listener: (snapshot: MenuSnapshot) => void): () => void
  toggleMenu(options?: { focus?: Exclude<MenuFocusTarget, 'next' | 'previous'> | null }): boolean
}
