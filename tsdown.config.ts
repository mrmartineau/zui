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
    entry: {
      'solid/index': 'src/solid/index.ts',
    },
    format: 'esm',
    dts: true,
    clean: ['dist/solid'],
    tsconfig: 'src/solid/tsconfig.json',
    deps: {
      neverBundle: ['solid-js', 'solid-js/web'],
    },
  },

  {
    entry: {
      'utils/index': 'src/utils/colorScheme.ts',
    },
    format: 'esm',
    dts: true,
    clean: ['dist/utils'],
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
