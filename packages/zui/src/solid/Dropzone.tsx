import type { VariantProps } from 'cva'
import type { JSX } from 'solid-js'
import { onMount, Show, splitProps } from 'solid-js'
import { initDropzones } from '../shared/dropzone'
import { dropzoneVariants } from '../shared/dropzoneVariants'

type DropzoneVariantProps = VariantProps<typeof dropzoneVariants>

export type DropzoneProps = Omit<
  JSX.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'class'
> &
  DropzoneVariantProps & {
    /** Class for the wrapper. Other props go to the `<input>`. */
    class?: string
    /** Main text. Also part of the input's accessible name */
    label?: JSX.Element
    /** Smaller text under the label, such as the allowed types and size */
    hint?: JSX.Element
    /** Largest file in bytes. Larger files are refused and named in the status line */
    maxSize?: number
  }

export function Dropzone(props: DropzoneProps) {
  const [local, rest] = splitProps(props, [
    'class',
    'shape',
    'label',
    'hint',
    'maxSize',
  ])
  onMount(initDropzones)

  return (
    <div
      class={dropzoneVariants({ class: local.class, shape: local.shape })}
      data-zui-dropzone=""
      data-max-size={local.maxSize}
    >
      <label class="zui-dropzone-box">
        <input class="zui-dropzone-input" type="file" {...rest} />
        <i class="ph ph-upload-simple zui-dropzone-icon" aria-hidden="true" />
        <span class="zui-dropzone-title">
          {local.label ?? 'Drop files here, or click to browse'}
        </span>
        <Show when={local.hint}>
          <span class="zui-dropzone-hint">{local.hint}</span>
        </Show>
      </label>
      <p class="zui-dropzone-status" role="status" />
    </div>
  )
}
