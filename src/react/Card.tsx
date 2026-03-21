import type { HTMLAttributes, AnchorHTMLAttributes } from 'react'

type CardBaseProps = {
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

export function Card({ className, ...props }: CardProps) {
  const classes = ['zui-card', 'href' in props && props.href && 'zui-card-interactive', className].filter(Boolean).join(' ')

  if ('href' in props && props.href) {
    return <a className={classes} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)} />
  }

  return <div className={classes} {...(props as HTMLAttributes<HTMLDivElement>)} />
}
