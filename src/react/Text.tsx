import type { HTMLAttributes } from 'react'
import { textSizeClass, type TextSize } from '../shared/textSizeClass'

export type TextProps = HTMLAttributes<HTMLSpanElement> & {
  size?: TextSize
  className?: string
}

export function Text({ size = 'base', className, children, ...props }: TextProps) {
  const classes = [textSizeClass(size), className].filter(Boolean).join(' ')
  return <span className={classes} {...props}>{children}</span>
}
