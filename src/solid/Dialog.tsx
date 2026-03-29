/** @jsxImportSource solid-js */
import type { ComponentProps } from 'solid-js'
import { splitProps, createEffect } from 'solid-js'
import type { VariantProps } from 'cva'
import { dialogVariants } from '../shared/dialogVariants'

type DialogVariantProps = VariantProps<typeof dialogVariants>

export type DialogProps = ComponentProps<'dialog'> & DialogVariantProps & {
  open?: boolean
  onClose?: () => void
}

export function Dialog(props: DialogProps) {
  let ref!: HTMLDialogElement
  const [local, rest] = splitProps(props, ['open', 'onClose', 'class', 'size'])
  const classes = dialogVariants({ size: local.size, class: local.class })

  createEffect(() => {
    if (local.open) {
      ref?.showModal()
    } else {
      ref?.close()
    }
  })

  return (
    <dialog ref={ref!} class={classes} onClose={local.onClose} {...rest} />
  )
}
