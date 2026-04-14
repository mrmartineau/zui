<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLDialogAttributes } from 'svelte/elements'
  import type { VariantProps } from 'cva'
  import { dialogVariants } from '../shared/dialogVariants'

  type DialogVariantProps = VariantProps<typeof dialogVariants>

  type Props = HTMLDialogAttributes & {
    class?: string
    open?: boolean
    size?: DialogVariantProps['size']
    position?: DialogVariantProps['position']
    /** Controls how the dialog can be dismissed. Defaults to `"any"`. */
    closedby?: 'any' | 'closerequest' | 'none'
    onclose?: (event: Event) => void
    children?: Snippet
  }

  let {
    class: className,
    open = false,
    size,
    position,
    closedby = 'any',
    onclose,
    children,
    ...rest
  }: Props = $props()

  let dialogRef = $state<HTMLDialogElement | null>(null)
  const classes = $derived(dialogVariants({ size, position, className }))

  $effect(() => {
    if (!dialogRef) return
    if (open) {
      if (!dialogRef.open) dialogRef.showModal()
    } else if (dialogRef.open) {
      dialogRef.close()
    }
  })

  $effect(() => {
    if (!dialogRef) return
    dialogRef.setAttribute('closedby', closedby ?? 'any')
  })
</script>

<dialog
  bind:this={dialogRef}
  class={classes}
  onclose={onclose}
  {...rest}
>
  {@render children?.()}
</dialog>
