/** @jsxImportSource react */
import { Button } from '@mrmartineau/zui/react'
import { CaretLeftIcon, CaretRightIcon, XIcon } from '@phosphor-icons/react'
import * as Lightbox from '@ramka/react/lightbox'
import '@mrmartineau/zui/css/ramka'

type Figure = {
  id: number
  alt: string
  caption: string
  credit: string
  width: number
  height: number
}

const credit = 'Photo: Unsplash via Lorem Picsum'

const figures: Figure[] = [
  {
    alt: 'A fjord seen from a high cliff, with walkers on the edge',
    caption: 'The walk starts high. By mid-morning the cliff path is busy.',
    credit,
    height: 1000,
    id: 1015,
    width: 1600,
  },
  {
    alt: 'Sea stacks rising from turquoise water below a rocky coast',
    caption: 'Below the path, the sea has cut the coast into stacks.',
    credit,
    height: 1400,
    id: 1050,
    width: 1000,
  },
  {
    alt: 'Green cliffs above a road that winds into the valley',
    caption: 'The road back down takes longer than the walk up.',
    credit,
    height: 1400,
    id: 1018,
    width: 1000,
  },
]

const src = (f: Figure, scale = 1) =>
  `https://picsum.photos/id/${f.id}/${f.width * scale}/${f.height * scale}`

function FigureTrigger({ index }: { index: number }) {
  const f = figures[index]
  return (
    <figure>
      <Lightbox.Trigger index={index} aria-label={`Open photo: ${f.alt}`}>
        {({ imageRef }) => (
          <img
            ref={imageRef}
            src={src(f, 0.5)}
            alt={f.alt}
            width={f.width}
            height={f.height}
          />
        )}
      </Lightbox.Trigger>
      <figcaption className="zui-text--1 zui-color-muted mt-2xs">
        {f.caption} <span className="zui-color-faint">{f.credit}</span>
      </figcaption>
    </figure>
  )
}

export default function RamkaEditorialDemo() {
  return (
    <article className="flow" style={{ maxWidth: '36rem' }}>
      <Lightbox.Root
        loop
        // Thumbnails are the same photos at half size, so skip the decode wait.
        awaitImageDecode={false}
        // Figures sit in a scrolling article. Keep the current one in view
        // when the viewer opens and closes.
        scrollTriggerIntoView={[
          { behavior: 'instant', block: 'nearest', type: 'onOpenComplete' },
          { behavior: 'instant', block: 'nearest', type: 'onClose' },
        ]}
      >
        <h3 className="zui-text-3">A day on the western cliffs</h3>
        <p className="zui-text--1 zui-color-muted">By ZUI · 3 min read</p>
        <p>
          The path leaves the car park at sea level and climbs for an hour. At
          the top the wind comes straight off the water, and the view opens up
          in both directions.
        </p>

        <FigureTrigger index={0} />

        <p>
          From here the route follows the cliff edge south. Most walkers turn
          back at the first headland. The ones who keep going get the coast to
          themselves.
        </p>

        <div
          style={{
            display: 'grid',
            gap: 'var(--space-sm)',
            gridTemplateColumns: '1fr 1fr',
          }}
        >
          <FigureTrigger index={1} />
          <FigureTrigger index={2} />
        </div>

        <Lightbox.Portal className="zui-ramka-editorial">
          <Lightbox.Backdrop />
          <Lightbox.Content aria-label="Article photographs">
            <Lightbox.Slides
              aria-label="Article photographs"
              aria-roledescription="carousel"
            >
              {figures.map((f, i) => (
                <Lightbox.Slide key={f.id}>
                  <Lightbox.Item
                    index={i}
                    aria-roledescription="slide"
                    aria-label={`${i + 1} of ${figures.length}`}
                    caption={
                      <>
                        <span>{f.caption}</span>
                        <span className="zui-ramka-credit">{f.credit}</span>
                      </>
                    }
                  >
                    <Lightbox.Media width={f.width} height={f.height}>
                      <img
                        src={src(f)}
                        alt={f.alt}
                        width={f.width}
                        height={f.height}
                      />
                    </Lightbox.Media>
                  </Lightbox.Item>
                </Lightbox.Slide>
              ))}
            </Lightbox.Slides>

            <div className="zui-ramka-toolbar">
              <Lightbox.Counter />
              <Lightbox.Close
                aria-label="Close"
                render={<Button variant="ghost" icon />}
              >
                <XIcon aria-hidden />
              </Lightbox.Close>
            </div>

            <Lightbox.Previous
              aria-label="Previous photo"
              render={<Button variant="ghost" icon size="lg" />}
            >
              <CaretLeftIcon aria-hidden />
            </Lightbox.Previous>
            <Lightbox.Next
              aria-label="Next photo"
              render={<Button variant="ghost" icon size="lg" />}
            >
              <CaretRightIcon aria-hidden />
            </Lightbox.Next>

            <div className="zui-ramka-footer">
              <Lightbox.Caption />
            </div>
          </Lightbox.Content>
        </Lightbox.Portal>
      </Lightbox.Root>
    </article>
  )
}
