import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'

export type AccordionProps = JSX.HTMLAttributes<HTMLDivElement> & {
	flush?: boolean
}

export function Accordion(props: AccordionProps) {
	const [local, rest] = splitProps(props, ['class', 'flush'])
	const classes = () =>
		['zui-accordion', local.flush && 'zui-accordion-flush', local.class]
			.filter(Boolean)
			.join(' ')
	return <div class={classes()} {...rest} />
}
