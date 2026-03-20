// @ts-check
import { defineConfig } from 'astro/config';
import { resolve } from 'node:path';

// https://astro.build/config
export default defineConfig({
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
  },
});
