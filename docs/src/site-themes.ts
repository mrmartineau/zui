/**
 * The showcase themes, as swatch data for previews. Mirrors the real theme
 * blocks in styles/site-themes.css (which apply site-wide via data-site-theme)
 * and the CodePen demos on /guides/theming-showcase.
 *
 * Colours use the same light-dark() pairs as the real themes so previews
 * follow the docs' colour scheme. Terminal is pinned dark (its theme forces
 * color-scheme: dark); Brutalist inverts to black-on-dark.
 */
export interface SiteThemePreview {
  slug: string
  name: string
  note: string
  accent: string
  bg: string
  surface: string
  border: string
  text: string
  onAccent: string
  radius: string
  font: string
}

export const siteThemes: SiteThemePreview[] = [
  {
    accent: 'light-dark(var(--color-rose-600), var(--color-rose-400))',
    bg: 'light-dark(oklch(0.98 0.02 70), var(--color-stone-900))',
    border: 'light-dark(oklch(0.9 0.03 60), var(--color-stone-700))',
    font: 'var(--font-stack-serif)',
    name: 'Golden Hour',
    note: 'Warm serif editorial',
    onAccent: 'light-dark(#ffffff, oklch(0.2 0.05 20))',
    radius: '10px',
    slug: 'golden-hour',
    surface: 'light-dark(oklch(1 0.008 80), var(--color-stone-800))',
    text: 'light-dark(var(--color-stone-800), var(--color-stone-100))',
  },
  {
    accent: 'oklch(0.86 0.21 150)',
    bg: 'oklch(0.17 0.02 150)',
    border: 'oklch(0.34 0.04 150)',
    font: 'var(--font-stack-mono)',
    name: 'Terminal',
    note: 'Mono, dark, zero radius',
    onAccent: '#0a0e0a',
    radius: '0',
    slug: 'terminal',
    surface: 'oklch(0.21 0.02 150)',
    text: 'oklch(0.9 0.07 150)',
  },
  {
    accent: 'light-dark(var(--color-fuchsia-600), var(--color-fuchsia-400))',
    bg: 'light-dark(oklch(0.97 0.03 340), oklch(0.2 0.05 330))',
    border: 'light-dark(oklch(0.9 0.06 335), oklch(0.35 0.06 330))',
    font: 'var(--font-stack-sans)',
    name: 'Bubblegum',
    note: 'Round & playful',
    onAccent: 'light-dark(#ffffff, oklch(0.2 0.08 330))',
    radius: '18px',
    slug: 'bubblegum',
    surface: 'light-dark(#ffffff, oklch(0.25 0.05 330))',
    text: 'light-dark(oklch(0.36 0.11 340), oklch(0.94 0.03 340))',
  },
  {
    accent: 'light-dark(var(--color-blue-600), var(--color-blue-400))',
    bg: 'light-dark(var(--color-slate-100), var(--color-slate-900))',
    border: 'light-dark(var(--color-slate-300), var(--color-slate-700))',
    font: 'var(--font-stack-sans)',
    name: 'Nordic',
    note: 'Crisp & corporate',
    onAccent: 'light-dark(#ffffff, oklch(0.2 0.06 250))',
    radius: '3px',
    slug: 'nordic',
    surface: 'light-dark(#ffffff, var(--color-slate-800))',
    text: 'light-dark(var(--color-slate-800), var(--color-slate-200))',
  },
  {
    accent: 'var(--color-yellow-400)',
    bg: 'light-dark(#faf9f0, #111111)',
    border: 'light-dark(#111111, #fafafa)',
    font: 'var(--font-stack-sans)',
    name: 'Brutalist',
    note: 'High-contrast, square',
    onAccent: '#111111',
    radius: '0',
    slug: 'brutalist',
    surface: 'light-dark(#ffffff, #1a1a1a)',
    text: 'light-dark(#111111, #fafafa)',
  },
]
