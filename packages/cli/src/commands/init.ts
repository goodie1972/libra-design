import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';

/**
 * 初始化 libra 设计 Token 到目标项目。
 *
 * 1. 创建 src/styles/ 目录
 * 2. 写入 tokens.css
 * 3. 可选的 Tailwind CSS preset
 */
export function initCommand(opts: { yes?: boolean }): void {
  const cwd = process.cwd();
  const stylesDir = resolve(cwd, 'src/styles');
  const tokensPath = resolve(stylesDir, 'tokens.css');

  console.log('');
  console.log('  ⚡ 初始化 @libra-design/tokens 到项目...');
  console.log('');

  if (existsSync(tokensPath) && !opts.yes) {
    console.error('  ⚠  tokens.css 已存在。用 -y 覆盖。');
    process.exit(1);
  }

  // 创建目录
  if (!existsSync(stylesDir)) {
    mkdirSync(stylesDir, { recursive: true });
    console.log(`  ✓ 创建 ${stylesDir}`);
  }

  // 写入 tokens.css
  const tokensCss = `/* ============================================================
   @libra-design/tokens — libra 设计系统 Token
   由 @libra-design/cli init 生成
   ============================================================ */

:root {
  /* === 涨跌色（全局常量）=== */
  --up:           #ef5350;
  --down:         #26a69a;
  --flat:         #9e9e9e;
  --up-bg:        rgba(239, 83, 80, 0.08);
  --down-bg:      rgba(38, 166, 154, 0.08);

  /* === K 线均线色 === */
  --ma5:          #f8b500;
  --ma10:         #4a6cf7;
  --ma20:         #9c27b0;
  --ma60:         #009688;

  /* === 功能色 === */
  --success:      #34a853;
  --warning:      #fbbc04;
  --error:        #ea4335;

  /* === 暗色端点（会被 @libra-design/theme 动态改写）=== */
  --bg-root:       #0d0e10;
  --bg-card:       #131416;
  --bg-card-hover: #16171b;
  --bg-input:      #191a1d;
  --border-main:   #1e1f23;
  --border-sub:    #1a1b1e;
  --text-primary:  #e8e8ea;
  --text-secondary:#a0a1a7;
  --text-tertiary: #6b6c73;
  --accent:        #4a6cf7;
  --accent-hover:  #5d7cf9;

  /* === 字体 === */
  --font-body:  'Inter', -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif;
  --font-mono:  'JetBrains Mono', 'SF Mono', 'Cascadia Code', monospace;

  /* === 间距（4px 基数）=== */
  --space-1: 4px;   --space-2: 8px;   --space-3: 12px;
  --space-4: 16px;  --space-5: 24px;  --space-6: 32px;
  --space-7: 48px;  --space-8: 64px;

  /* === 结构 === */
  --btn-radius:    8px;
  --card-radius:   10px;
  --card-shadow:   none;
  --card-border:   1px solid var(--border-main);
}
`;

  writeFileSync(tokensPath, tokensCss, 'utf-8');
  console.log(`  ✓ 写入 ${tokensPath}`);
  console.log('');
  console.log('  下一步:');
  console.log('    1. 在入口文件 import "./styles/tokens.css"');
  console.log('    2. 若需主题引擎: npm install @libra-design/theme');
  console.log('    3. 添加组件: npx libra add <组件名>');
  console.log('');
}
