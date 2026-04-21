import { cva } from 'cva'

export const tabsVariants = cva({
  base: 'zui-tabs',
})

export const tabsListVariants = cva({
  base: 'zui-tabs-list',
  defaultVariants: {
    variant: 'surface',
  },
  variants: {
    variant: {
      surface: '',
      underline: 'zui-tabs-list-variant-underline',
    },
  },
})

export const tabsTriggerVariants = cva({
  base: 'zui-tabs-trigger',
  defaultVariants: {
    variant: 'surface',
  },
  variants: {
    variant: {
      surface: '',
      underline: 'zui-tabs-trigger-variant-underline',
    },
  },
})

export const tabsContentVariants = cva({
  base: 'zui-tabs-content',
})
