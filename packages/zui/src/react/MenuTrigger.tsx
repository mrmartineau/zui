import type { VariantProps } from 'cva'
import type { ButtonHTMLAttributes } from 'react'
import { useEffect, useRef } from 'react'
import { buttonVariants } from '../shared/buttonVariants'
import { useMenuContext, useMenuSnapshot } from './menuContext'

type ButtonVariantProps = VariantProps<typeof buttonVariants>

export type MenuTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonVariantProps

export function MenuTrigger({
  className,
  disabled = false,
  onClick,
  onKeyDown,
  variant = 'outline',
  color,
  size,
  shape,
  icon,
  ...props
}: MenuTriggerProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const { controller } = useMenuContext()
  const snapshot = useMenuSnapshot()
  const classes = buttonVariants({
    className: ['zui-menu-trigger', className].filter(Boolean).join(' '),
    color,
    icon,
    shape,
    size,
    variant,
  })

  useEffect(() => {
    return controller.registerTrigger({
      disabled,
      element: ref.current,
      triggerId: snapshot.triggerId,
    })
  }, [controller, disabled, snapshot.triggerId])

  return (
    <button
      {...props}
      ref={ref}
      aria-controls={snapshot.contentId}
      aria-expanded={snapshot.open}
      aria-haspopup="menu"
      className={classes}
      data-disabled={snapshot.triggerDisabled ? 'true' : undefined}
      data-state={snapshot.open ? 'open' : 'closed'}
      data-zui-menu-trigger=""
      disabled={snapshot.disabled || disabled}
      id={snapshot.triggerId}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) controller.handleTriggerClick()
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (!event.defaultPrevented) controller.handleTriggerKeydown(event.nativeEvent)
      }}
      type="button"
    />
  )
}
