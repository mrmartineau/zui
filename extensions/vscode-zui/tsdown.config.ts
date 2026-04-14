import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: { extension: 'src/extension.ts' },
  format: 'cjs',
  outDir: 'dist',
  platform: 'node',
  target: 'node18',
  sourcemap: true,
  clean: true,
  deps: {
    neverBundle: ['vscode'],
  },
})
