<script lang="ts">
import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'
import { getMenuContext } from './menuContext'

type Props = HTMLAttributes<HTMLDivElement> & {
  class?: string
  children?: Snippet
}

let { class: className, children, onkeydown, ...rest }: Props = $props()
const { controller, getSnapshot } = getMenuContext()
const contentId = controller.getSnapshot().contentId
let ref = $state<HTMLDivElement | undefined>()

$effect(() => controller.registerContent({ contentId, element: ref ?? null }))
</script>

<div
  {...rest}
  bind:this={ref}
  aria-labelledby={getSnapshot().triggerId}
  class={['zui-menu-content', className].filter(Boolean).join(' ')}
  data-align={getSnapshot().align}
  data-side={getSnapshot().side}
  data-state={getSnapshot().open ? 'open' : 'closed'}
  data-zui-menu-content=""
  hidden={!getSnapshot().open}
  id={getSnapshot().contentId}
  on:keydown={(event) => {
    onkeydown?.(event)
    if (!event.defaultPrevented) controller.handleContentKeydown(event)
  }}
  role="menu"
>
  {@render children?.()}
</div>
