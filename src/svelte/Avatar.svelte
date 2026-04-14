<script lang="ts">
import type { VariantProps } from 'cva'
import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'
import { avatarVariants } from '../shared/avatarVariants'

type AvatarVariantProps = VariantProps<typeof avatarVariants>

type Props = HTMLAttributes<HTMLSpanElement> & {
  class?: string
  src?: string
  alt?: string
  size?: AvatarVariantProps['size']
  shape?: AvatarVariantProps['shape']
  fallback?: Snippet
}

let {
  class: className,
  src,
  alt,
  size,
  shape,
  fallback,
  ...rest
}: Props = $props()

let imageError = $state(false)
const classes = $derived(avatarVariants({ className, shape, size }))
</script>

<span class={classes} {...rest}>
  <span class="zui-avatar-fallback">
    {#if fallback}
      {@render fallback()}
    {:else}
      <i class="ph ph-user" aria-hidden="true"></i>
    {/if}
  </span>
  {#if src && !imageError}
    <img
      class="zui-avatar-image"
      {src}
      alt={alt ?? ''}
      onerror={() => (imageError = true)}
    />
  {/if}
</span>
