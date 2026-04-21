import type { HTMLAttributes } from 'react'
import { useEffect, useRef } from 'react'
import { useMenuContext, useMenuSnapshot } from './menuContext'

export type MenuContentProps = HTMLAttributes<HTMLDivElement>

export function MenuContent({ className, onKeyDown, ...props }: MenuContentProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { controller } = useMenuContext()
  const snapshot = useMenuSnapshot()

  useEffect(() => {
    return controller.registerContent({
      contentId: snapshot.contentId,
      element: ref.current,
    })
  }, [controller, snapshot.contentId])

  return (
    <div
      {...props}
      ref={ref}
      aria-labelledby={snapshot.triggerId}
      className={['zui-menu-content', className].filter(Boolean).join(' ')}
      data-align={snapshot.align}
      data-side={snapshot.side}
      data-state={snapshot.open ? 'open' : 'closed'}
      data-zui-menu-content=""
      hidden={!snapshot.open}
      id={snapshot.contentId}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (!event.defaultPrevented) controller.handleContentKeydown(event.nativeEvent)
      }}
      role="menu"
    />
  )
}
