// @ts-check

import { resolve } from 'node:path'
import cloudflare from '@astrojs/cloudflare'
import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import { defineConfig } from 'astro/config'
import d1Search from 'astro-d1-search'
import searchConfig from './search.config.ts'

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare(),
  integrations: [mdx(), react(), d1Search(searchConfig)],

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
