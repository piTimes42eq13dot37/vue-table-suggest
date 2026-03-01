import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('/quasar/')) return 'vendor-quasar'
          return 'vendor'
        },
      },
    },
  },
  test: {
    include: ['src/**/*.spec.ts'],
    environment: 'jsdom',
    globals: true,
    exclude: ['tests/e2e/**', 'playwright.config.ts', '**/node_modules/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.ts', 'src/**/*.vue'],
      exclude: ['src/main.ts', 'src/lib/demo-data.ts', '**/*.spec.ts'],
      thresholds: {
        lines: 80,
        functions: 80,
        statements: 80,
        branches: 80,
      },
    },
  },
})
