import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import * as vscode from 'vscode'
import { loadManifestFromPackageDir } from './load-manifest.js'
import type { Manifest } from './manifest.js'

export const ZUI_PKG_NAME = '@mrmartineau/zui'

/**
 * Find every workspace package.json that declares a @mrmartineau/zui
 * dependency. Mirrors the Tailwind IntelliSense activation strategy so the
 * extension stays silent in non-ZUI projects.
 */
export async function findZuiDependents(): Promise<vscode.Uri[]> {
  const dependents: vscode.Uri[] = []
  const pkgFiles = await vscode.workspace.findFiles(
    '**/package.json',
    '**/node_modules/**',
    undefined,
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
      if (ZUI_PKG_NAME in deps) dependents.push(uri)
    } catch {
      // Ignore unreadable or malformed package.json
    }
  }
  return dependents
}

/**
 * Locate the installed @mrmartineau/zui package for a dependent package.json:
 * check `node_modules` next to it, then walk up towards the workspace root to
 * handle hoisted installs in monorepos.
 */
function findInstalledZuiDir(pkgJsonUri: vscode.Uri): string | null {
  const root = vscode.workspace.getWorkspaceFolder(pkgJsonUri)?.uri.fsPath
  let dir = dirname(pkgJsonUri.fsPath)
  while (true) {
    const candidate = join(dir, 'node_modules', ...ZUI_PKG_NAME.split('/'))
    if (existsSync(join(candidate, 'package.json'))) return candidate
    if (dir === root || dirname(dir) === dir) return null
    dir = dirname(dir)
  }
}

/**
 * Build a manifest from the ZUI version installed in the workspace, so
 * completions match exactly what the user's project depends on. Checks each
 * dependent package.json's node_modules first, then falls back to workspace
 * folder roots (covers `zui.enable: "always"` with no declared dependency).
 * Returns null when no installed copy is found — callers fall back to the
 * bundled manifest snapshot.
 */
export async function loadWorkspaceManifest(
  dependents: vscode.Uri[],
): Promise<Manifest | null> {
  const candidateDirs: string[] = []

  for (const pkgUri of dependents) {
    const dir = findInstalledZuiDir(pkgUri)
    if (dir) candidateDirs.push(dir)
  }

  for (const folder of vscode.workspace.workspaceFolders ?? []) {
    candidateDirs.push(
      join(folder.uri.fsPath, 'node_modules', ...ZUI_PKG_NAME.split('/')),
    )
  }

  for (const dir of candidateDirs) {
    const manifest = loadManifestFromPackageDir(dir)
    if (manifest) return manifest
  }
  return null
}
