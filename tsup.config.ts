import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/**/*.ts', '!src/infra/db/migrations/**/*'],
  clean: true,
  format: 'esm',
  outDir: 'dist',
})
