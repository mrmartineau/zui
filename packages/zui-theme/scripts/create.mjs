#!/usr/bin/env node

import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pkgRoot = join(__dirname, '..')
const templateDir = join(pkgRoot, 'template')

const c = {
  bold: '\x1b[1m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
  yellow: '\x1b[33m',
}

function abort(msg) {
  console.error(`${c.red}✗${c.reset} ${msg}`)
  process.exit(1)
}

// Depending on the npm version, `npx @mrmartineau/zui-theme create-zui-docs <dir>`
// may forward the bin name itself as the first argument. Drop a leading
// `create-zui-docs` token so the target directory is parsed correctly whether
// invoked via npx or directly with `node create.mjs <dir>`.
const args = process.argv.slice(2)
if (args[0] === 'create-zui-docs') args.shift()
const targetRel = args[0] ?? 'zui-docs'
const target = join(process.cwd(), targetRel)

if (existsSync(target)) {
  abort(`Directory "${targetRel}" already exists. Choose another name.`)
}

if (!existsSync(templateDir)) {
  abort('Could not locate the starter template inside @mrmartineau/zui-theme.')
}

console.log(
  `\n${c.bold}Create ZUI docs${c.reset} — scaffolding a new docs site\n`,
)

mkdirSync(target, { recursive: true })
cpSync(templateDir, target, {
  filter: (src) => !src.endsWith('.DS_Store'),
  recursive: true,
})

// npm never packs files named .gitignore, so the template ships it as
// `gitignore` and we restore the real name here.
const gitignorePath = join(target, 'gitignore')
if (existsSync(gitignorePath)) {
  renameSync(gitignorePath, join(target, '.gitignore'))
}

// Set the project name in the copied package.json to the target folder name.
const pkgJsonPath = join(target, 'package.json')
if (existsSync(pkgJsonPath)) {
  const pkg = JSON.parse(readFileSync(pkgJsonPath, 'utf8'))
  pkg.name = basename(targetRel)
  writeFileSync(pkgJsonPath, `${JSON.stringify(pkg, null, 2)}\n`)
}

console.log(`${c.green}✓${c.reset} Created ${c.cyan}${targetRel}${c.reset}\n`)
console.log('Next steps:')
console.log(`  ${c.dim}1.${c.reset} cd ${targetRel}`)
console.log(`  ${c.dim}2.${c.reset} npm install`)
console.log(`  ${c.dim}3.${c.reset} npm run dev`)
console.log(
  `\nEdit ${c.cyan}src/site.config.ts${c.reset} to set your site name, links, and version.`,
)
console.log(
  `Add pages under ${c.cyan}src/pages/${c.reset} — the sidebar builds itself from them.\n`,
)
