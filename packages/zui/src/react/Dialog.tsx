import type { VariantProps } from 'cva'
import {
  type DialogHTMLAttributes,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
} from 'react'
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
    // Always drive the element via innerRef; a consumer's callback ref has no
    // .current to read, so it is merged in rather than used directly.
    const innerRef = useRef<HTMLDialogElement>(null)
    const registerDialog = useCallback(
      (el: HTMLDialogElement | null) => {
        innerRef.current = el
        if (typeof forwardedRef === 'function') forwardedRef(el)
        else if (forwardedRef) forwardedRef.current = el
      },
      [forwardedRef],
    )
    const classes = dialogVariants({ className, position, size })

    useEffect(() => {
      if (open) {
        innerRef.current?.showModal()
      } else {
        innerRef.current?.close()
      }
    }, [open])

    useEffect(() => {
      innerRef.current?.setAttribute('closedby', closedby)
    }, [closedby])

    return (
      <dialog
        ref={registerDialog}
        className={classes}
        onClose={onClose}
        {...props}
      >
        {children}
      </dialog>
    )
  },
)
