import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'

export type TextareaProps = JSX.TextareaHTMLAttributes<HTMLTextAreaElement> & {
	class?: string
}

export function Textarea(props: TextareaProps) {
	const [local, rest] = splitProps(props, ['class'])
	const classes = () => ['zui-textarea', local.class].filter(Boolean).join(' ')
	return <textarea class={classes()} {...rest} />
}
