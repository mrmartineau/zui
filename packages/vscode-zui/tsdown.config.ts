import { defineConfig } from 'tsdown'

export default defineConfig({
  clean: true,
  deps: {
    neverBundle: ['vscode'],
  },
  entry: { extension: 'src/extension.ts' },
  format: 'cjs',
  outDir: 'dist',
  platform: 'node',
  sourcemap: true,
  target: 'node18',
})
