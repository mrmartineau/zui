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

const ZUI_PKG_NAME = '@mrmartineau/zui'

type EnableMode = 'auto' | 'always' | 'never'

/**
 * Scan workspace package.json files for a @mrmartineau/zui dependency.
 * Mirrors the Tailwind IntelliSense activation strategy so the extension
 * stays silent in non-ZUI projects.
 */
async function hasZuiDependency(): Promise<boolean> {
  const pkgFiles = await vscode.workspace.findFiles(
    '**/package.json',
    '**/node_modules/**',
    100,
  )
  for (const uri of pkgFiles) {
    try {
      const raw = await vscode.workspace.fs.readFile(uri)
      const pkg = JSON.parse(Buffer.from(raw).toString('utf-8'))
      const deps = {
        ...(pkg.dependencies ?? {}),
        ...(pkg.devDependencies ?? {}),
        ...(pkg.peerDependencies ?? {}),
      }
      if (ZUI_PKG_NAME in deps) return true
    } catch {
      // Ignore unreadable or malformed package.json
    }
  }
  return false
}

async function shouldActivate(): Promise<boolean> {
  const mode = vscode.workspace
    .getConfiguration('zui')
    .get<EnableMode>('enable', 'auto')
  if (mode === 'never') return false
  if (mode === 'always') return true
  return hasZuiDependency()
}

function registerProviders(): vscode.Disposable {
  const classProvider = new ClassCompletionProvider(manifest.classes)
  const tokenProvider = new TokenCompletionProvider(manifest.tokens)
  const disposables: vscode.Disposable[] = []

  for (const lang of CLASS_LANGUAGES) {
    disposables.push(
      vscode.languages.registerCompletionItemProvider(
        { language: lang },
        classProvider,
        '"',
        "'",
        ' ',
      ),
    )
  }

  for (const lang of CSS_LANGUAGES) {
    disposables.push(
      vscode.languages.registerCompletionItemProvider(
        { language: lang },
        tokenProvider,
        '-',
        '(',
      ),
    )
  }

  disposables.push(
    vscode.languages.registerColorProvider(
      CSS_LANGUAGES.map((lang) => ({ language: lang })),
      tokenProvider,
    ),
  )

  return vscode.Disposable.from(...disposables)
}

export async function activate(
  context: vscode.ExtensionContext,
): Promise<void> {
  let providers: vscode.Disposable | undefined

  const sync = async () => {
    const active = await shouldActivate()
    if (active && !providers) {
      providers = registerProviders()
    } else if (!active && providers) {
      providers.dispose()
      providers = undefined
    }
  }

  // Ensure providers are torn down on extension unload
  context.subscriptions.push({ dispose: () => providers?.dispose() })

  await sync()

  // Re-evaluate on config changes
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(async (e) => {
      if (e.affectsConfiguration('zui.enable')) await sync()
    }),
  )

  // Re-evaluate when any workspace package.json changes — a user adding or
  // removing @mrmartineau/zui should flip the extension on/off live.
  const watcher = vscode.workspace.createFileSystemWatcher('**/package.json')
  context.subscriptions.push(
    watcher,
    watcher.onDidCreate(sync),
    watcher.onDidChange(sync),
    watcher.onDidDelete(sync),
  )
}

export function deactivate(): void {}
