import * as vscode from 'vscode'
import manifest from './manifest.json' with { type: 'json' }
import { ClassCompletionProvider } from './providers/class-completion.js'
import { TokenCompletionProvider } from './providers/token-completion.js'

const CLASS_LANGUAGES = [
  'html',
  'javascriptreact',
  'typescriptreact',
  'astro',
  'vue',
]

const CSS_LANGUAGES = [
  'css',
  'scss',
  'less',
  'html',
  'javascriptreact',
  'typescriptreact',
  'astro',
  'vue',
]

export function activate(context: vscode.ExtensionContext): void {
  const config = vscode.workspace.getConfiguration('zui')
  if (!config.get<boolean>('enable', true)) return

  const classProvider = new ClassCompletionProvider(manifest.classes)
  const tokenProvider = new TokenCompletionProvider(manifest.tokens)

  for (const lang of CLASS_LANGUAGES) {
    context.subscriptions.push(
      vscode.languages.registerCompletionItemProvider(
        { language: lang, scheme: 'file' },
        classProvider,
        '"', "'", ' ',
      ),
    )
  }

  for (const lang of CSS_LANGUAGES) {
    context.subscriptions.push(
      vscode.languages.registerCompletionItemProvider(
        { language: lang, scheme: 'file' },
        tokenProvider,
        '-', '(',
      ),
    )
  }

  context.subscriptions.push(
    vscode.languages.registerColorProvider(
      CSS_LANGUAGES.map(lang => ({ language: lang, scheme: 'file' })),
      tokenProvider,
    ),
  )
}

export function deactivate(): void {}
