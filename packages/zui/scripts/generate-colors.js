#!/usr/bin/env node
/**
 * Generates src/css/tokens/colors.css using the same mathematical approach
 * as the reference SCSS — ease-in-out interpolation of lightness and chroma
 * over 11 steps (50–950) per color, so the output can be compared against
 * Tailwind's palette.
 *
 * To adjust a palette entry, edit the `palette` object below and re-run:
 *   node scripts/generate-colors.js
 */

import { writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ---------------------------------------------------------------------------
// Easing functions (ported from the reference SCSS)
// ---------------------------------------------------------------------------

const easeInOut = (t) => t * t * (3 - 2 * t)
// biome-ignore lint/correctness/noUnusedVariables: it might be used in the future
const easeLinear = (t) => t
// biome-ignore lint/correctness/noUnusedVariables: it might be used in the future
const easeIn = (t) => t * t
// biome-ignore lint/correctness/noUnusedVariables: it might be used in the future
const easeOut = (t) => t * (2 - t)

function roundTo(value, decimals = 2) {
  const factor = 10 ** decimals
  return Math.round(value * factor) / factor
}

// ---------------------------------------------------------------------------
// Scale generator
//
// Produces 11 steps matching Tailwind's shade names: 50 → 950.
// t runs 0 (lightest) → 1 (darkest) uniformly across the 11 steps.
// ---------------------------------------------------------------------------

const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

/**
 * @param {object} opts
 * @param {number}   opts.hue            Fixed hue (degrees)
 * @param {number}   opts.lightnessStart Lightness % at shade 50  (default 98)
 * @param {number}   opts.lightnessEnd   Lightness % at shade 950 (default 14)
 * @param {number}   opts.chromaStart    Chroma at shade 50
 * @param {number}   opts.chromaEnd      Chroma at shade 950
 * @param {Function} opts.ease           Easing function (default easeInOut)
 * @returns {Record<number, string>}
 */
function generateScale({
  hue,
  lightnessStart = 98,
  lightnessEnd = 14,
  chromaStart,
  chromaEnd,
  ease = easeInOut,
}) {
  const steps = SHADES.length
  return Object.fromEntries(
    SHADES.map((shade, i) => {
      const t = i / (steps - 1)
      const et = ease(t)

      const l = roundTo(
        lightnessStart - et * (lightnessStart - lightnessEnd),
        2,
      )
      const c = roundTo(chromaStart + et * (chromaEnd - chromaStart), 3)

      return [shade, `oklch(${l}% ${c} ${hue})`]
    }),
  )
}

// ---------------------------------------------------------------------------
// Palette definition
//
// Each entry needs:
//   hue         — the defining hue angle for that color family
//   chromaStart — chroma at the lightest shade (50)
//   chromaEnd   — chroma at the darkest shade (950)
//
// Grays/neutrals have very low chroma. Vivid colors reach 0.2–0.3.
// Hues are chosen to place each family at its perceptually correct angle.
// ---------------------------------------------------------------------------

const palette = {
  amber: { chromaEnd: 0.077, chromaStart: 0.022, hue: 84 },
  blue: { chromaEnd: 0.091, chromaStart: 0.014, hue: 261 },

  // Blues
  cyan: { chromaEnd: 0.056, chromaStart: 0.019, hue: 212 },
  emerald: { chromaEnd: 0.051, chromaStart: 0.021, hue: 164 },
  fuchsia: { chromaEnd: 0.136, chromaStart: 0.017, hue: 322 },
  gray: { chromaEnd: 0.028, chromaStart: 0.002, hue: 264 },
  green: { chromaEnd: 0.065, chromaStart: 0.018, hue: 151 },
  indigo: { chromaEnd: 0.09, chromaStart: 0.018, hue: 277 },

  // Cool greens
  lime: { chromaEnd: 0.072, chromaStart: 0.031, hue: 130 },

  // Custom neutrals (not in Tailwind core)
  mauve: { chromaEnd: 0.008, chromaStart: 0.003, hue: 324 },
  mist: { chromaEnd: 0.004, chromaStart: 0.002, hue: 213 },
  neutral: { chromaEnd: 0, chromaStart: 0, hue: 0 },
  olive: { chromaEnd: 0.006, chromaStart: 0.003, hue: 107 },
  orange: { chromaEnd: 0.079, chromaStart: 0.016, hue: 48 },
  pink: { chromaEnd: 0.109, chromaStart: 0.014, hue: 350 },
  purple: { chromaEnd: 0.149, chromaStart: 0.014, hue: 305 },

  // Warm chromas
  red: { chromaEnd: 0.092, chromaStart: 0.013, hue: 25 },
  rose: { chromaEnd: 0.105, chromaStart: 0.015, hue: 13 },
  sky: { chromaEnd: 0.066, chromaStart: 0.013, hue: 237 },
  // Neutral grays
  slate: { chromaEnd: 0.042, chromaStart: 0.003, hue: 258 },
  stone: { chromaEnd: 0.004, chromaStart: 0.001, hue: 67 },
  taupe: { chromaEnd: 0.004, chromaStart: 0.002, hue: 43 },
  teal: { chromaEnd: 0.046, chromaStart: 0.014, hue: 183 },

  // Purples & pinks
  violet: { chromaEnd: 0.141, chromaStart: 0.016, hue: 293 },
  yellow: { chromaEnd: 0.066, chromaStart: 0.026, hue: 95 },
  zinc: { chromaEnd: 0.005, chromaStart: 0, hue: 286 },
}

// ---------------------------------------------------------------------------
// Generate CSS
// ---------------------------------------------------------------------------

function generate() {
  const lines = [
    '/* Generated by scripts/generate-colors.js — do not edit by hand */',
    '',
    '@layer tokens {',
    '  :root {',
    '    --color-black: #000;',
    '    --color-white: #fff;',
    '    --color-transparent: transparent;',
    '    --color-inherit: inherit;',
    '    --color-current: currentcolor;',
  ]

  for (const [name, config] of Object.entries(palette)) {
    const scale = generateScale(config)
    lines.push('')
    for (const [shade, value] of Object.entries(scale)) {
      lines.push(`    --color-${name}-${shade}: ${value};`)
    }
  }

  lines.push('  }', '}', '')
  return lines.join('\n')
}

// ---------------------------------------------------------------------------
// Write
// ---------------------------------------------------------------------------

const outPath = resolve(__dirname, '../src/css/tokens/color-gen.css')
writeFileSync(outPath, generate(), 'utf8')
console.log(`Written: ${outPath}`)
