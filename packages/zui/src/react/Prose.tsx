import type { HTMLAttributes } from 'react'

export type ProseProps = HTMLAttributes<HTMLDivElement> & {
  className?: string
}

export function Prose({ className, children, ...props }: ProseProps) {
  const classes = ['prose', className].filter(Boolean).join(' ')
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}
