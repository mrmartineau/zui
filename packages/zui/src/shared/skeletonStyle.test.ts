import { describe, expect, it } from 'vitest'
import { skeletonStyleString, skeletonVars } from './skeletonStyle'

describe('skeletonVars', () => {
  it('sets nothing when no size is given', () => {
    expect(skeletonVars({})).toEqual({})
  })

  it('treats numbers as pixels and keeps strings as they are', () => {
    expect(skeletonVars({ height: 40, width: '50%' })).toEqual({
      '--zui-skeleton-height': '40px',
      '--zui-skeleton-width': '50%',
    })
  })

  it('sets size on its own', () => {
    expect(skeletonVars({ size: 48 })).toEqual({
      '--zui-skeleton-size': '48px',
    })
  })

  it('lets height follow aspectRatio unless height or size is set', () => {
    expect(skeletonVars({ aspectRatio: '16 / 9' })).toEqual({
      '--zui-skeleton-aspect-ratio': '16 / 9',
      '--zui-skeleton-height': 'auto',
    })
    expect(skeletonVars({ aspectRatio: 1, height: 20 })).toEqual({
      '--zui-skeleton-aspect-ratio': '1',
      '--zui-skeleton-height': '20px',
    })
  })
})

describe('skeletonStyleString', () => {
  it('joins the custom properties', () => {
    expect(skeletonStyleString({ height: 8, width: 120 })).toBe(
      '--zui-skeleton-width: 120px; --zui-skeleton-height: 8px',
    )
  })
})
