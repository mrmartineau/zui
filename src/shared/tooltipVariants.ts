import { cva } from 'cva'

export const tooltipVariants = cva({
  base: 'zui-tooltip',
  defaultVariants: {
    placement: 'top',
  },
  variants: {
    placement: {
      bottom: 'zui-tooltip-placement-bottom',
      left: 'zui-tooltip-placement-left',
      right: 'zui-tooltip-placement-right',
      top: 'zui-tooltip-placement-top',
    },
  },
})
