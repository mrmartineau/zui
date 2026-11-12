// @ts-check

import { readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import cloudflare from '@astrojs/cloudflare'
import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import { defineConfig } from 'astro/config'
import reactions from 'astro-d1-reactions'
import d1Search from 'astro-d1-search'
import searchConfig from './search.config.ts'

// The stats page lists only these pages. Anyone can post a made-up path to
// the reactions API, so unknown paths stay off the public dashboard.
// Every .mdx page has a `title:`. Index pages share titles like "Overview",
// so they get their folder name in front: "Components: Overview".
const pagesDir = resolve(import.meta.dirname, 'src/pages')
const reactionPages = [
  { title: 'Changelog', url: '/changelog' },
  ...readdirSync(pagesDir, { recursive: true })
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const folder = file.match(/^(.+)\/index\.mdx$/)?.[1]
      const title = readFileSync(join(pagesDir, file), 'utf8').match(
        /^title: (.+)$/m,
      )?.[1]
      return {
        title: folder
          ? `${folder[0].toUpperCase()}${folder.slice(1)}: ${title}`
          : title,
        // `index` must be a whole path segment, or `tokens/z-index` loses its tail
        url: `/${file.replace(/\.mdx$/, '').replace(/(?:^|\/)index$/, '')}`,
      }
    }),
]

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare(),
  integrations: [
    mdx(),
    react(),
    d1Search(searchConfig),
    reactions({ database: 'zui-docs', pages: reactionPages }),
  ],

  markdown: {
    shikiConfig: {
      defaultColor: 'light-dark()',
      themes: {
        dark: 'rose-pine',
        light: 'rose-pine-dawn',
      },
    },
    smartypants: false,
  },

  vite: {
    optimizeDeps: {
      exclude: ['@mrmartineau/zui/vue'],
    },
    resolve: {
      // biome-ignore assist/source/useSortedKeys: Vite matches aliases as prefixes, so /css/ramka must come before /css
      alias: {
        '@mrmartineau/zui-theme/astro': resolve(
          import.meta.dirname,
          '../packages/zui-theme/src/astro/index.ts',
        ),
        '@mrmartineau/zui-theme/css': resolve(
          import.meta.dirname,
          '../packages/zui-theme/src/css/theme.css',
        ),
        '@mrmartineau/zui-theme/nav': resolve(
          import.meta.dirname,
          '../packages/zui-theme/src/nav.ts',
        ),
        '@mrmartineau/zui/astro': resolve(
          import.meta.dirname,
          '../packages/zui/src/astro/index.ts',
        ),
        '@mrmartineau/zui/css/ramka': resolve(
          import.meta.dirname,
          '../packages/zui/src/css/integrations/ramka.css',
        ),
        '@mrmartineau/zui/css': resolve(
          import.meta.dirname,
          '../packages/zui/dist/css/zui.css',
        ),
        '@mrmartineau/zui/utils': resolve(
          import.meta.dirname,
          '../packages/zui/src/utils/colorScheme.ts',
        ),
      },
    },
    server: {
      fs: {
        allow: ['..'],
      },
    },
    ssr: {
      external: ['@mrmartineau/zui/vue'],
    },
  },
})
