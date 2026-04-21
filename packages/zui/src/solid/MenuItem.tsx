import type { VariantProps } from 'cva'
import type { JSX } from 'solid-js'
import { createEffect, createUniqueId, onCleanup, splitProps } from 'solid-js'
import { createMenuItemId } from '../core/menu'
import { buttonVariants } from '../shared/buttonVariants'
import { getMenuItemOrder, useMenuContext } from './menuContext'

type ButtonVariantProps = VariantProps<typeof buttonVariants>

export type MenuItemProps = ButtonVariantProps &
  JSX.ButtonHTMLAttributes<HTMLButtonElement> &
  JSX.AnchorHTMLAttributes<HTMLAnchorElement> & {
    class?: string
    disabled?: boolean
    href?: string
    id?: string
    textValue?: string
  }

export function MenuItem(props: MenuItemProps) {
  const generatedId = createUniqueId()
  const [local, rest] = splitProps(props, [
    'class',
    'color',
    'disabled',
    'href',
    'icon',
    'id',
    'onClick',
    'onFocus',
    'onPointerEnter',
    'shape',
    'size',
    'textValue',
    'variant',
  ])
  const { controller, rootRef, snapshot } = useMenuContext()
  const fallbackId = createMenuItemId(snapshot().rootId, `solid-${generatedId}`)
  const itemId = () => local.id ?? fallbackId
  let ref: HTMLElement | undefined

  createEffect(() => {
    const unregister = controller.registerItem({
      disabled: local.disabled ?? false,
      element: ref ?? null,
      id: itemId(),
      kind: local.href ? 'link' : 'button',
      order: getMenuItemOrder(rootRef(), ref),
      textValue: local.textValue,
    })
    onCleanup(unregister)
  })

  const highlighted = () => snapshot().highlightedItemId === itemId()
  const classes = () =>
    buttonVariants({
      className: ['zui-menu-item', local.class].filter(Boolean).join(' '),
      color: local.color,
      icon: local.icon,
      shape: local.shape,
      size: local.size,
      variant: local.variant ?? 'ghost',
    })

  return local.href ? (
    <a
      {...(rest as JSX.AnchorHTMLAttributes<HTMLAnchorElement>)}
      ref={ref as HTMLAnchorElement}
      aria-disabled={snapshot().disabled || local.disabled ? 'true' : undefined}
      class={classes()}
      data-disabled={snapshot().disabled || local.disabled ? 'true' : undefined}
      data-highlighted={highlighted() ? 'true' : undefined}
      data-text-value={local.textValue}
      data-zui-menu-item=""
      href={local.href}
      id={itemId()}
      onClick={(event) => {
        local.onClick?.(event)
        if (!event.defaultPrevented) {
          const accepted = controller.selectItem(itemId())
          if (!accepted && (snapshot().disabled || local.disabled)) event.preventDefault()
        }
      }}
      onFocus={(event) => {
        local.onFocus?.(event)
        if (!event.defaultPrevented) controller.focusItem(itemId())
      }}
      onPointerEnter={(event) => {
        local.onPointerEnter?.(event)
        if (!event.defaultPrevented) controller.handleItemPointerEnter(itemId())
      }}
      role="menuitem"
      tabIndex={snapshot().open && highlighted() ? 0 : -1}
    />
  ) : (
    <button
      {...(rest as JSX.ButtonHTMLAttributes<HTMLButtonElement>)}
      ref={ref as HTMLButtonElement}
      class={classes()}
      data-disabled={snapshot().disabled || local.disabled ? 'true' : undefined}
      data-highlighted={highlighted() ? 'true' : undefined}
      data-text-value={local.textValue}
      data-zui-menu-item=""
      disabled={snapshot().disabled || local.disabled}
      id={itemId()}
      onClick={(event) => {
        local.onClick?.(event)
        if (!event.defaultPrevented) controller.selectItem(itemId())
      }}
      onFocus={(event) => {
        local.onFocus?.(event)
        if (!event.defaultPrevented) controller.focusItem(itemId())
      }}
      onPointerEnter={(event) => {
        local.onPointerEnter?.(event)
        if (!event.defaultPrevented) controller.handleItemPointerEnter(itemId())
      }}
      role="menuitem"
      tabIndex={snapshot().open && highlighted() ? 0 : -1}
      type="button"
    />
  )
}
