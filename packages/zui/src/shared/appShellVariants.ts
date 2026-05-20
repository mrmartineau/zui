import { cva } from 'cva'

export const appShellVariants = cva({
  base: 'zui-app-shell',
  defaultVariants: {
    position: 'left',
  },
  variants: {
    position: {
      left: '',
      right: 'zui-app-shell-position-right',
    },
  },
})

export const appShellSidebarVariants = cva({
  base: 'zui-app-shell-sidebar',
})

export const appShellSidebarHeaderVariants = cva({
  base: 'zui-app-shell-sidebar-header',
})

export const appShellSidebarBodyVariants = cva({
  base: 'zui-app-shell-sidebar-body',
})

export const appShellSidebarFooterVariants = cva({
  base: 'zui-app-shell-sidebar-footer',
})

export const appShellHeaderVariants = cva({
  base: 'zui-app-shell-header',
})

export const appShellMainVariants = cva({
  base: 'zui-app-shell-main',
})
