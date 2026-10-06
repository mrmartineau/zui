import type { VariantProps } from 'cva'
import type { JSX } from 'solid-js'
import {
  createEffect,
  createSignal,
  createUniqueId,
  onCleanup,
  onMount,
  splitProps,
} from 'solid-js'
import {
  createMenuController,
  type MenuAlign,
  type MenuDirection,
  type MenuSide,
} from '../core/menu'
import { menuVariants } from '../shared/menuVariants'
import { MenuContext } from './menuContext'

type MenuVariantProps = VariantProps<typeof menuVariants>

export type MenuProps = JSX.HTMLAttributes<HTMLDivElement> & {
  align?: MenuAlign
  defaultOpen?: boolean
  dir?: MenuDirection
  disabled?: boolean
  id?: string
  modal?: boolean
  onOpenChange?: (open: boolean) => void
  open?: boolean
  shape?: MenuVariantProps['shape']
  side?: MenuSide
}

export function Menu(props: MenuProps) {
  const [local, rest] = splitProps(props, [
    'align',
    'children',
    'class',
    'defaultOpen',
    'dir',
    'disabled',
    'id',
    'modal',
    'onOpenChange',
    'open',
    'shape',
    'side',
  ])
  const generatedId = createUniqueId()
  const rootId = () => local.id ?? `zui-menu-${generatedId}`

  const controller = createMenuController({
    align: local.align,
    defaultOpen: local.defaultOpen,
    dir: local.dir,
    disabled: local.disabled,
    id: rootId(),
    modal: local.modal,
    onOpenChange: local.onOpenChange,
    open: local.open,
    side: local.side,
  })

  const [rootRef, setRootRef] = createSignal<HTMLDivElement>()
  const [snapshot, setSnapshot] = createSignal(controller.getSnapshot())
  const unsubscribe = controller.subscribe((next) => setSnapshot(next))

  createEffect(() => {
    controller.setOptions({
      align: local.align,
      defaultOpen: local.defaultOpen,
      dir: local.dir,
      disabled: local.disabled,
      id: rootId(),
      modal: local.modal,
      onOpenChange: local.onOpenChange,
      open: local.open,
      side: local.side,
    })
  })

  onMount(() => {
    const onPointerDown = (event: PointerEvent) =>
      controller.handleDocumentPointerDown(event.target)
    document.addEventListener('pointerdown', onPointerDown)
    onCleanup(() => {
      document.removeEventListener('pointerdown', onPointerDown)
    })
  })

  onCleanup(() => {
    unsubscribe()
  })

  return (
    <MenuContext.Provider value={{ controller, rootRef, snapshot }}>
      <div
        {...rest}
        ref={setRootRef}
        class={menuVariants({ class: local.class, shape: local.shape })}
        data-align={snapshot().align}
        data-disabled={snapshot().disabled ? 'true' : undefined}
        data-side={snapshot().side}
        data-state={snapshot().open ? 'open' : 'closed'}
        data-zui-menu-root=""
        id={snapshot().rootId}
      >
        {local.children}
      </div>
    </MenuContext.Provider>
  )
}
