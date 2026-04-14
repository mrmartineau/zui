import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'

export type AccordionContentProps = JSX.HTMLAttributes<HTMLDivElement>

export function AccordionContent(props: AccordionContentProps) {
  const [local, rest] = splitProps(props, ['class'])
  const classes = () =>
    ['zui-accordion-content', local.class].filter(Boolean).join(' ')
  return <div class={classes()} {...rest} />
}
