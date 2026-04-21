import type { VariantProps } from 'cva'
import type { JSX } from 'solid-js'
import { createEffect, onCleanup, splitProps } from 'solid-js'
import { buttonVariants } from '../shared/buttonVariants'
import { useMenuContext } from './menuContext'

type ButtonVariantProps = VariantProps<typeof buttonVariants>

export type MenuTriggerProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonVariantProps

export function MenuTrigger(props: MenuTriggerProps) {
  const [local, rest] = splitProps(props, [
    'class',
    'disabled',
    'onClick',
    'onKeyDown',
    'variant',
    'color',
    'size',
    'shape',
    'icon',
  ])
  const { controller, snapshot } = useMenuContext()
  let ref: HTMLButtonElement | undefined

  createEffect(() => {
    const unregister = controller.registerTrigger({
      disabled: local.disabled ?? false,
      element: ref ?? null,
      triggerId: snapshot().triggerId,
    })
    onCleanup(unregister)
  })

  const classes = () =>
    buttonVariants({
      className: ['zui-menu-trigger', local.class].filter(Boolean).join(' '),
      color: local.color,
      icon: local.icon,
      shape: local.shape,
      size: local.size,
      variant: local.variant ?? 'outline',
    })

  return (
    <button
      {...rest}
      ref={ref}
      aria-controls={snapshot().contentId}
      aria-expanded={snapshot().open}
      aria-haspopup="menu"
      class={classes()}
      data-disabled={snapshot().triggerDisabled ? 'true' : undefined}
      data-state={snapshot().open ? 'open' : 'closed'}
      data-zui-menu-trigger=""
      disabled={snapshot().disabled || local.disabled}
      id={snapshot().triggerId}
      onClick={(event) => {
        local.onClick?.(event)
        if (!event.defaultPrevented) controller.handleTriggerClick()
      }}
      onKeyDown={(event) => {
        local.onKeyDown?.(event)
        if (!event.defaultPrevented) controller.handleTriggerKeydown(event)
      }}
      type="button"
    />
  )
}
