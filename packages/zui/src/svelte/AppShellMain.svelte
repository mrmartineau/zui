<script lang="ts">
import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'
import { appShellMainVariants } from '../shared/appShellVariants'
import { useAppShellContext } from './appShellContext'

type Props = HTMLAttributes<HTMLElement> & {
  class?: string
  children?: Snippet
}

let { class: className, id, children, ...rest }: Props = $props()
const ctx = useAppShellContext('AppShellMain')
const classes = $derived(appShellMainVariants({ class: className }))
</script>

<main id={id ?? ctx.mainId} class={classes} {...rest}>
  {@render children?.()}
</main>
