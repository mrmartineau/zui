import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { checkFiles, formatBytes, initDropzones } from './dropzone'

const file = (name: string, type: string, size = 10) =>
  new File([new Uint8Array(size)], name, { type })

describe('formatBytes', () => {
  it('uses the nearest unit', () => {
    expect(formatBytes(512)).toBe('512 B')
    expect(formatBytes(1536)).toBe('1.5 KB')
    expect(formatBytes(5 * 1024 * 1024)).toBe('5 MB')
    expect(formatBytes(240 * 1024)).toBe('240 KB')
  })
})

describe('checkFiles', () => {
  const png = file('a.png', 'image/png')
  const pdf = file('b.PDF', 'application/pdf')
  const exe = file('c.exe', 'application/x-msdownload')

  it('accepts everything when there is no rule', () => {
    expect(checkFiles([png, pdf, exe], {}).rejected).toEqual([])
  })

  it('matches extensions, wildcard types and exact types', () => {
    const { accepted, rejected } = checkFiles([png, pdf, exe], {
      accept: 'image/*, .pdf',
    })
    expect(accepted).toEqual([png, pdf])
    expect(rejected).toEqual([{ file: exe, reason: 'type' }])
    expect(checkFiles([png], { accept: 'image/jpeg' }).rejected[0].reason).toBe(
      'type',
    )
    expect(checkFiles([png], { accept: 'image/png' }).accepted).toEqual([png])
  })

  it('rejects files over the size limit', () => {
    const big = file('big.png', 'image/png', 100)
    const { accepted, rejected } = checkFiles([png, big], { maxSize: 50 })
    expect(accepted).toEqual([png])
    expect(rejected).toEqual([{ file: big, reason: 'size' }])
  })

  it('reports a wrong type before a size problem', () => {
    const big = file('big.exe', 'application/x-msdownload', 100)
    expect(
      checkFiles([big], { accept: 'image/*', maxSize: 50 }).rejected[0].reason,
    ).toBe('type')
  })
})

// jsdom has no DataTransfer. This stand-in keeps the list the dropzone builds.
class FakeDataTransfer {
  list: File[] = []
  items = {
    add: (file: File) => {
      this.list.push(file)
    },
  }
  get files() {
    return this.list
  }
}

class BrokenDataTransfer {
  constructor() {
    throw new Error('no DataTransfer here')
  }
}

describe('initDropzones', () => {
  const setup = (maxSize = '50', inputAttrs = '') => {
    document.body.innerHTML = `<div class="zui-dropzone" data-zui-dropzone data-max-size="${maxSize}">
      <label class="zui-dropzone-box"><input type="file" accept="image/*" multiple ${inputAttrs} /></label>
      <p class="zui-dropzone-status" role="status"></p>
    </div>`
    initDropzones()
    return {
      input: document.querySelector('input') as HTMLInputElement,
      status: document.querySelector('.zui-dropzone-status') as HTMLElement,
      zone: document.querySelector('.zui-dropzone') as HTMLElement,
    }
  }
  const drag = (type: string, target: Element, types = ['Files']) => {
    const event = new Event(type, { bubbles: true })
    Object.defineProperty(event, 'dataTransfer', { value: { types } })
    target.dispatchEvent(event)
  }
  // `files` is writable, as it is in a browser, so the dropzone can replace it
  const choose = (input: HTMLInputElement, files: File[]) => {
    Object.defineProperty(input, 'files', {
      configurable: true,
      value: files,
      writable: true,
    })
    input.dispatchEvent(new Event('change', { bubbles: true }))
  }

  beforeEach(() => {
    vi.stubGlobal('DataTransfer', FakeDataTransfer)
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('marks the zone while files are dragged over it', () => {
    const { input, zone } = setup()
    drag('dragenter', input)
    expect(zone.hasAttribute('data-dragging')).toBe(true)
    drag('drop', input)
    expect(zone.hasAttribute('data-dragging')).toBe(false)
  })

  it('clears the mark even when an app handler stops the drop event', () => {
    const { input, zone } = setup()
    input.addEventListener('drop', (event) => event.stopPropagation())
    drag('dragenter', input)
    drag('drop', input)
    expect(zone.hasAttribute('data-dragging')).toBe(false)
  })

  it('leaves data-dragging on other elements alone', () => {
    const { input } = setup()
    const other = document.createElement('div')
    other.dataset.dragging = ''
    document.body.append(other)
    drag('dragenter', input)
    drag('drop', input)
    expect(other.hasAttribute('data-dragging')).toBe(true)
  })

  it('ignores drags that carry no files', () => {
    const { input, zone } = setup()
    drag('dragenter', input, ['text/plain'])
    expect(zone.hasAttribute('data-dragging')).toBe(false)
  })

  it('does not mark a disabled dropzone', () => {
    const { input, zone } = setup('50', 'disabled')
    drag('dragenter', input)
    expect(zone.hasAttribute('data-dragging')).toBe(false)
  })

  it('writes the chosen file to the status line', () => {
    const { input, status, zone } = setup()
    choose(input, [file('a.png', 'image/png', 20)])
    expect(status.textContent).toBe('a.png (20 B)')
    expect(zone.hasAttribute('data-invalid')).toBe(false)
  })

  it('removes refused files from the input before the app sees them', () => {
    const { input, status, zone } = setup()
    const good = file('a.png', 'image/png', 20)
    let seen: File[] = []
    input.addEventListener('change', () => {
      seen = Array.from(input.files ?? [])
    })
    choose(input, [
      good,
      file('b.exe', 'application/x-msdownload'),
      file('c.png', 'image/png', 99),
    ])
    expect(Array.from(input.files ?? [])).toEqual([good])
    expect(seen).toEqual([good])
    expect(status.textContent).toBe(
      'a.png (20 B). Not added: b.exe is not an accepted file type. c.png is bigger than 50 B.',
    )
    expect(zone.hasAttribute('data-invalid')).toBe(true)
    expect(input.getAttribute('aria-invalid')).toBe('true')
  })

  it('clears the input when the list cannot be rebuilt', () => {
    vi.stubGlobal('DataTransfer', BrokenDataTransfer)
    const { input, status } = setup()
    const setValue = vi.fn()
    Object.defineProperty(input, 'value', {
      configurable: true,
      get: () => '',
      set: setValue,
    })
    choose(input, [
      file('a.png', 'image/png', 20),
      file('b.exe', 'application/x-msdownload'),
    ])
    expect(setValue).toHaveBeenCalledWith('')
    expect(status.textContent).toBe(
      'Not added: b.exe is not an accepted file type. Choose the files again.',
    )
  })

  it('treats data-max-size="0" as a limit, not as no limit', () => {
    const { input, status } = setup('0')
    choose(input, [file('a.png', 'image/png', 1)])
    expect(status.textContent).toBe('Not added: a.png is bigger than 0 B.')
  })

  it('applies no limit when data-max-size is empty', () => {
    const { input, status } = setup('')
    choose(input, [file('a.png', 'image/png', 9999)])
    expect(status.textContent).toBe('a.png (9.8 KB)')
  })

  it('clears the status when the choice is cleared', () => {
    const { input, status, zone } = setup()
    choose(input, [file('b.exe', 'application/x-msdownload')])
    choose(input, [])
    expect(status.textContent).toBe('')
    expect(zone.hasAttribute('data-invalid')).toBe(false)
  })
})
