import type { HTMLAttributes } from 'react'

export type AccordionTriggerProps = HTMLAttributes<HTMLElement>

export function AccordionTrigger({ className, ...props }: AccordionTriggerProps) {
  const classes = ['zui-accordion-trigger', className].filter(Boolean).join(' ')
  return <summary className={classes} {...props} />
}
