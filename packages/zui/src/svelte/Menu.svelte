<script lang="ts">
import type { VariantProps } from 'cva'
import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'
import {
  createMenuController,
  type MenuAlign,
  type MenuDirection,
  type MenuSide,
} from '../core/menu'
import { menuVariants } from '../shared/menuVariants'
import { setMenuContext } from './menuContext'

type MenuVariantProps = VariantProps<typeof menuVariants>

type Props = HTMLAttributes<HTMLDivElement> & {
  align?: MenuAlign
  defaultOpen?: boolean
  dir?: MenuDirection
  disabled?: boolean
  id?: string
  modal?: boolean
  onOpenChange?: (open: boolean) => void
  open?: boolean
  side?: MenuSide
  shape?: MenuVariantProps['shape']
  class?: string
  children?: Snippet
}

let {
  align,
  class: className,
  defaultOpen,
  dir,
  disabled,
  id,
  modal,
  onOpenChange,
  open,
  shape,
  side,
  children,
  ...rest
}: Props = $props()

let root = $state<HTMLDivElement | undefined>()
const controller = createMenuController({
  align,
  defaultOpen,
  dir,
  disabled,
  id,
  modal,
  onOpenChange,
  open,
  side,
})
let snapshot = $state(controller.getSnapshot())

const unsubscribe = controller.subscribe((next) => {
  snapshot = next
})

$effect(() => {
  controller.setOptions({
    align,
    defaultOpen,
    dir,
    disabled,
    id,
    modal,
    onOpenChange,
    open,
    side,
  })
})

$effect(() => {
  const onPointerDown = (event: PointerEvent) =>
    controller.handleDocumentPointerDown(event.target)
  document.addEventListener('pointerdown', onPointerDown)
  return () => document.removeEventListener('pointerdown', onPointerDown)
})

$effect(() => unsubscribe)

setMenuContext({
  controller,
  getRoot: () => root,
  getSnapshot: () => snapshot,
})
</script>

<div
  {...rest}
  bind:this={root}
  class={menuVariants({ className, shape })}
  data-align={snapshot.align}
  data-disabled={snapshot.disabled ? 'true' : undefined}
  data-side={snapshot.side}
  data-state={snapshot.open ? 'open' : 'closed'}
  data-zui-menu-root=""
  id={snapshot.rootId}
>
  {@render children?.()}
</div>
