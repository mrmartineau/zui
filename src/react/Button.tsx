import type { VariantProps } from 'cva'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'
import { buttonVariants } from '../shared/buttonVariants'

type ButtonVariantProps = VariantProps<typeof buttonVariants>

type ButtonBaseProps = ButtonVariantProps & {
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

export function Button({
  className,
  variant,
  color,
  size,
  shape,
  icon,
  ...props
}: ButtonProps) {
  const classes = buttonVariants({
    className,
    color,
    icon,
    shape,
    size,
    variant,
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
    <button
      className={classes}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    />
  )
}
