import type { JSX } from 'solid-js'
import { splitProps, createEffect } from 'solid-js'
import type { VariantProps } from 'cva'
import { dialogVariants } from '../shared/dialogVariants'

type DialogVariantProps = VariantProps<typeof dialogVariants>

export type DialogProps = JSX.DialogHtmlAttributes<HTMLDialogElement> &
	DialogVariantProps & {
		open?: boolean
		onClose?: () => void
		closedby?: 'any' | 'closerequest' | 'none'
	}

export function Dialog(props: DialogProps) {
	let ref: HTMLDialogElement | undefined
	const [local, rest] = splitProps(props, [
		'open',
		'onClose',
		'class',
		'size',
		'closedby',
		'children',
	])
	const classes = () => dialogVariants({ size: local.size, className: local.class })

	createEffect(() => {
		if (local.open) {
			ref?.showModal()
		} else {
			ref?.close()
		}
	})

	createEffect(() => {
		ref?.setAttribute('closedby', local.closedby ?? 'any')
	})

	return (
		<dialog ref={ref} class={classes()} onClose={local.onClose} {...rest}>
			{local.children}
		</dialog>
	)
}
