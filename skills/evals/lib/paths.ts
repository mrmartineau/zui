import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

/** Repo root, resolved from this file's location (skills/evals/lib). */
export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..')

export const SKILLS_DIR = join(ROOT, 'skills')

/** Recursively collect files under `dir` whose name ends with one of `exts`. */
export function walk(
  dir: string,
  exts: string[],
  acc: string[] = [],
): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'dist') continue
      walk(path, exts, acc)
    } else if (exts.some((ext) => entry.name.endsWith(ext))) {
      acc.push(path)
    }
  }
  return acc
}

export function read(path: string): string {
  return readFileSync(path, 'utf8')
}

export function readJson<T = unknown>(path: string): T {
  return JSON.parse(read(path)) as T
}

/** Path relative to the repo root, for readable assertion messages. */
export function rel(path: string): string {
  return path.startsWith(ROOT) ? path.slice(ROOT.length + 1) : path
}
