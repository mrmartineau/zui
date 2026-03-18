import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react'

type ButtonBaseProps = {
  className?: string
}

type ButtonAsButton = ButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never
  }

type ButtonAsAnchor = ButtonBaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string
  }

export type ButtonProps = ButtonAsButton | ButtonAsAnchor

export function Button({ className, ...props }: ButtonProps) {
  const classes = ['zui-button', className].filter(Boolean).join(' ')

  if ('href' in props && props.href) {
    return <a className={classes} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)} />
  }

  return <button className={classes} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)} />
}
