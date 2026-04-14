import { cva } from 'cva'

export const avatarVariants = cva({
  base: 'zui-avatar',
  defaultVariants: {
    shape: 'default',
    size: 'md',
  },
  variants: {
    shape: {
      default: '',
      hard: 'zui-avatar-shape-hard',
      soft: 'zui-avatar-shape-soft',
      squircle: 'zui-avatar-shape-squircle',
    },
    size: {
      lg: 'zui-avatar-size-lg',
      md: '',
      sm: 'zui-avatar-size-sm',
    },
  },
})
