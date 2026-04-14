#!/usr/bin/env node

import { createInterface } from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import {
  existsSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  cpSync,
} from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pkgRoot = join(__dirname, '..')
const cwd = process.cwd()

// Terminal colours
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
}

function success(msg) {
  console.log(`${c.green}✓${c.reset} ${msg}`)
}
function warn(msg) {
  console.log(`${c.yellow}⚠${c.reset}  ${msg}`)
}
function info(msg) {
  console.log(`${c.blue}→${c.reset} ${msg}`)
}
function abort(msg) {
  console.error(`${c.red}✗${c.reset} ${msg}`)
  process.exit(1)
}

async function prompt(rl, question, defaultVal) {
  const hint = defaultVal ? ` ${c.dim}[${defaultVal}]${c.reset}` : ''
  const answer = await rl.question(`${question}${hint} `)
  return answer.trim() || defaultVal || ''
}

async function select(rl, question, options) {
  console.log(`\n${question}`)
  options.forEach((opt, i) => console.log(`  ${c.dim}${i + 1}.${c.reset} ${opt}`))
  const answer = await rl.question(`\nEnter number: `)
  const idx = parseInt(answer.trim(), 10) - 1
  if (idx < 0 || idx >= options.length || Number.isNaN(idx)) {
    abort('Invalid selection.')
  }
  return options[idx]
}

async function confirm(rl, question) {
  const answer = await rl.question(`${question} ${c.dim}[y/N]${c.reset} `)
  return answer.trim().toLowerCase() === 'y'
}

function detectPackageManager() {
  if (existsSync(join(cwd, 'pnpm-lock.yaml'))) return 'pnpm'
  if (existsSync(join(cwd, 'yarn.lock'))) return 'yarn'
  if (existsSync(join(cwd, 'bun.lockb')) || existsSync(join(cwd, 'bun.lock'))) return 'bun'
  return 'npm'
}

function copyDir(src, dest) {
  mkdirSync(dest, { recursive: true })
  cpSync(src, dest, {
    recursive: true,
    filter: (src) => !src.endsWith('.DS_Store'),
  })
}

function patchImport(filePath, from, to) {
  if (!existsSync(filePath)) return
  const content = readFileSync(filePath, 'utf8')
  const patched = content.replaceAll(from, to)
  if (patched !== content) {
    writeFileSync(filePath, patched)
  }
}

async function main() {
  const rl = createInterface({ input, output })

  console.log(`\n${c.bold}ZUI Init${c.reset} — copy source files into your project\n`)

  // 1. Check for existing @mrmartineau/zui in the user's project
  const userPkgPath = join(cwd, 'package.json')
  if (existsSync(userPkgPath)) {
    const userPkg = JSON.parse(readFileSync(userPkgPath, 'utf8'))
    const allDeps = {
      ...userPkg.dependencies,
      ...userPkg.devDependencies,
    }
    if (allDeps['@mrmartineau/zui']) {
      warn(`@mrmartineau/zui is listed in your package.json.`)
      warn(`Continuing will copy source files that may conflict with the installed package.`)
      const ok = await confirm(rl, 'Continue anyway?')
      if (!ok) {
        console.log('\nAborted.')
        rl.close()
        process.exit(0)
      }
      console.log('')
    }
  }

  // 2. Framework selection
  const framework = await select(rl, 'Which framework are you using?', [
    'React',
    'Astro',
    'Svelte',
    'CSS only',
  ])

  // 3. CSS destination
  const cssDestRel = await prompt(
    rl,
    '\nWhere should CSS files go?',
    'src/styles/zui',
  )
  const cssDest = join(cwd, cssDestRel)

  // 4. Components destination (skipped for CSS only)
  let compDest = null
  let compDestRel = null
  if (framework !== 'CSS only') {
    compDestRel = await prompt(
      rl,
      'Where should component files go?',
      'src/components/zui',
    )
    compDest = join(cwd, compDestRel)
  }

  rl.close()
  console.log('')

  // 5. Copy CSS (all frameworks)
  info(`Copying CSS → ${cssDestRel}`)
  copyDir(join(pkgRoot, 'src/css'), cssDest)
  success('CSS files copied')

  // 6. Copy React components
  if (framework === 'React' && compDest && compDestRel) {
    info(`Copying React components → ${compDestRel}/react`)
    copyDir(join(pkgRoot, 'src/react'), join(compDest, 'react'))

    info(`Copying shared variants → ${compDestRel}/shared`)
    copyDir(join(pkgRoot, 'src/shared'), join(compDest, 'shared'))

    // Copy colorScheme utility into shared/
    cpSync(
      join(pkgRoot, 'src/utils/colorScheme.ts'),
      join(compDest, 'shared/colorScheme.ts'),
    )

    // Patch imports that pointed at ../utils/colorScheme → ../shared/colorScheme
    patchImport(
      join(compDest, 'react/useColorScheme.ts'),
      `'../utils/colorScheme'`,
      `'../shared/colorScheme'`,
    )
    patchImport(
      join(compDest, 'react/index.ts'),
      `'../utils/colorScheme'`,
      `'../shared/colorScheme'`,
    )

    success('React components copied')
  }

  // 7. Copy Astro components
  if (framework === 'Astro' && compDest && compDestRel) {
    info(`Copying Astro components → ${compDestRel}/astro`)
    copyDir(join(pkgRoot, 'src/astro'), join(compDest, 'astro'))

    info(`Copying shared variants → ${compDestRel}/shared`)
    copyDir(join(pkgRoot, 'src/shared'), join(compDest, 'shared'))

    // Copy colorScheme utility into shared/
    cpSync(
      join(pkgRoot, 'src/utils/colorScheme.ts'),
      join(compDest, 'shared/colorScheme.ts'),
    )

    success('Astro components copied')
  }

  // 7b. Copy Svelte components
  if (framework === 'Svelte' && compDest && compDestRel) {
    info(`Copying Svelte components → ${compDestRel}/svelte`)
    copyDir(join(pkgRoot, 'src/svelte'), join(compDest, 'svelte'))

    info(`Copying shared variants → ${compDestRel}/shared`)
    copyDir(join(pkgRoot, 'src/shared'), join(compDest, 'shared'))

    // Copy colorScheme utility into shared/
    cpSync(
      join(pkgRoot, 'src/utils/colorScheme.ts'),
      join(compDest, 'shared/colorScheme.ts'),
    )

    // Patch the useColorScheme rune file to point at the local copy
    patchImport(
      join(compDest, 'svelte/useColorScheme.svelte.ts'),
      `'../utils/colorScheme'`,
      `'../shared/colorScheme'`,
    )
    patchImport(
      join(compDest, 'svelte/index.ts'),
      `'../utils/colorScheme'`,
      `'../shared/colorScheme'`,
    )

    success('Svelte components copied')
  }

  // 8. Install cva
  if (framework !== 'CSS only') {
    const pm = detectPackageManager()
    const installCmds = {
      npm: 'npm install cva',
      pnpm: 'pnpm add cva',
      yarn: 'yarn add cva',
      bun: 'bun add cva',
    }
    info(`Installing cva via ${pm}…`)
    try {
      execSync(installCmds[pm], { cwd, stdio: 'inherit' })
      success('cva installed')
    } catch {
      warn(`Could not auto-install cva. Run manually: ${installCmds[pm]}`)
    }
  }

  // 9. Summary
  console.log('')
  console.log(`${c.bold}${c.green}Done!${c.reset}`)
  console.log('')
  console.log('Next steps:')
  console.log(
    `  1. Import the CSS in your app entry point:\n     ${c.cyan}import './${cssDestRel}/index.css'${c.reset}`,
  )

  if (framework === 'React' && compDestRel) {
    console.log(
      `  2. Import components from your local copy:\n     ${c.cyan}import { Button } from './${compDestRel}/react/index'${c.reset}`,
    )
  }

  if (framework === 'Astro' && compDestRel) {
    console.log(
      `  2. Import components from your local copy:\n     ${c.cyan}import Button from './${compDestRel}/astro/Button.astro'${c.reset}`,
    )
  }

  if (framework === 'Svelte' && compDestRel) {
    console.log(
      `  2. Import components from your local copy:\n     ${c.cyan}import { Button } from './${compDestRel}/svelte/index'${c.reset}`,
    )
  }

  console.log('')
  warn(
    `@mrmartineau/zui is no longer needed. Remove it from your package.json when you're ready.`,
  )
  console.log('')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
