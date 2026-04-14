import * as vscode from 'vscode'
import type { TokenEntry } from '../generate-manifest.js'

// Trigger inside var(-- or at a CSS property value starting with --
const TOKEN_CONTEXT_RE = [
  /var\(\s*--[\w-]*$/,
  /:\s*--[\w-]*$/,
]

function isInTokenContext(line: string, char: number): boolean {
  const before = line.slice(0, char)
  return TOKEN_CONTEXT_RE.some(re => re.test(before))
}

function hexToColor(hex: string): vscode.Color | null {
  const m = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i)
  if (!m) return null
  return new vscode.Color(
    parseInt(m[1], 16) / 255,
    parseInt(m[2], 16) / 255,
    parseInt(m[3], 16) / 255,
    1,
  )
}

export class TokenCompletionProvider
  implements vscode.CompletionItemProvider, vscode.DocumentColorProvider
{
  private completionItems: vscode.CompletionItem[]
  /** token name → vscode.Color for swatch decoration */
  private colorMap: Map<string, vscode.Color>

  constructor(tokens: TokenEntry[]) {
    this.colorMap = new Map()

    this.completionItems = tokens.map(({ name, value, category, color }) => {
      const isColor = category === 'color' || category === 'theme'
      const kind = isColor
        ? vscode.CompletionItemKind.Color
        : vscode.CompletionItemKind.Variable

      const item = new vscode.CompletionItem(name, kind)
      item.detail = value.length > 60 ? `${value.slice(0, 57)}…` : value
      item.documentation = new vscode.MarkdownString(
        `**${name}**\n\`\`\`css\n${name}: ${value};\n\`\`\``,
      )
      item.insertText = name

      if (color) {
        const rgba = hexToColor(color)
        if (rgba) this.colorMap.set(name, rgba)
      }

      return item
    })
  }

  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
  ): vscode.CompletionItem[] | null {
    const line = document.lineAt(position).text
    if (!isInTokenContext(line, position.character)) return null
    return this.completionItems
  }

  provideDocumentColors(document: vscode.TextDocument): vscode.ColorInformation[] {
    const results: vscode.ColorInformation[] = []
    const re = /--([\w-]+)/g

    for (let i = 0; i < document.lineCount; i++) {
      const line = document.lineAt(i)
      let m
      re.lastIndex = 0
      while ((m = re.exec(line.text)) !== null) {
        const tokenName = `--${m[1]}`
        const color = this.colorMap.get(tokenName)
        if (!color) continue
        const start = new vscode.Position(i, m.index)
        const end = new vscode.Position(i, m.index + m[0].length)
        results.push(new vscode.ColorInformation(new vscode.Range(start, end), color))
      }
    }

    return results
  }

  provideColorPresentations(
    _color: vscode.Color,
    context: { document: vscode.TextDocument; range: vscode.Range },
  ): vscode.ColorPresentation[] {
    // Keep the original token reference intact — don't replace with hex
    return [new vscode.ColorPresentation(context.document.getText(context.range))]
  }
}
