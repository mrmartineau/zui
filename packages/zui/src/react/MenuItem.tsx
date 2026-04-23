import type { VariantProps } from 'cva'
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  FocusEvent,
  MouseEvent,
  PointerEvent,
} from 'react'
import { useEffect, useId, useRef } from 'react'
import { createMenuItemId } from '../core/menu'
import { buttonVariants } from '../shared/buttonVariants'
import { getMenuItemOrder, useMenuContext, useMenuSnapshot } from './menuContext'

type ButtonVariantProps = VariantProps<typeof buttonVariants>

type MenuItemBase = ButtonVariantProps & {
  className?: string
  disabled?: boolean
  id?: string
  textValue?: string
}

type MenuItemAsButton = MenuItemBase &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never
  }

type MenuItemAsAnchor = MenuItemBase &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string
  }

export type MenuItemProps = MenuItemAsButton | MenuItemAsAnchor

export function MenuItem({
  className,
  disabled = false,
  variant = 'ghost',
  color,
  size,
  shape,
  icon,
  id,
  textValue,
  ...props
}: MenuItemProps) {
  const generatedId = useId()
  const { controller, rootRef } = useMenuContext()
  const snapshot = useMenuSnapshot()
  const itemId =
    id ??
    createMenuItemId(snapshot.rootId, `react-${generatedId.replace(/:/g, '')}`)
  const ref = useRef<HTMLElement>(null)
  const highlighted = snapshot.highlightedItemId === itemId
  const isLink = 'href' in props && Boolean(props.href)
  const classes = buttonVariants({
    className: ['zui-menu-item', className].filter(Boolean).join(' '),
    color,
    icon,
    shape,
    size,
    variant,
  })

  useEffect(() => {
    return controller.registerItem({
      disabled,
      element: ref.current,
      id: itemId,
      kind: isLink ? 'link' : 'button',
      order: getMenuItemOrder(rootRef.current, ref.current),
      textValue,
    })
  }, [controller, disabled, isLink, itemId, rootRef, textValue])

  const handleClick = (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    ;(
      props as {
        onClick?: (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void
      }
    ).onClick?.(event)

    if (!event.defaultPrevented) {
      const accepted = controller.selectItem(itemId)
      if (!accepted && (snapshot.disabled || disabled)) {
        event.preventDefault()
      }
    }
  }

  const handleFocus = (event: FocusEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    ;(
      props as {
        onFocus?: (event: FocusEvent<HTMLButtonElement | HTMLAnchorElement>) => void
      }
    ).onFocus?.(event)

    if (!event.defaultPrevented) controller.focusItem(itemId)
  }

  const handlePointerEnter = (
    event: PointerEvent<HTMLButtonElement | HTMLAnchorElement>,
  ) => {
    ;(
      props as {
        onPointerEnter?: (
          event: PointerEvent<HTMLButtonElement | HTMLAnchorElement>,
        ) => void
      }
    ).onPointerEnter?.(event)

    if (!event.defaultPrevented) controller.handleItemPointerEnter(itemId)
  }

  const commonProps = {
    className: classes,
    'data-disabled': snapshot.disabled || disabled ? 'true' : undefined,
    'data-highlighted': highlighted ? 'true' : undefined,
    'data-text-value': textValue,
    'data-zui-menu-item': '',
    id: itemId,
    onClick: handleClick,
    onFocus: handleFocus,
    onPointerEnter: handlePointerEnter,
    ref,
    role: 'menuitem' as const,
    tabIndex: snapshot.open && highlighted ? 0 : -1,
  }

  if (isLink) {
    const { href, ...anchorProps } = props as AnchorHTMLAttributes<HTMLAnchorElement>
    return (
      <a
        {...anchorProps}
        {...commonProps}
        aria-disabled={snapshot.disabled || disabled ? 'true' : undefined}
        href={href}
      />
    )
  }

  const buttonProps = props as ButtonHTMLAttributes<HTMLButtonElement>
  return (
    <button
      {...buttonProps}
      {...commonProps}
      disabled={snapshot.disabled || disabled}
      type={buttonProps.type ?? 'button'}
    />
  )
}
