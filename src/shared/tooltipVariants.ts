import { cva } from 'cva'

export const tooltipVariants = cva({
  base: 'zui-tooltip',
  variants: {
    placement: {
      top: 'zui-tooltip-placement-top',
      bottom: 'zui-tooltip-placement-bottom',
      left: 'zui-tooltip-placement-left',
      right: 'zui-tooltip-placement-right',
    },
  },
  defaultVariants: {
    placement: 'top',
  },
})
