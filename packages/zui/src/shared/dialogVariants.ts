import { cva } from 'cva'

export const dialogVariants = cva({
  base: 'zui-dialog',
  defaultVariants: {
    shape: 'default',
    size: 'md',
  },
  variants: {
    position: {
      bottom: 'zui-dialog-position-bottom',
      center: '',
      central: 'zui-dialog-position-central',
      left: 'zui-dialog-position-left',
      right: 'zui-dialog-position-right',
      top: 'zui-dialog-position-top',
    },
    shape: {
      default: '',
      hard: 'zui-dialog-shape-hard',
      squircle: 'zui-dialog-shape-squircle',
    },
    size: {
      full: 'zui-dialog-size-full',
      lg: 'zui-dialog-size-lg',
      md: '',
      sm: 'zui-dialog-size-sm',
    },
  },
})
