import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'

export type AccordionTriggerProps = JSX.HTMLAttributes<HTMLElement>

export function AccordionTrigger(props: AccordionTriggerProps) {
  const [local, rest] = splitProps(props, ['class'])
  const classes = () =>
    ['zui-accordion-trigger', local.class].filter(Boolean).join(' ')
  return <summary class={classes()} {...rest} />
}
