import type { VariantProps } from 'cva'
import type { JSX } from 'solid-js'
import { createEffect, splitProps } from 'solid-js'
import { dialogVariants } from '../shared/dialogVariants'

type DialogVariantProps = VariantProps<typeof dialogVariants>

export type DialogProps = JSX.DialogHtmlAttributes<HTMLDialogElement> &
  DialogVariantProps & {
    open?: boolean
    onClose?: () => void
    closedby?: 'any' | 'closerequest' | 'none'
  }

export function Dialog(props: DialogProps) {
  let ref: HTMLDialogElement | undefined
  const [local, rest] = splitProps(props, [
    'open',
    'onClose',
    'class',
    'size',
    'position',
    'closedby',
    'children',
  ])
  const classes = () =>
    dialogVariants({
      className: local.class,
      position: local.position,
      size: local.size,
    })

  createEffect(() => {
    if (local.open) {
      ref?.showModal()
    } else {
      ref?.close()
    }
  })

  createEffect(() => {
    ref?.setAttribute('closedby', local.closedby ?? 'any')
  })

  return (
    <dialog ref={ref} class={classes()} onClose={local.onClose} {...rest}>
      {local.children}
    </dialog>
  )
}
