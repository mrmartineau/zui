import type { HTMLAttributes } from 'react'

export type CodeProps = HTMLAttributes<HTMLElement> & {
  className?: string
}

export function Code({ className, children, ...props }: CodeProps) {
  const classes = ['zui-code', className].filter(Boolean).join(' ')
  return (
    <code className={classes} {...props}>
      {children}
    </code>
  )
}
