import type { VariantProps } from 'cva'
import type { HTMLAttributes } from 'react'
import { useState } from 'react'
import { avatarVariants } from '../shared/avatarVariants'

type AvatarVariantProps = VariantProps<typeof avatarVariants>

export interface AvatarProps
  extends HTMLAttributes<HTMLSpanElement>,
    AvatarVariantProps {
  src?: string
  alt?: string
  fallback?: React.ReactNode
  className?: string
}

export function Avatar({
  className,
  size,
  shape,
  src,
  alt,
  fallback,
  ...props
}: AvatarProps) {
  const [imageError, setImageError] = useState(false)
  const classes = avatarVariants({ className, shape, size })

  return (
    <span className={classes} {...props}>
      <span className="zui-avatar-fallback">
        {fallback ?? <i className="ph ph-user" aria-hidden="true" />}
      </span>
      {src && !imageError && (
        <img
          className="zui-avatar-image"
          src={src}
          alt={alt ?? ''}
          onError={() => setImageError(true)}
        />
      )}
    </span>
  )
}
