import { badgeVariants } from '../shared/badgeVariants'
import { classHostElement } from './element'

export const ZuiBadge = classHostElement({
  attributes: {
    color: 'color',
    variant: 'variant',
  },
  variants: (props) => badgeVariants(props),
})
