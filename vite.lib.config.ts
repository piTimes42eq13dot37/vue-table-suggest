import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [vue()],
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(rootDir, 'src/public-api.ts'),
      name: 'VueTableSuggest',
      formats: ['es', 'cjs', 'iife'],
      fileName: (format) => {
        if (format === 'es') return 'index.js'
        if (format === 'cjs') return 'index.cjs'
        return 'index.global.js'
      },
    },
    rollupOptions: {
      external: ['vue', 'quasar'],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
          quasar: 'Quasar',
        },
      },
    },
    outDir: 'dist/lib',
    emptyOutDir: true,
  },
})
