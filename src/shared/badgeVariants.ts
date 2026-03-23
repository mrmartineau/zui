import { cva } from 'cva'

export const badgeVariants = cva({
  base: 'zui-badge',
  variants: {
    variant: {
      subtle: '',
      fill: 'zui-badge-variant-fill',
      outline: 'zui-badge-variant-outline',
    },
    color: {
      default: '',
      red: 'zui-badge-color-red',
      orange: 'zui-badge-color-orange',
      amber: 'zui-badge-color-amber',
      yellow: 'zui-badge-color-yellow',
      lime: 'zui-badge-color-lime',
      green: 'zui-badge-color-green',
      emerald: 'zui-badge-color-emerald',
      teal: 'zui-badge-color-teal',
      cyan: 'zui-badge-color-cyan',
      sky: 'zui-badge-color-sky',
      blue: 'zui-badge-color-blue',
      indigo: 'zui-badge-color-indigo',
      violet: 'zui-badge-color-violet',
      purple: 'zui-badge-color-purple',
      fuchsia: 'zui-badge-color-fuchsia',
      pink: 'zui-badge-color-pink',
      rose: 'zui-badge-color-rose',
      gray: 'zui-badge-color-gray',
    },
  },
  defaultVariants: {
    variant: 'subtle',
    color: 'default',
  },
})
