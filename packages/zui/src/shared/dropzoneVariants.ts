import { cva } from 'cva'

export const dropzoneVariants = cva({
  base: 'zui-dropzone',
  defaultVariants: {
    shape: 'default',
  },
  variants: {
    shape: {
      default: '',
      hard: 'zui-dropzone-shape-hard',
      squircle: 'zui-dropzone-shape-squircle',
    },
  },
})
