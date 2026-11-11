import type { ReactNode } from 'react'
import { useId } from 'react'
import { Dialog, type DialogProps } from './Dialog'
import { DialogDescription } from './DialogDescription'
import { DialogHeader } from './DialogHeader'
import { DialogTitle } from './DialogTitle'

export type AlertDialogProps = Omit<
  DialogProps,
  'role' | 'title' | 'position' | 'size'
> & {
  /** Names the dialog for assistive tech. Keep it short, such as "Delete this project?" */
  title: ReactNode
  /** Says what happens next. Read out when the dialog opens */
  description?: ReactNode
}

export function AlertDialog({
  id,
  title,
  description,
  className,
  closedby = 'closerequest',
  children,
  ...props
}: AlertDialogProps) {
  const generatedId = useId()
  const baseId = id ?? generatedId
  const titleId = `${baseId}-title`
  const descriptionId = `${baseId}-description`

  return (
    <Dialog
      id={baseId}
      role="alertdialog"
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      className={['zui-alert-dialog', className].filter(Boolean).join(' ')}
      closedby={closedby}
      {...props}
    >
      <DialogHeader>
        <DialogTitle id={titleId}>{title}</DialogTitle>
        {description && (
          <DialogDescription id={descriptionId}>
            {description}
          </DialogDescription>
        )}
      </DialogHeader>
      {children}
    </Dialog>
  )
}
