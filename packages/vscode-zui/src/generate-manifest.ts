#!/usr/bin/env tsx
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadManifestFromPackageDir } from './load-manifest.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const zuiPkgDir = join(__dirname, '../../zui')

const manifest = loadManifestFromPackageDir(zuiPkgDir)
if (!manifest) {
  console.error(`✗ Could not build a manifest from ${zuiPkgDir}`)
  process.exit(1)
}

const outPath = join(__dirname, 'manifest.json')
writeFileSync(outPath, JSON.stringify(manifest, null, 2))

const colorCount = manifest.tokens.filter((t) => t.color).length
console.log(
  `✓ manifest: ${manifest.classes.length} classes, ${manifest.tokens.length} tokens (${colorCount} with colour preview) → ${outPath}`,
)
