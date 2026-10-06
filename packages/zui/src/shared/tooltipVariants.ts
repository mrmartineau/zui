import { cva } from 'cva'

export const tooltipVariants = cva({
  base: 'zui-tooltip',
  defaultVariants: {
    placement: 'top',
    shape: 'default',
  },
  variants: {
    placement: {
      bottom: 'zui-tooltip-placement-bottom',
      left: 'zui-tooltip-placement-left',
      right: 'zui-tooltip-placement-right',
      top: 'zui-tooltip-placement-top',
    },
    shape: {
      default: '',
      hard: 'zui-tooltip-shape-hard',
      soft: 'zui-tooltip-shape-soft',
      squircle: 'zui-tooltip-shape-squircle',
    },
  },
})
