// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { resolve } from 'node:path';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  integrations: [mdx()],

  vite: {
    resolve: {
      alias: {
        '@mrmartineau/zui/css': resolve(import.meta.dirname, '../dist/css/zui.css'),
      },
    },
  },

  markdown: {
    shikiConfig: {
      themes: {
        light: 'rose-pine-dawn',
        dark: 'rose-pine',
      },
      defaultColor: 'light-dark()',
    },
    smartypants: false,
  },

  adapter: cloudflare(),
});