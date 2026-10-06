import type { VariantProps } from 'cva'
import type { AnchorHTMLAttributes, HTMLAttributes } from 'react'
import { cardVariants } from '../shared/cardVariants'

type CardBaseProps = VariantProps<typeof cardVariants> & {
  className?: string
}

type CardAsDiv = CardBaseProps &
  HTMLAttributes<HTMLDivElement> & {
    href?: never
  }

type CardAsAnchor = CardBaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string
  }

export type CardProps = CardAsDiv | CardAsAnchor

export function Card({ className, shape, ...props }: CardProps) {
  const classes = cardVariants({
    className: [
      'href' in props && props.href && 'zui-card-interactive',
      className,
    ]
      .filter(Boolean)
      .join(' '),
    shape,
  })

  if ('href' in props && props.href) {
    return (
      <a
        className={classes}
        {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
      />
    )
  }

  return (
    <div className={classes} {...(props as HTMLAttributes<HTMLDivElement>)} />
  )
}
