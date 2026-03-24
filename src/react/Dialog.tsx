import { forwardRef, useEffect, useRef, type DialogHTMLAttributes } from 'react'
import type { VariantProps } from 'cva'
import { dialogVariants } from '../shared/dialogVariants'

type DialogVariantProps = VariantProps<typeof dialogVariants>

export type DialogProps = DialogHTMLAttributes<HTMLDialogElement> &
  DialogVariantProps & {
    open?: boolean
    onClose?: () => void
  }

export const Dialog = forwardRef<HTMLDialogElement, DialogProps>(
  function Dialog({ open, onClose, className, size, children, ...props }, forwardedRef) {
    const innerRef = useRef<HTMLDialogElement>(null)
    const ref = (forwardedRef ?? innerRef) as React.RefObject<HTMLDialogElement>
    const classes = dialogVariants({ size, className })

    useEffect(() => {
      if (open) {
        ref.current?.showModal()
      } else {
        ref.current?.close()
      }
    }, [open])

    return (
      <dialog ref={ref} className={classes} onClose={onClose} {...props}>
        {children}
      </dialog>
    )
  },
)
