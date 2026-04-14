<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import type { VariantProps } from 'cva'
  import { tooltipVariants } from '../shared/tooltipVariants'

  type TooltipVariantProps = VariantProps<typeof tooltipVariants>

  type Props = HTMLAttributes<HTMLSpanElement> & {
    text: string
    class?: string
    placement?: TooltipVariantProps['placement']
    children?: Snippet
  }

  let {
    text,
    class: className,
    placement,
    children,
    ...rest
  }: Props = $props()

  const id = `tooltip-${Math.random().toString(36).slice(2, 9)}`
  const anchorName = `--${id}`
  let popoverEl = $state<HTMLSpanElement | null>(null)

  const contentClass = $derived(
    [
      'zui-tooltip-content',
      tooltipVariants({ placement })
        .split(' ')
        .find((c: string) => c.startsWith('zui-tooltip-placement-')),
    ]
      .filter(Boolean)
      .join(' '),
  )

  const wrapperClass = $derived(
    ['zui-tooltip', className].filter(Boolean).join(' '),
  )

  const show = () => popoverEl?.showPopover()
  const hide = () => popoverEl?.hidePopover()
</script>

<span class={wrapperClass} {...rest}>
  <span
    style="anchor-name: {anchorName};"
    onmouseenter={show}
    onmouseleave={hide}
    onfocusin={show}
    onfocusout={hide}
  >
    {@render children?.()}
  </span>
  <span
    bind:this={popoverEl}
    popover="manual"
    {id}
    class={contentClass}
    role="tooltip"
    style="position-anchor: {anchorName};"
  >
    {text}
  </span>
</span>
