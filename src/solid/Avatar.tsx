import type { JSX } from 'solid-js'
import { splitProps, createSignal, Show } from 'solid-js'
import type { VariantProps } from 'cva'
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
		avatarVariants({ size: local.size, shape: local.shape, className: local.class })

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
