import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { fieldVariants } from '../shared/fieldVariants'

export type FieldProps = JSX.HTMLAttributes<HTMLDivElement> & {
  class?: string
  orientation?: 'vertical' | 'horizontal' | 'responsive'
  invalid?: boolean
}

export function Field(props: FieldProps) {
  const [local, rest] = splitProps(props, [
    'class',
    'orientation',
    'invalid',
    'children',
  ])
  const classes = () =>
    fieldVariants({
      className: local.class,
      invalid: local.invalid,
      orientation: local.orientation,
    })
  return (
    // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- fieldset carries default styling and layout quirks; a div with role="group" is the deliberate choice here
    <div role="group" class={classes()} {...rest}>
      {local.children}
    </div>
  )
}
