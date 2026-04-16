import type { VariantProps } from 'cva'
import type { JSX } from 'solid-js'
import { createSignal, Show, splitProps } from 'solid-js'
import { avatarVariants } from '../shared/avatarVariants'

type AvatarVariantProps = VariantProps<typeof avatarVariants>

export type AvatarProps = JSX.HTMLAttributes<HTMLSpanElement> &
  AvatarVariantProps & {
    src?: string
    alt?: string
    fallback?: JSX.Element
    class?: string
  }

export function Avatar(props: AvatarProps) {
  const [imageError, setImageError] = createSignal(false)
  const [local, rest] = splitProps(props, [
    'class',
    'size',
    'shape',
    'src',
    'alt',
    'fallback',
    'children',
  ])
  const classes = () =>
    avatarVariants({
      className: local.class,
      shape: local.shape,
      size: local.size,
    })

  return (
    <span class={classes()} {...rest}>
      <span class="zui-avatar-fallback">
        {local.fallback ?? <i class="ph ph-user" aria-hidden="true" />}
      </span>
      <Show when={local.src && !imageError()}>
        <img
          class="zui-avatar-image"
          src={local.src}
          alt={local.alt ?? ''}
          onError={() => setImageError(true)}
        />
      </Show>
    </span>
  )
}
