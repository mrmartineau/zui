// @ts-check
import mdx from '@astrojs/mdx'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
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
})
