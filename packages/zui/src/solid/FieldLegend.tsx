import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { fieldLegendVariants } from '../shared/fieldLegendVariants'

export type FieldLegendProps = JSX.HTMLAttributes<HTMLLegendElement> & {
  class?: string
  variant?: 'legend' | 'label'
}

export function FieldLegend(props: FieldLegendProps) {
  const [local, rest] = splitProps(props, ['class', 'variant', 'children'])
  const classes = () =>
    fieldLegendVariants({
      className: local.class,
      variant: local.variant,
    })
  return (
    <legend class={classes()} {...rest}>
      {local.children}
    </legend>
  )
}
