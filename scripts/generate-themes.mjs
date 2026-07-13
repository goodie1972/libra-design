/**
 * 主题数据统一生成器
 *
 * 从 tokens/themes/*.json 读取 10 套命名主题的色值数据，
 * 生成 packages/theme/src/themes.generated.ts（TypeScript 源代码）。
 *
 * 这样 TS、Go、Rust 三语言都从同一份 JSON 源文件派生，
 * 避免硬编码带来的数据漂移。
 *
 * @example
 * node scripts/generate-themes.mjs
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const THEMES_DIR = join(ROOT, 'tokens', 'themes');
const OUTPUT = join(ROOT, 'packages', 'theme', 'src', 'themes.generated.ts');

/** 设计令牌的全部键名列表（与 DARK_ENDPOINT 一致） */
const COLOR_KEYS = [
  'bg-root',
  'bg-main',
  'bg-sidebar',
  'bg-card',
  'bg-card-hover',
  'bg-input',
  'bg-chart',
  'bg-sub-panel',
  'border-main',
  'border-sub',
  'border-input',
  'text-primary',
  'text-secondary',
  'text-tertiary',
  'accent',
  'accent-hover',
  'grid-line',
];

/**
 * 将 JSON 主题数据渲染为 TypeScript 对象条目
 */
function renderThemeEntries(themes, side) {
  const lines = [];
  for (const [id, theme] of Object.entries(themes)) {
    const colors = theme[side];
    lines.push(`  ${id}: {`);
    for (const key of COLOR_KEYS) {
      lines.push(`    '${key}': '${colors[key]}',`);
    }
    lines.push('  },');
  }
  return lines.join('\n');
}

function main() {
  // 读取所有主题 JSON
  const files = readdirSync(THEMES_DIR)
    .filter((f) => f.endsWith('.json'))
    .sort();

  const themes = {};
  for (const file of files) {
    const id = file.replace('.json', '');
    const content = readFileSync(join(THEMES_DIR, file), 'utf-8');
    themes[id] = JSON.parse(content);
  }

  const ids = Object.keys(themes).sort();

  // 生成 TypeScript 源码
  const code = `// @generated — 由 scripts/generate-themes.mjs 自动生成
// 源文件: tokens/themes/*.json
// 请勿手动编辑。如需修改主题色值，请编辑源 JSON 文件后重新生成。

import type { ThemeId, ThemeColors } from '@libra-design/tokens';

/** 10 套命名主题 — 暗色端点色值（自动生成） */
export const THEME_DARK: Record<ThemeId, ThemeColors> = {
${renderThemeEntries(themes, 'dark')}
};

/** 10 套命名主题 — 亮色端点色值（自动生成） */
export const THEME_LIGHT: Record<ThemeId, ThemeColors> = {
${renderThemeEntries(themes, 'light')}
};

/** 主题 ID 排序列表（自动生成） */
export const THEME_IDS: ThemeId[] = [
${ids.map((id) => `  '${id}',`).join('\n')}
];
`;

  writeFileSync(OUTPUT, code, 'utf-8');
  console.log(`✓ 已生成 ${OUTPUT} （${ids.length} 个主题）`);
}

main();
