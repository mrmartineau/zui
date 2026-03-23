import { cva } from 'cva'

export const buttonVariants = cva({
  base: 'zui-button',
  variants: {
    variant: {
      fill: 'zui-button-variant-fill',
      subtle: 'zui-button-variant-subtle',
      outline: 'zui-button-variant-outline',
      ghost: 'zui-button-variant-ghost',
      link: 'zui-button-variant-link',
    },
    color: {
      theme: 'zui-button-color-theme',
      accent: 'zui-button-color-accent',
      destructive: 'zui-button-color-destructive',
    },
    size: {
      xs: 'zui-button-size-xs',
      sm: 'zui-button-size-sm',
      md: '',
      lg: 'zui-button-size-lg',
      xl: 'zui-button-size-xl',
    },
    shape: {
      default: '',
      hard: 'zui-button-shape-hard',
      soft: 'zui-button-shape-soft',
      squircle: 'zui-button-shape-squircle',
    },
    icon: {
      true: 'zui-button-icon',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'fill',
    color: 'theme',
    size: 'md',
    shape: 'default',
    icon: false,
  },
})
