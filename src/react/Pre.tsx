import type { HTMLAttributes } from 'react'

export type PreProps = HTMLAttributes<HTMLPreElement> & {
  className?: string
}

export function Pre({ className, children, ...props }: PreProps) {
  const classes = ['zui-pre', className].filter(Boolean).join(' ')
  return (
    <pre className={classes} {...props}>
      {children}
    </pre>
  )
}
