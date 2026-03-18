import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    entry: {
      'react/index': 'src/react/index.ts',
    },
    format: 'esm',
    dts: true,
    clean: ['dist/react'],
    deps: {
      neverBundle: ['react', 'react/jsx-runtime'],
    },
  },
  {
    entry: ['src/css/index.css'],
    css: {
      minify: false,
      fileName: 'css/zui.css',
    },
    clean: false,
  },
  {
    entry: ['src/css/index.css'],
    css: {
      minify: true,
      fileName: 'css/zui.min.css',
    },
    clean: false,
  },
])
