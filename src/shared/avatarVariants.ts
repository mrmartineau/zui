import { cva } from 'cva'

export const avatarVariants = cva({
  base: 'zui-avatar',
  variants: {
    size: {
      sm: 'zui-avatar-size-sm',
      md: '',
      lg: 'zui-avatar-size-lg',
    },
    shape: {
      default: '',
      hard: 'zui-avatar-shape-hard',
      soft: 'zui-avatar-shape-soft',
      squircle: 'zui-avatar-shape-squircle',
    },
  },
  defaultVariants: {
    size: 'md',
    shape: 'default',
  },
})
