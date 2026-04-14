import { cva } from 'cva'

export const badgeVariants = cva({
  base: 'zui-badge',
  defaultVariants: {
    color: 'default',
    variant: 'subtle',
  },
  variants: {
    color: {
      amber: 'zui-badge-color-amber',
      blue: 'zui-badge-color-blue',
      cyan: 'zui-badge-color-cyan',
      default: '',
      emerald: 'zui-badge-color-emerald',
      fuchsia: 'zui-badge-color-fuchsia',
      gray: 'zui-badge-color-gray',
      green: 'zui-badge-color-green',
      indigo: 'zui-badge-color-indigo',
      lime: 'zui-badge-color-lime',
      orange: 'zui-badge-color-orange',
      pink: 'zui-badge-color-pink',
      purple: 'zui-badge-color-purple',
      red: 'zui-badge-color-red',
      rose: 'zui-badge-color-rose',
      sky: 'zui-badge-color-sky',
      teal: 'zui-badge-color-teal',
      violet: 'zui-badge-color-violet',
      yellow: 'zui-badge-color-yellow',
    },
    variant: {
      fill: 'zui-badge-variant-fill',
      outline: 'zui-badge-variant-outline',
      subtle: '',
    },
  },
})
