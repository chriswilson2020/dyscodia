/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Static, client-only build. Single-file output so the app opens straight from
// the filesystem (file://) exactly like the prototype did — no server needed.
export default defineConfig({
  base: './',
  // No static assets to copy; a custom domain is configured in repo Settings,
  // so no CNAME file is needed for an Actions-deployed Pages site.
  publicDir: false,
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
