import { UploadSimpleIcon } from '@phosphor-icons/react'
import type { VariantProps } from 'cva'
import type { InputHTMLAttributes, ReactNode } from 'react'
import { useEffect } from 'react'
import { initDropzones } from '../shared/dropzone'
import { dropzoneVariants } from '../shared/dropzoneVariants'

type DropzoneVariantProps = VariantProps<typeof dropzoneVariants>

export type DropzoneProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'className'
> &
  DropzoneVariantProps & {
    /** Class for the wrapper. Other props go to the `<input>`. */
    className?: string
    /** Main text. Also part of the input's accessible name */
    label?: ReactNode
    /** Smaller text under the label, such as the allowed types and size */
    hint?: ReactNode
    /** Largest file in bytes. Larger files are refused and named in the status line */
    maxSize?: number
  }

export function Dropzone({
  className,
  shape,
  label = 'Drop files here, or click to browse',
  hint,
  maxSize,
  ...props
}: DropzoneProps) {
  useEffect(() => {
    initDropzones()
  }, [])

  return (
    <div
      className={dropzoneVariants({ className, shape })}
      data-zui-dropzone=""
      data-max-size={maxSize}
    >
      <label className="zui-dropzone-box">
        <input className="zui-dropzone-input" type="file" {...props} />
        <UploadSimpleIcon className="zui-dropzone-icon" aria-hidden="true" />
        <span className="zui-dropzone-title">{label}</span>
        {hint && <span className="zui-dropzone-hint">{hint}</span>}
      </label>
      <p className="zui-dropzone-status" role="status" />
    </div>
  )
}
