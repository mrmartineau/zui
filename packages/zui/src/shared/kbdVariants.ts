import { cva } from 'cva'

export const kbdVariants = cva({
  base: 'zui-kbd',
  defaultVariants: {
    shape: 'default',
  },
  variants: {
    shape: {
      default: '',
      hard: 'zui-kbd-shape-hard',
      soft: 'zui-kbd-shape-soft',
      squircle: 'zui-kbd-shape-squircle',
    },
  },
})
