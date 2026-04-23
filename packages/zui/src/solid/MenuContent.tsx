import type { JSX } from 'solid-js'
import { createEffect, onCleanup, splitProps } from 'solid-js'
import { useMenuContext } from './menuContext'

export type MenuContentProps = JSX.HTMLAttributes<HTMLDivElement>

export function MenuContent(props: MenuContentProps) {
  const [local, rest] = splitProps(props, ['class', 'onKeyDown'])
  const { controller, snapshot } = useMenuContext()
  const contentId = controller.getSnapshot().contentId
  let ref: HTMLDivElement | undefined

  createEffect(() => {
    const unregister = controller.registerContent({
      contentId,
      element: ref ?? null,
    })
    onCleanup(unregister)
  })

  return (
    <div
      {...rest}
      ref={ref}
      aria-labelledby={snapshot().triggerId}
      class={['zui-menu-content', local.class].filter(Boolean).join(' ')}
      data-align={snapshot().align}
      data-side={snapshot().side}
      data-state={snapshot().open ? 'open' : 'closed'}
      data-zui-menu-content=""
      hidden={!snapshot().open}
      id={snapshot().contentId}
      onKeyDown={(event) => {
        local.onKeyDown?.(event)
        if (!event.defaultPrevented) controller.handleContentKeydown(event)
      }}
      role="menu"
    />
  )
}
