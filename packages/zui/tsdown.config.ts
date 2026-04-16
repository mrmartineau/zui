import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    clean: ['dist/react'],
    deps: {
      neverBundle: ['react', 'react/jsx-runtime'],
    },
    dts: true,
    entry: {
      'react/index': 'src/react/index.ts',
    },
    format: 'esm',
  },
  {
    clean: ['dist/solid'],
    deps: {
      neverBundle: ['solid-js', 'solid-js/web'],
    },
    dts: true,
    entry: {
      'solid/index': 'src/solid/index.ts',
    },
    format: 'esm',
    tsconfig: 'src/solid/tsconfig.json',
  },

  {
    clean: ['dist/utils'],
    dts: true,
    entry: {
      'utils/index': 'src/utils/colorScheme.ts',
    },
    format: 'esm',
  },
  {
    clean: false,
    css: {
      fileName: 'css/zui.css',
      minify: false,
    },
    entry: ['src/css/index.css'],
  },
  {
    clean: false,
    css: {
      fileName: 'css/zui.min.css',
      minify: true,
    },
    entry: ['src/css/index.css'],
  },
])
