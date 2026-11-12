/**
 * Behaviour for `.zui-dropzone`, shared by every framework wrapper.
 *
 * The real `<input type="file">` covers the drop area, so a click opens the
 * picker and a drop lands on the input with no JavaScript. This file adds
 * what the browser does not do:
 *  - `data-dragging` on the zone while files are dragged over it
 *  - a drop skips the input's `accept` attribute, so check type and size here
 *  - a status line with the chosen files, or the ones that were refused
 */

export interface FileRule {
  /** Same format as the `accept` attribute: `.pdf`, `image/*`, `image/png` */
  accept?: string
  /** Largest file in bytes */
  maxSize?: number
}

export interface Rejection {
  file: File
  reason: 'type' | 'size'
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  const units = ['KB', 'MB', 'GB']
  let value = bytes / 1024
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit++
  }
  return `${Number(value.toFixed(value < 10 ? 1 : 0))} ${units[unit]}`
}

function matchesAccept(file: File, accept: string): boolean {
  const tokens = accept
    .split(',')
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean)
  if (!tokens.length) return true
  const name = file.name.toLowerCase()
  const type = file.type.toLowerCase()
  return tokens.some((token) => {
    if (token.startsWith('.')) return name.endsWith(token)
    if (token.endsWith('/*')) return type.startsWith(token.slice(0, -1))
    return type === token
  })
}

/** Split files into the ones that pass the rule and the ones that do not. */
export function checkFiles(
  files: File[],
  { accept, maxSize }: FileRule,
): { accepted: File[]; rejected: Rejection[] } {
  const accepted: File[] = []
  const rejected: Rejection[] = []
  for (const file of files) {
    if (accept && !matchesAccept(file, accept)) {
      rejected.push({ file, reason: 'type' })
    } else if (maxSize != null && file.size > maxSize) {
      rejected.push({ file, reason: 'size' })
    } else {
      accepted.push(file)
    }
  }
  return { accepted, rejected }
}

function describeAccepted(files: File[]): string {
  if (files.length === 1) {
    return `${files[0].name} (${formatBytes(files[0].size)})`
  }
  const names = files.slice(0, 3).map((file) => file.name)
  const more = files.length - names.length
  return `${files.length} files: ${names.join(', ')}${more > 0 ? ` and ${more} more` : ''}`
}

function describeRejection(
  { file, reason }: Rejection,
  maxSize?: number,
): string {
  return reason === 'size' && maxSize != null
    ? `${file.name} is bigger than ${formatBytes(maxSize)}`
    : `${file.name} is not an accepted file type`
}

const ZONE = '[data-zui-dropzone]'

const zoneOf = (target: EventTarget | null) =>
  target instanceof Element ? target.closest<HTMLElement>(ZONE) : null

const hasFiles = (event: DragEvent) =>
  Array.from(event.dataTransfer?.types ?? []).includes('Files')

function clearDragging() {
  // Only dropzones: another component may use data-dragging for itself
  for (const zone of document.querySelectorAll<HTMLElement>(
    '[data-zui-dropzone][data-dragging]',
  )) {
    delete zone.dataset.dragging
  }
}

function onChange(event: Event) {
  const input = event.target
  if (!(input instanceof HTMLInputElement) || input.type !== 'file') return
  const zone = zoneOf(input)
  if (!zone) return

  // data-max-size="0" is a real limit: it refuses every non-empty file
  const rawMaxSize = zone.dataset.maxSize
  const parsedMaxSize =
    rawMaxSize == null || rawMaxSize.trim() === ''
      ? Number.NaN
      : Number(rawMaxSize)
  const maxSize = Number.isFinite(parsedMaxSize) ? parsedMaxSize : undefined
  const { accepted, rejected } = checkFiles(Array.from(input.files ?? []), {
    accept: input.accept,
    maxSize,
  })

  let kept = accepted
  let cleared = false
  if (rejected.length) {
    // Keep only the good files, so the app's own change handler sees them.
    // This runs in the capture phase, before that handler.
    try {
      const list = new DataTransfer()
      for (const file of accepted) list.items.add(file)
      input.files = list.files
    } catch {
      // The list cannot be rebuilt here. Clear it, so the app never gets
      // files that failed the check, and ask for the good ones again.
      input.value = ''
      kept = []
      cleared = accepted.length > 0
    }
  }

  const parts = [
    kept.length ? describeAccepted(kept) : '',
    rejected.length
      ? `Not added: ${rejected.map((r) => describeRejection(r, maxSize)).join('. ')}.${cleared ? ' Choose the files again.' : ''}`
      : '',
  ].filter(Boolean)
  const status = zone.querySelector('.zui-dropzone-status')
  if (status) status.textContent = parts.join('. ')

  if (rejected.length) {
    zone.dataset.invalid = ''
    input.setAttribute('aria-invalid', 'true')
  } else {
    delete zone.dataset.invalid
    input.removeAttribute('aria-invalid')
  }
}

const READY = '__zuiDropzoneReady'

/**
 * Start the listeners. Safe to call many times. One set of listeners on the
 * document covers every dropzone, including ones added later.
 */
export function initDropzones(): void {
  if (typeof document === 'undefined') return
  const flagged = document as Document & { [READY]?: boolean }
  if (flagged[READY]) return
  flagged[READY] = true

  const over = (event: DragEvent) => {
    const zone = zoneOf(event.target)
    // A disabled input takes no drop, so do not invite one
    const disabled =
      zone?.querySelector<HTMLInputElement>('input[type="file"]')?.disabled
    if (zone && !disabled && hasFiles(event)) zone.dataset.dragging = ''
  }
  document.addEventListener('dragenter', over as EventListener)
  document.addEventListener('dragover', over as EventListener)
  document.addEventListener('dragleave', ((event: DragEvent) => {
    const zone = zoneOf(event.target)
    if (zone && !zone.contains(event.relatedTarget as Node | null)) {
      delete zone.dataset.dragging
    }
  }) as EventListener)
  // Capture phase: an app's own drop handler may stop the event from bubbling
  document.addEventListener('drop', clearDragging, true)
  document.addEventListener('dragend', clearDragging)
  document.addEventListener('change', onChange, true)
}
