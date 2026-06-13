import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '../../..');

export default defineConfig({
  plugins: [react()],
  base: '/libra/react-demo/',
  resolve: {
    alias: {
      '@libra-design/react': resolve(__dirname, '../src'),
      '@libra-design/tokens/css': resolve(__dirname, '../../tokens/src/index.css'),
    },
  },
  build: {
    outDir: resolve(root, 'docs/react-demo'),
  },
});
