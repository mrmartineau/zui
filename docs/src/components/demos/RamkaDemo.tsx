/** @jsxImportSource react */
import { Button } from '@mrmartineau/zui/react'
import {
  CaretLeftIcon,
  CaretRightIcon,
  MagnifyingGlassMinusIcon,
  MagnifyingGlassPlusIcon,
  XIcon,
} from '@phosphor-icons/react'
import * as Lightbox from '@ramka/react/lightbox'
import '@mrmartineau/zui/css/ramka'

const photo = (id: number, alt: string, width: number, height: number) => ({
  alt,
  height,
  id,
  src: `https://picsum.photos/id/${id}/${width}/${height}`,
  thumb: `https://picsum.photos/id/${id}/300/300`,
  width,
})

const photos = [
  photo(1015, 'A fjord seen from a high cliff', 1600, 1000),
  photo(1018, 'Green cliffs above a winding road', 1600, 1000),
  photo(1025, 'Pug wrapped in a blanket', 1000, 1250),
  photo(1039, 'Waterfall in a forest', 1600, 1000),
  photo(1043, 'Granite cliffs above a pine forest', 1200, 1200),
  photo(1050, 'Sea stacks along a rocky coast', 1600, 1000),
]

export default function RamkaDemo() {
  return (
    <Lightbox.Root>
      <div className="zui-ramka-grid">
        {photos.map((p, i) => (
          <Lightbox.Trigger key={p.id} index={i} aria-label={`Open ${p.alt}`}>
            {({ imageRef }) => (
              <img
                ref={imageRef}
                src={p.thumb}
                alt={p.alt}
                width={300}
                height={300}
              />
            )}
          </Lightbox.Trigger>
        ))}
      </div>

      <Lightbox.Portal>
        <Lightbox.Backdrop />
        <Lightbox.Content aria-label="Photo viewer">
          <Lightbox.Slides aria-label="Photos" aria-roledescription="carousel">
            {photos.map((p, i) => (
              <Lightbox.Slide key={p.id}>
                <Lightbox.Item
                  index={i}
                  caption={p.alt}
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${photos.length}`}
                >
                  <Lightbox.Zoom>
                    <Lightbox.Media width={p.width} height={p.height}>
                      <img
                        src={p.src}
                        alt={p.alt}
                        width={p.width}
                        height={p.height}
                      />
                    </Lightbox.Media>
                  </Lightbox.Zoom>
                </Lightbox.Item>
              </Lightbox.Slide>
            ))}
          </Lightbox.Slides>

          <div className="zui-ramka-toolbar">
            <Lightbox.ZoomOut
              aria-label="Zoom out"
              render={<Button variant="ghost" icon />}
            >
              <MagnifyingGlassMinusIcon aria-hidden />
            </Lightbox.ZoomOut>
            <Lightbox.ZoomIn
              aria-label="Zoom in"
              render={<Button variant="ghost" icon />}
            >
              <MagnifyingGlassPlusIcon aria-hidden />
            </Lightbox.ZoomIn>
            <Lightbox.Close
              aria-label="Close"
              render={<Button variant="ghost" icon />}
            >
              <XIcon aria-hidden />
            </Lightbox.Close>
          </div>

          <div className="zui-ramka-footer">
            <Lightbox.Counter />
            <Lightbox.Caption />
            <Lightbox.Previous
              aria-label="Previous photo"
              render={<Button variant="subtle" icon />}
            >
              <CaretLeftIcon aria-hidden />
            </Lightbox.Previous>
            <Lightbox.Next
              aria-label="Next photo"
              render={<Button variant="subtle" icon />}
            >
              <CaretRightIcon aria-hidden />
            </Lightbox.Next>
          </div>
        </Lightbox.Content>
      </Lightbox.Portal>
    </Lightbox.Root>
  )
}
