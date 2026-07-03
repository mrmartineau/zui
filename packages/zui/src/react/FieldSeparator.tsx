import type { HTMLAttributes } from 'react'

export type FieldSeparatorProps = HTMLAttributes<HTMLDivElement> & {
  className?: string
}

export function FieldSeparator({
  className,
  children,
  ...props
}: FieldSeparatorProps) {
  const classes = ['zui-field-separator', className].filter(Boolean).join(' ')
  return (
    // biome-ignore lint/a11y/useSemanticElements: hr cannot carry label content; a div with role="separator" is the standard pattern for labelled dividers
    // biome-ignore lint/a11y/useAriaPropsForRole: aria-valuenow is only required for focusable (widget) separators; this one is static
    // biome-ignore lint/a11y/useFocusableInteractive: static separators are valid non-focusable ARIA
    <div className={classes} role="separator" {...props}>
      {children}
    </div>
  )
}
