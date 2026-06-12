import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: () => 'index.js',
    },
    rollupOptions: {
      external: ['fs', 'path', 'url', 'commander', 'fs-extra'],
    },
    // CLI 不需要压缩
    minify: false,
  },
});
