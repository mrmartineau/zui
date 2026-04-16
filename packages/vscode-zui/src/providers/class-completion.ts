import * as vscode from 'vscode'
import type { ClassEntry } from '../generate-manifest.js'

/**
 * How many lines back from the cursor we scan for a class-attribute opener.
 * Covers multi-line JSX expressions (`className={clsx(\n  'foo',\n  …)}`)
 * and HTML attributes broken across lines, without reading the whole file.
 */
const LOOKBACK_LINES = 50

// Matches the *start* of a class binding in HTML/JSX/Vue/Angular/Solid:
//   class="        className='        :class="        v-bind:class="
//   [class]="      class={            className={
// The captured group is the opening delimiter: " / ' / {
const OPENER_RE =
  /\b(?:class(?:Name)?|(?:v-bind)?:class|\[class\])\s*=\s*(["'{])/g

type StringQuote = '"' | "'" | '`'

/**
 * Given the text from a recent class-attribute opener to the cursor,
 * determine whether the cursor is still inside a class binding where
 * suggesting a class name makes sense.
 *
 * Handles:
 *  - Quoted attributes (`class="foo bar|"`) including Vue object/array
 *    bindings inside the outer quote.
 *  - JSX/TSX/Solid expression forms (`className={clsx('foo|', 'bar')}`)
 *    with nested object/array literals — tracked with brace-counting so
 *    inner `{}` don't terminate the scan prematurely.
 */
function isInsideClassBinding(prefix: string): boolean {
  // Find the *nearest* opener in the prefix (last regex match wins).
  let lastMatch: RegExpExecArray | null = null
  let current: RegExpExecArray | null
  OPENER_RE.lastIndex = 0
  // biome-ignore lint/suspicious/noAssignInExpressions: classic regex exec loop
  while ((current = OPENER_RE.exec(prefix)) !== null) {
    lastMatch = current
  }
  if (!lastMatch) return false

  const openChar = lastMatch[1]
  const rest = prefix.slice(lastMatch.index + lastMatch[0].length)

  if (openChar === '"' || openChar === "'") {
    // Quoted attribute: we're still inside the binding as long as the
    // matching close quote hasn't appeared yet.
    return !rest.includes(openChar)
  }

  // Expression form: walk the text with brace-counting and string-awareness.
  // We only want to suggest classes when the cursor is inside a string
  // literal within the expression (clsx('zui-|'), cva({ base: 'zui-|' })).
  let depth = 1
  let inString: StringQuote | null = null
  for (let i = 0; i < rest.length; i++) {
    const ch = rest[i]
    if (inString) {
      if (ch === '\\') {
        i++
        continue
      }
      if (ch === inString) inString = null
      continue
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      inString = ch
      continue
    }
    if (ch === '{') {
      depth++
    } else if (ch === '}') {
      depth--
      if (depth === 0) return false // expression closed before cursor
    }
  }
  return depth > 0 && inString !== null
}

export class ClassCompletionProvider implements vscode.CompletionItemProvider {
  private items: vscode.CompletionItem[]

  constructor(classes: ClassEntry[]) {
    this.items = classes.map(({ name, source }) => {
      const item = new vscode.CompletionItem(
        name,
        vscode.CompletionItemKind.Value,
      )
      item.detail = `ZUI — ${source}`
      item.documentation = new vscode.MarkdownString(`\`${name}\``)
      item.insertText = name
      return item
    })
  }

  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
  ): vscode.CompletionItem[] | null {
    const startLine = Math.max(0, position.line - LOOKBACK_LINES)
    const prefix = document.getText(
      new vscode.Range(new vscode.Position(startLine, 0), position),
    )
    if (!isInsideClassBinding(prefix)) return null
    return this.items
  }
}
