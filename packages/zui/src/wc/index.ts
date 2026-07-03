/*
 * ZUI web components — light-DOM custom elements over the ZUI stylesheet.
 *
 * Importing this module registers every `<zui-*>` element (safe during SSR;
 * registration is skipped when no DOM is present and never happens twice).
 * Classes are also exported for extension or manual registration.
 *
 * ```ts
 * import '@mrmartineau/zui/css'
 * import '@mrmartineau/zui/wc'
 * ```
 */

import { ZuiAccordion, ZuiCollapsible } from './accordion'
import {
  ZuiAppShell,
  ZuiAppShellHeader,
  ZuiAppShellMain,
  ZuiAppShellSidebar,
  ZuiAppShellSidebarBody,
  ZuiAppShellSidebarFooter,
  ZuiAppShellSidebarHeader,
} from './appShell'
import { ZuiAvatar } from './avatar'
import { ZuiBadge } from './badge'
import { ZuiButton } from './button'
import {
  ZuiCard,
  ZuiCardBody,
  ZuiCardDescription,
  ZuiCardHeader,
  ZuiCardTitle,
} from './card'
import {
  ZuiDialog,
  ZuiDialogBody,
  ZuiDialogDescription,
  ZuiDialogFooter,
  ZuiDialogHeader,
  ZuiDialogTitle,
} from './dialog'
import { defineElement } from './element'
import {
  ZuiField,
  ZuiFieldDescription,
  ZuiFieldError,
  ZuiFieldGroup,
  ZuiFieldLegend,
  ZuiFieldSeparator,
  ZuiFieldSet,
} from './field'
import { ZuiFlex } from './flex'
import {
  ZuiCheckbox,
  ZuiInput,
  ZuiLabel,
  ZuiRadio,
  ZuiSelect,
  ZuiTextarea,
} from './forms'
import { ZuiMenu, ZuiMenuContent, ZuiMenuItem, ZuiMenuTrigger } from './menu'
import { ZuiPopover } from './popover'
import { ZuiTable } from './table'
import { ZuiTabs, ZuiTabsContent, ZuiTabsList, ZuiTabsTrigger } from './tabs'
import { ZuiTooltip } from './tooltip'
import {
  ZuiCode,
  ZuiKbd,
  ZuiKbdGroup,
  ZuiLink,
  ZuiPre,
  ZuiProse,
  ZuiText,
} from './typography'

/** Tag name → element class for every ZUI custom element. */
export const ZUI_ELEMENTS = {
  'zui-accordion': ZuiAccordion,
  'zui-app-shell': ZuiAppShell,
  'zui-app-shell-header': ZuiAppShellHeader,
  'zui-app-shell-main': ZuiAppShellMain,
  'zui-app-shell-sidebar': ZuiAppShellSidebar,
  'zui-app-shell-sidebar-body': ZuiAppShellSidebarBody,
  'zui-app-shell-sidebar-footer': ZuiAppShellSidebarFooter,
  'zui-app-shell-sidebar-header': ZuiAppShellSidebarHeader,
  'zui-avatar': ZuiAvatar,
  'zui-badge': ZuiBadge,
  'zui-button': ZuiButton,
  'zui-card': ZuiCard,
  'zui-card-body': ZuiCardBody,
  'zui-card-description': ZuiCardDescription,
  'zui-card-header': ZuiCardHeader,
  'zui-card-title': ZuiCardTitle,
  'zui-checkbox': ZuiCheckbox,
  'zui-code': ZuiCode,
  'zui-collapsible': ZuiCollapsible,
  'zui-dialog': ZuiDialog,
  'zui-dialog-body': ZuiDialogBody,
  'zui-dialog-description': ZuiDialogDescription,
  'zui-dialog-footer': ZuiDialogFooter,
  'zui-dialog-header': ZuiDialogHeader,
  'zui-dialog-title': ZuiDialogTitle,
  'zui-field': ZuiField,
  'zui-field-description': ZuiFieldDescription,
  'zui-field-error': ZuiFieldError,
  'zui-field-group': ZuiFieldGroup,
  'zui-field-legend': ZuiFieldLegend,
  'zui-field-separator': ZuiFieldSeparator,
  'zui-field-set': ZuiFieldSet,
  'zui-flex': ZuiFlex,
  'zui-input': ZuiInput,
  'zui-kbd': ZuiKbd,
  'zui-kbd-group': ZuiKbdGroup,
  'zui-label': ZuiLabel,
  'zui-link': ZuiLink,
  'zui-menu': ZuiMenu,
  'zui-menu-content': ZuiMenuContent,
  'zui-menu-item': ZuiMenuItem,
  'zui-menu-trigger': ZuiMenuTrigger,
  'zui-popover': ZuiPopover,
  'zui-pre': ZuiPre,
  'zui-prose': ZuiProse,
  'zui-radio': ZuiRadio,
  'zui-select': ZuiSelect,
  'zui-table': ZuiTable,
  'zui-tabs': ZuiTabs,
  'zui-tabs-content': ZuiTabsContent,
  'zui-tabs-list': ZuiTabsList,
  'zui-tabs-trigger': ZuiTabsTrigger,
  'zui-text': ZuiText,
  'zui-textarea': ZuiTextarea,
  'zui-tooltip': ZuiTooltip,
} as const

/**
 * Register every ZUI custom element. Called automatically on import; calling
 * again is a no-op, and it is safe in non-DOM environments.
 */
export function defineZuiElements(): void {
  for (const [tag, ctor] of Object.entries(ZUI_ELEMENTS)) {
    defineElement(tag, ctor as CustomElementConstructor)
  }
}

defineZuiElements()

export {
  boolAttr,
  classHostElement,
  defineElement,
  stringAttr,
  ZuiElement,
} from './element'
export {
  ZuiAccordion,
  ZuiAppShell,
  ZuiAppShellHeader,
  ZuiAppShellMain,
  ZuiAppShellSidebar,
  ZuiAppShellSidebarBody,
  ZuiAppShellSidebarFooter,
  ZuiAppShellSidebarHeader,
  ZuiAvatar,
  ZuiBadge,
  ZuiButton,
  ZuiCard,
  ZuiCardBody,
  ZuiCardDescription,
  ZuiCardHeader,
  ZuiCardTitle,
  ZuiCheckbox,
  ZuiCode,
  ZuiCollapsible,
  ZuiDialog,
  ZuiDialogBody,
  ZuiDialogDescription,
  ZuiDialogFooter,
  ZuiDialogHeader,
  ZuiDialogTitle,
  ZuiField,
  ZuiFieldDescription,
  ZuiFieldError,
  ZuiFieldGroup,
  ZuiFieldLegend,
  ZuiFieldSeparator,
  ZuiFieldSet,
  ZuiFlex,
  ZuiInput,
  ZuiKbd,
  ZuiKbdGroup,
  ZuiLabel,
  ZuiLink,
  ZuiMenu,
  ZuiMenuContent,
  ZuiMenuItem,
  ZuiMenuTrigger,
  ZuiPopover,
  ZuiPre,
  ZuiProse,
  ZuiRadio,
  ZuiSelect,
  ZuiTable,
  ZuiTabs,
  ZuiTabsContent,
  ZuiTabsList,
  ZuiTabsTrigger,
  ZuiText,
  ZuiTextarea,
  ZuiTooltip,
}
