<script lang="ts">
import type { Snippet } from 'svelte'
import type { HTMLDialogAttributes } from 'svelte/elements'
import Dialog from './Dialog.svelte'
import DialogDescription from './DialogDescription.svelte'
import DialogHeader from './DialogHeader.svelte'
import DialogTitle from './DialogTitle.svelte'

type Props = Omit<HTMLDialogAttributes, 'role' | 'title'> & {
  class?: string
  open?: boolean
  shape?: 'default' | 'hard' | 'squircle'
  /** Names the dialog for assistive tech. Keep it short, such as "Delete this project?" */
  title: string
  /** Says what happens next. Read out when the dialog opens */
  description?: string
  /** Defaults to `"closerequest"`: Esc closes it, a click outside does not. */
  closedby?: 'any' | 'closerequest' | 'none'
  onclose?: (event: Event) => void
  children?: Snippet
}

const generatedId = $props.id()

let {
  id,
  class: className,
  open = false,
  title,
  description,
  closedby = 'closerequest',
  children,
  ...rest
}: Props = $props()

const baseId = $derived(id ?? generatedId)
const classes = $derived(
  ['zui-alert-dialog', className].filter(Boolean).join(' '),
)
</script>

<Dialog
  id={baseId}
  role="alertdialog"
  aria-labelledby="{baseId}-title"
  aria-describedby={description ? `${baseId}-description` : undefined}
  class={classes}
  {open}
  {closedby}
  {...rest}
>
  <DialogHeader>
    <DialogTitle id="{baseId}-title">{title}</DialogTitle>
    {#if description}
      <DialogDescription id="{baseId}-description">{description}</DialogDescription>
    {/if}
  </DialogHeader>
  {@render children?.()}
</Dialog>
