import type { HTMLAttributes } from 'react'
import { type TextSize, textSizeClass } from '../shared/textSizeClass'

export type TextProps = HTMLAttributes<HTMLSpanElement> & {
  size?: TextSize
  className?: string
}

export function Text({ size = '0', className, children, ...props }: TextProps) {
  const classes = [textSizeClass(size), className].filter(Boolean).join(' ')
  return (
    <span className={classes} {...props}>
      {children}
    </span>
  )
}
