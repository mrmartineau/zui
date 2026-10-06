<script lang="ts">
import type { VariantProps } from 'cva'
import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'
import { collapsibleVariants } from '../shared/collapsibleVariants'

type CollapsibleVariantProps = VariantProps<typeof collapsibleVariants>

type Props = HTMLAttributes<HTMLDetailsElement> & {
  class?: string
  shape?: CollapsibleVariantProps['shape']
  children?: Snippet
}

let { class: className, shape, children, ...rest }: Props = $props()

const classes = $derived(collapsibleVariants({ className, shape }))
</script>

<details class={classes} {...rest}>
  {@render children?.()}
</details>
