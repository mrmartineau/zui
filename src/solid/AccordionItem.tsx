import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'

export type AccordionItemProps = JSX.DetailsHtmlAttributes<HTMLDetailsElement> & {
	open?: boolean
	name?: string
}

export function AccordionItem(props: AccordionItemProps) {
	const [local, rest] = splitProps(props, ['class'])
	const classes = () =>
		['zui-accordion-item', local.class].filter(Boolean).join(' ')
	return <details class={classes()} {...rest} />
}
