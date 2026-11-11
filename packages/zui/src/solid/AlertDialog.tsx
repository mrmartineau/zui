import type { JSX } from 'solid-js'
import { createUniqueId, Show, splitProps } from 'solid-js'
import { Dialog, type DialogProps } from './Dialog'
import { DialogDescription } from './DialogDescription'
import { DialogHeader } from './DialogHeader'
import { DialogTitle } from './DialogTitle'

export type AlertDialogProps = Omit<
  DialogProps,
  'role' | 'title' | 'position' | 'size'
> & {
  /** Names the dialog for assistive tech. Keep it short, such as "Delete this project?" */
  title: JSX.Element
  /** Says what happens next. Read out when the dialog opens */
  description?: JSX.Element
}

export function AlertDialog(props: AlertDialogProps) {
  const [local, rest] = splitProps(props, [
    'id',
    'title',
    'description',
    'class',
    'closedby',
    'children',
  ])
  const generatedId = createUniqueId()
  const baseId = () => local.id ?? generatedId

  return (
    <Dialog
      id={baseId()}
      role="alertdialog"
      aria-labelledby={`${baseId()}-title`}
      aria-describedby={
        local.description ? `${baseId()}-description` : undefined
      }
      class={['zui-alert-dialog', local.class].filter(Boolean).join(' ')}
      closedby={local.closedby ?? 'closerequest'}
      {...rest}
    >
      <DialogHeader>
        <DialogTitle id={`${baseId()}-title`}>{local.title}</DialogTitle>
        <Show when={local.description}>
          <DialogDescription id={`${baseId()}-description`}>
            {local.description}
          </DialogDescription>
        </Show>
      </DialogHeader>
      {local.children}
    </Dialog>
  )
}
