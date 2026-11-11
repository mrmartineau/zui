<script lang="ts">
import type { VariantProps } from 'cva'
import { onMount } from 'svelte'
import type { HTMLInputAttributes } from 'svelte/elements'
import { initDropzones } from '../shared/dropzone'
import { dropzoneVariants } from '../shared/dropzoneVariants'

type DropzoneVariantProps = VariantProps<typeof dropzoneVariants>

type Props = Omit<HTMLInputAttributes, 'type' | 'class'> & {
  /** Class for the wrapper. Other props go to the `<input>`. */
  class?: string
  shape?: DropzoneVariantProps['shape']
  /** Main text. Also part of the input's accessible name */
  label?: string
  /** Smaller text under the label, such as the allowed types and size */
  hint?: string
  /** Largest file in bytes. Larger files are refused and named in the status line */
  maxSize?: number
  files?: FileList | null
}

let {
  class: className,
  shape,
  label = 'Drop files here, or click to browse',
  hint,
  maxSize,
  files = $bindable(),
  ...rest
}: Props = $props()

const classes = $derived(dropzoneVariants({ class: className, shape }))

onMount(initDropzones)
</script>

<div class={classes} data-zui-dropzone="" data-max-size={maxSize}>
  <label class="zui-dropzone-box">
    <input class="zui-dropzone-input" type="file" bind:files {...rest} />
    <i class="ph ph-upload-simple zui-dropzone-icon" aria-hidden="true"></i>
    <span class="zui-dropzone-title">{label}</span>
    {#if hint}
      <span class="zui-dropzone-hint">{hint}</span>
    {/if}
  </label>
  <p class="zui-dropzone-status" role="status"></p>
</div>
