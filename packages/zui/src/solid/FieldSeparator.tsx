import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'

export type FieldSeparatorProps = JSX.HTMLAttributes<HTMLDivElement> & {
  class?: string
}

export function FieldSeparator(props: FieldSeparatorProps) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  const classes = () =>
    ['zui-field-separator', local.class].filter(Boolean).join(' ')
  return (
    // biome-ignore lint/a11y/useSemanticElements: hr cannot carry label content; a div with role="separator" is the standard pattern for labelled dividers
    // biome-ignore lint/a11y/useAriaPropsForRole: aria-valuenow is only required for focusable (widget) separators; this one is static
    // biome-ignore lint/a11y/useFocusableInteractive: static separators are valid non-focusable ARIA
    <div role="separator" class={classes()} {...rest}>
      {local.children}
    </div>
  )
}
