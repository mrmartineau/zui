import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react'
import type { VariantProps } from 'cva'
import { buttonVariants } from '../shared/buttonVariants'

type ButtonVariantProps = VariantProps<typeof buttonVariants>

type MenuItemBase = ButtonVariantProps & { className?: string }

type MenuItemAsButton = MenuItemBase &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never
  }

type MenuItemAsAnchor = MenuItemBase &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string
  }

export type MenuItemProps = MenuItemAsButton | MenuItemAsAnchor

export function MenuItem({ className, variant = 'ghost', color, size, shape, icon, ...props }: MenuItemProps) {
  const classes = buttonVariants({ variant, color, size, shape, icon, className: ['zui-menu-item', className].filter(Boolean).join(' ') })

  if ('href' in props && props.href) {
    return <a className={classes} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)} />
  }

  return <button className={classes} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)} />
}
