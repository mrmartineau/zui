import type { HTMLAttributes } from 'react'

export type AccordionItemProps = HTMLAttributes<HTMLDetailsElement> & {
  open?: boolean
  name?: string
}

export function AccordionItem({ className, ...props }: AccordionItemProps) {
  const classes = ['zui-accordion-item', className].filter(Boolean).join(' ')
  return <details className={classes} {...props} />
}
