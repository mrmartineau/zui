import { flexVariants } from '../shared/flexVariants'
import { classHostElement } from './element'

export const ZuiFlex = classHostElement({
  attributes: {
    align: 'align',
    direction: 'direction',
    display: 'display',
    gap: 'gap',
    'gap-x': 'gapX',
    'gap-y': 'gapY',
    justify: 'justify',
    wrap: 'wrap',
  },
  variants: (props) => flexVariants(props),
})
