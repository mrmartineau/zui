import { fieldLegendVariants } from '../shared/fieldLegendVariants'
import { fieldVariants } from '../shared/fieldVariants'
import { classHostElement } from './element'

export const ZuiField = classHostElement({
  attributes: { orientation: 'orientation' },
  booleanAttributes: { invalid: 'invalid' },
  role: 'group',
  variants: (props) => fieldVariants(props),
})

export const ZuiFieldDescription = classHostElement({
  baseClass: 'zui-field-description',
})

export const ZuiFieldError = classHostElement({
  baseClass: 'zui-field-error',
  role: 'alert',
})

export const ZuiFieldGroup = classHostElement({ baseClass: 'zui-field-group' })

export const ZuiFieldLegend = classHostElement({
  attributes: { variant: 'variant' },
  variants: (props) => fieldLegendVariants(props),
})

export const ZuiFieldSeparator = classHostElement({
  baseClass: 'zui-field-separator',
  role: 'separator',
})

export const ZuiFieldSet = classHostElement({
  baseClass: 'zui-field-set',
  role: 'group',
})
