import type { HTMLAttributes } from 'react'

export type AccordionContentProps = HTMLAttributes<HTMLDivElement>

export function AccordionContent({ className, ...props }: AccordionContentProps) {
  const classes = ['zui-accordion-content', className].filter(Boolean).join(' ')
  return <div className={classes} {...props} />
}
