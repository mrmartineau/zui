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
          '../packages/zui/src/astro/index.ts',
        ),
        '@mrmartineau/zui/css': resolve(
          import.meta.dirname,
          '../packages/zui/dist/css/zui.css',
        ),
        '@mrmartineau/zui/utils': resolve(
          import.meta.dirname,
          '../packages/zui/src/utils/colorScheme.ts',
        ),
        '@mrmartineau/zui-theme/astro': resolve(
          import.meta.dirname,
          '../packages/zui-theme/src/astro/index.ts',
        ),
        '@mrmartineau/zui-theme/nav': resolve(
          import.meta.dirname,
          '../packages/zui-theme/src/nav.ts',
        ),
        '@mrmartineau/zui-theme/css': resolve(
          import.meta.dirname,
          '../packages/zui-theme/src/css/theme.css',
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
