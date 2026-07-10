import * as vscode from 'vscode'
import type { Manifest } from './manifest.js'
import bundledJson from './manifest.json' with { type: 'json' }
import { ClassCompletionProvider } from './providers/class-completion.js'
import { TokenCompletionProvider } from './providers/token-completion.js'
import {
  findZuiDependents,
  loadWorkspaceManifest,
} from './workspace-manifest.js'

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

/**
 * Snapshot of the ZUI release the extension was built against — the fallback
 * when no installed @mrmartineau/zui can be read from the workspace.
 */
const bundledManifest = bundledJson as Manifest

type EnableMode = 'auto' | 'always' | 'never'

function registerProviders(manifest: Manifest): vscode.Disposable {
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
  /** Serialized form of the manifest the current providers were built from */
  let providersKey: string | undefined

  const sync = async () => {
    const mode = vscode.workspace
      .getConfiguration('zui')
      .get<EnableMode>('enable', 'auto')
    const dependents = mode === 'never' ? [] : await findZuiDependents()
    const active =
      mode === 'always' || (mode === 'auto' && dependents.length > 0)

    if (!active) {
      providers?.dispose()
      providers = undefined
      providersKey = undefined
      return
    }

    // Prefer the ZUI version installed in the workspace so completions match
    // the user's dependency exactly; fall back to the bundled snapshot.
    const manifest =
      (await loadWorkspaceManifest(dependents)) ?? bundledManifest

    // Re-registering (rather than mutating providers in place) is the only
    // way to make VS Code refresh already-rendered colour swatches.
    const key = JSON.stringify(manifest)
    if (providers && key === providersKey) return
    providers?.dispose()
    providers = registerProviders(manifest)
    providersKey = key
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

  // Re-evaluate when any workspace package.json changes — a user adding,
  // removing, or upgrading @mrmartineau/zui should update completions live.
  const watcher = vscode.workspace.createFileSystemWatcher('**/package.json')
  context.subscriptions.push(
    watcher,
    watcher.onDidCreate(sync),
    watcher.onDidChange(sync),
    watcher.onDidDelete(sync),
  )
}

export function deactivate(): void {}
