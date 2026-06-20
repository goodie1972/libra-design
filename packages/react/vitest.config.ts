import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
    // 强制 NODE_ENV=test，确保 React 加载 development 构建（含 act 函数）。
    // 修复当 shell 全局 NODE_ENV=production 时 react.act 报 "is not a function" 的问题。
    env: {
      NODE_ENV: 'test',
    },
  },
  resolve: {
    alias: {
      '@libra-design/react': resolve(__dirname, 'src'),
    },
  },
});
