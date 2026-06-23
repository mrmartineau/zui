import { cva } from 'cva'

export const fieldLegendVariants = cva({
  base: 'zui-field-legend',
  defaultVariants: {
    variant: 'legend',
  },
  variants: {
    variant: {
      label: 'zui-field-legend-label',
      legend: '',
    },
  },
})
