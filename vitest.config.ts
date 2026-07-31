import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: false,
    include: ['skills/evals/**/*.test.ts'],
    name: 'skills',
  },
})
