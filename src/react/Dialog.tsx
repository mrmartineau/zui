import type { VariantProps } from 'cva'
import { type DialogHTMLAttributes, forwardRef, useEffect, useRef } from 'react'
import { dialogVariants } from '../shared/dialogVariants'

type DialogVariantProps = VariantProps<typeof dialogVariants>

export type DialogProps = DialogHTMLAttributes<HTMLDialogElement> &
  DialogVariantProps & {
    open?: boolean
    onClose?: () => void
    /** Controls how the dialog can be dismissed. Defaults to `"any"` (backdrop click or Esc). */
    closedby?: 'any' | 'closerequest' | 'none'
  }

export const Dialog = forwardRef<HTMLDialogElement, DialogProps>(
  function Dialog(
    {
      open,
      onClose,
      className,
      size,
      position,
      closedby = 'any',
      children,
      ...props
    },
    forwardedRef,
  ) {
    const innerRef = useRef<HTMLDialogElement>(null)
    const ref = (forwardedRef ?? innerRef) as React.RefObject<HTMLDialogElement>
    const classes = dialogVariants({ className, position, size })

    useEffect(() => {
      if (open) {
        ref.current?.showModal()
      } else {
        ref.current?.close()
      }
    }, [open])

    useEffect(() => {
      ref.current?.setAttribute('closedby', closedby)
    }, [closedby])

    return (
      <dialog ref={ref} className={classes} onClose={onClose} {...props}>
        {children}
      </dialog>
    )
  },
)
