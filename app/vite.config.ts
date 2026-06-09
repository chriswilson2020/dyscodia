/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Static, client-only build. Single-file output so the app opens straight from
// the filesystem (file://) exactly like the prototype did — no server needed.
export default defineConfig({
  base: './',
  plugins: [viteSingleFile()],
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    cssCodeSplit: false,
    assetsInlineLimit: 100000000,
    target: 'es2020',
  },
  test: {
    environment: 'node',
    include: ['test/**/*.test.ts'],
  },
});
