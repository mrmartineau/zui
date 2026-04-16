import { cva } from 'cva'

export const buttonVariants = cva({
  base: 'zui-button',
  defaultVariants: {
    color: 'theme',
    icon: false,
    shape: 'default',
    size: 'md',
    variant: 'fill',
  },
  variants: {
    color: {
      accent: 'zui-button-color-accent',
      destructive: 'zui-button-color-destructive',
      theme: 'zui-button-color-theme',
    },
    icon: {
      false: '',
      true: 'zui-button-icon',
    },
    shape: {
      default: '',
      hard: 'zui-button-shape-hard',
      soft: 'zui-button-shape-soft',
      squircle: 'zui-button-shape-squircle',
    },
    size: {
      lg: 'zui-button-size-lg',
      md: '',
      sm: 'zui-button-size-sm',
      xl: 'zui-button-size-xl',
      xs: 'zui-button-size-xs',
    },
    variant: {
      fill: 'zui-button-variant-fill',
      ghost: 'zui-button-variant-ghost',
      link: 'zui-button-variant-link',
      outline: 'zui-button-variant-outline',
      subtle: 'zui-button-variant-subtle',
    },
  },
})
