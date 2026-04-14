import * as vscode from 'vscode'
import type { ClassEntry } from '../generate-manifest.js'

// Quoted attribute value — covers:
//   HTML:     class="..."
//   JSX:      className="..."
//   Vue:      :class="..." / v-bind:class="..."
//   Angular:  [class]="..."
//   Solid:    class="..."
// Vue object/array bindings (`:class="{ 'foo': ok }"`, `:class="['foo']"`)
// are covered too — the quote-consistent `[^"]*` scan permits inner `'`.
//
// Dynamic expressions (JSX/TSX/Solid): className={...} / class={...} with
// the cursor inside a string inside the expression (covers clsx/cn/cva).
const CLASS_ATTR_RE = [
  /(?:\bclass(?:Name)?|(?:v-bind)?:class|\[class\])\s*=\s*"[^"]*$/,
  /(?:\bclass(?:Name)?|(?:v-bind)?:class|\[class\])\s*=\s*'[^']*$/,
  /\bclass(?:Name)?\s*=\s*\{[^}]*"[^"]*$/,
  /\bclass(?:Name)?\s*=\s*\{[^}]*'[^']*$/,
]

function isInClassAttribute(line: string, char: number): boolean {
  const before = line.slice(0, char)
  return CLASS_ATTR_RE.some(re => re.test(before))
}

export class ClassCompletionProvider implements vscode.CompletionItemProvider {
  private items: vscode.CompletionItem[]

  constructor(classes: ClassEntry[]) {
    this.items = classes.map(({ name, source }) => {
      const item = new vscode.CompletionItem(name, vscode.CompletionItemKind.Value)
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
    const line = document.lineAt(position).text
    if (!isInClassAttribute(line, position.character)) return null
    return this.items
  }
}
