/** @jsxImportSource react */
import {
  BlossomCarousel,
  type BlossomOverscrollEvent,
} from '@blossom-carousel/react'
import '@blossom-carousel/react/style.css'
import '../../styles/blossom-zui.css'

const CARDS = Array.from({ length: 10 }, (_, i) => i + 1)

// Tilt the stack when the user drags past either end.
function handleOverscroll(event: BlossomOverscrollEvent) {
  // Replace Blossom's default rubber-band with our own tilt.
  event.preventDefault()
  const carousel = event.currentTarget as HTMLElement
  const overscroll = event.detail.left * 0.2
  const width = carousel.clientWidth
  for (const slide of carousel.children as HTMLCollectionOf<HTMLElement>) {
    slide.style.transform = `translateX(${overscroll}px) rotate(${(overscroll / width) * 70}deg) scale(${1 - Math.abs(overscroll) / width})`
  }
}

export default function BlossomCardsDemo() {
  return (
    <BlossomCarousel className="blossom-cards" onOverscroll={handleOverscroll}>
      {CARDS.map((n) => (
        <div key={n}>
          <div className="zui-card">{n}</div>
        </div>
      ))}
    </BlossomCarousel>
  )
}
