// @ts-check

import { resolve } from 'node:path'
import cloudflare from '@astrojs/cloudflare'
import mdx from '@astrojs/mdx'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare(),
  integrations: [mdx()],

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
      alias: {
        '@mrmartineau/zui/astro': resolve(
          import.meta.dirname,
          '../src/astro/index.ts',
        ),
        '@mrmartineau/zui/css': resolve(
          import.meta.dirname,
          '../dist/css/zui.css',
        ),
        '@mrmartineau/zui/utils': resolve(
          import.meta.dirname,
          '../src/utils/colorScheme.ts',
        ),
      },
    },
    ssr: {
      external: ['@mrmartineau/zui/vue'],
    },
  },
})
