import type { HTMLAttributes } from 'react'

export type AccordionProps = HTMLAttributes<HTMLDivElement> & {
  flush?: boolean
}

export function Accordion({ className, flush, ...props }: AccordionProps) {
  const classes = ['zui-accordion', flush && 'zui-accordion-flush', className]
    .filter(Boolean)
    .join(' ')
  return <div className={classes} {...props} />
}
