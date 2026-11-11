/** @jsxImportSource react */
import {
  BlossomCarousel,
  BlossomDots,
  BlossomNext,
  BlossomPrev,
} from '@blossom-carousel/react'
import '@blossom-carousel/react/style.css'
import { buttonVariants } from '@mrmartineau/zui/react'
import '../../styles/blossom-zui.css'

const SLIDES = Array.from({ length: 8 }, (_, i) => i + 1)
const navButton = buttonVariants({ icon: true, variant: 'outline' })

export default function BlossomBasicDemo() {
  return (
    <>
      <BlossomCarousel id="gallery" className="blossom-basic">
        {SLIDES.map((n) => (
          <div key={n} className="zui-card" data-blossom-slide>
            <h3 className="zui-card-title">Slide {n}</h3>
            <p className="zui-card-description">
              Drag, scroll or use the controls.
            </p>
          </div>
        ))}
      </BlossomCarousel>

      <div className="blossom-controls">
        <BlossomPrev for="gallery" className={navButton}>
          <i className="ph ph-caret-left" aria-hidden="true" />
        </BlossomPrev>
        <BlossomDots for="gallery" />
        <BlossomNext for="gallery" className={navButton}>
          <i className="ph ph-caret-right" aria-hidden="true" />
        </BlossomNext>
      </div>
    </>
  )
}
