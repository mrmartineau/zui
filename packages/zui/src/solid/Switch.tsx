import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'

export type SwitchProps = Omit<
  JSX.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'role'
> & {
  class?: string
}

export function Switch(props: SwitchProps) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  const classes = () => ['zui-switch', local.class].filter(Boolean).join(' ')
  return (
    <label class={classes()}>
      {/* biome-ignore lint/a11y/useAriaPropsForRole: a native checkbox exposes checked state, so aria-checked is implicit */}
      <input {...rest} type="checkbox" role="switch" />
      {local.children}
    </label>
  )
}
