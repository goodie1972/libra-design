/**
 * @libra-design/theme — 主题注册表
 *
 * 10 套命名金融主题的加载、注册与切换。
 * 与 mixer.ts 的 applyMix 正交组合：先选主题（选色板），再调 mix（选亮暗比例）。
 *
 * @example
 * ```ts
 * import { applyTheme, getTheme, listThemes, THEME_REGISTRY } from '@libra-design/theme';
 * applyTheme('terminal');   // 切换到 Bloomberg Terminal 风格
 * applyTheme('ticker');     // 切换到交易所大屏风格
 * ```
 */

import type { ThemeColors, ThemeId, Theme } from '@libra-design/tokens';
import { _setEndpoints } from './mixer.js';

/* ============================================================
   主题数据 — 从 tokens/themes/*.json 编译内嵌
   ============================================================ */

/**
 * 10 套命名主题 — 暗色端点色值
 *
 * 与 Rust libra-tokens::themes / Go tokens.ListThemes() 一致。
 */
export const THEME_DARK: Record<ThemeId, ThemeColors> = {
  terminal: {
    'bg-root': '#0c0c0e',
    'bg-main': '#0c0c0e',
    'bg-sidebar': '#0c0c0e',
    'bg-card': '#151518',
    'bg-card-hover': '#1c1c20',
    'bg-input': '#1c1c20',
    'bg-chart': '#0c0c0e',
    'bg-sub-panel': '#151518',
    'border-main': '#252528',
    'border-sub': '#1c1c20',
    'border-input': '#252528',
    'text-primary': '#e8e8ed',
    'text-secondary': '#b8b8bf',
    'text-tertiary': '#a0a0a8',
    accent: '#f59e0b',
    'accent-hover': '#fbbf24',
    'grid-line': '#1a1a1e',
  },
  ticker: {
    'bg-root': '#0a1628',
    'bg-main': '#0a1628',
    'bg-sidebar': '#0a1628',
    'bg-card': '#0f1f3d',
    'bg-card-hover': '#142850',
    'bg-input': '#142850',
    'bg-chart': '#0a1628',
    'bg-sub-panel': '#0f1f3d',
    'border-main': '#1a3560',
    'border-sub': '#142850',
    'border-input': '#1a3560',
    'text-primary': '#e8f0fe',
    'text-secondary': '#a8b8d8',
    'text-tertiary': '#8ca0c4',
    accent: '#3b82f6',
    'accent-hover': '#60a5fa',
    'grid-line': '#0f1f3d',
  },
  vault: {
    'bg-root': '#18181b',
    'bg-main': '#18181b',
    'bg-sidebar': '#18181b',
    'bg-card': '#1f1f23',
    'bg-card-hover': '#26262b',
    'bg-input': '#26262b',
    'bg-chart': '#18181b',
    'bg-sub-panel': '#1f1f23',
    'border-main': '#333338',
    'border-sub': '#26262b',
    'border-input': '#333338',
    'text-primary': '#e8e4dc',
    'text-secondary': '#b8b0a0',
    'text-tertiary': '#9a9080',
    accent: '#d4a853',
    'accent-hover': '#e0b96a',
    'grid-line': '#1f1f23',
  },
  margin: {
    'bg-root': '#09090b',
    'bg-main': '#09090b',
    'bg-sidebar': '#09090b',
    'bg-card': '#111113',
    'bg-card-hover': '#18181b',
    'bg-input': '#18181b',
    'bg-chart': '#09090b',
    'bg-sub-panel': '#111113',
    'border-main': '#1e1e22',
    'border-sub': '#18181b',
    'border-input': '#1e1e22',
    'text-primary': '#e8e8ed',
    'text-secondary': '#a0a0a6',
    'text-tertiary': '#707076',
    accent: '#ef4444',
    'accent-hover': '#f87171',
    'grid-line': '#141416',
  },
  ledger: {
    'bg-root': '#faf9f6',
    'bg-main': '#faf9f6',
    'bg-sidebar': '#faf9f6',
    'bg-card': '#ffffff',
    'bg-card-hover': '#f2efe8',
    'bg-input': '#eae6dc',
    'bg-chart': '#faf9f6',
    'bg-sub-panel': '#ffffff',
    'border-main': '#d4c8b0',
    'border-sub': '#e8dcc8',
    'border-input': '#d4c8b0',
    'text-primary': '#1a1814',
    'text-secondary': '#3a3428',
    'text-tertiary': '#5c5440',
    accent: '#1e40af',
    'accent-hover': '#1e3a8a',
    'grid-line': '#f0ebe0',
  },
  prospectus: {
    'bg-root': '#ffffff',
    'bg-main': '#ffffff',
    'bg-sidebar': '#ffffff',
    'bg-card': '#f8f8fa',
    'bg-card-hover': '#f0f0f4',
    'bg-input': '#eaeaef',
    'bg-chart': '#ffffff',
    'bg-sub-panel': '#f8f8fa',
    'border-main': '#d0d0d8',
    'border-sub': '#e0e0e8',
    'border-input': '#d0d0d8',
    'text-primary': '#1a1a2e',
    'text-secondary': '#3a3a5a',
    'text-tertiary': '#6a6a8a',
    accent: '#1a1a2e',
    'accent-hover': '#2a2a4e',
    'grid-line': '#eaeaef',
  },
  arbitrage: {
    'bg-root': '#0c0a14',
    'bg-main': '#0c0a14',
    'bg-sidebar': '#0c0a14',
    'bg-card': '#14112a',
    'bg-card-hover': '#1c1838',
    'bg-input': '#1c1838',
    'bg-chart': '#0c0a14',
    'bg-sub-panel': '#14112a',
    'border-main': '#2a2448',
    'border-sub': '#1c1838',
    'border-input': '#2a2448',
    'text-primary': '#e8e0f8',
    'text-secondary': '#b0a0d0',
    'text-tertiary': '#8878a8',
    accent: '#7c3aed',
    'accent-hover': '#8b5cf6',
    'grid-line': '#14112a',
  },
  circuit: {
    'bg-root': '#0a0a0a',
    'bg-main': '#0a0a0a',
    'bg-sidebar': '#0a0a0a',
    'bg-card': '#111111',
    'bg-card-hover': '#1a1a1a',
    'bg-input': '#1a1a1a',
    'bg-chart': '#0a0a0a',
    'bg-sub-panel': '#111111',
    'border-main': '#222222',
    'border-sub': '#1a1a1a',
    'border-input': '#222222',
    'text-primary': '#e0e0e0',
    'text-secondary': '#a0a0a0',
    'text-tertiary': '#707070',
    accent: '#22c55e',
    'accent-hover': '#4ade80',
    'grid-line': '#111111',
  },
  candlestick: {
    'bg-root': '#0d0e10',
    'bg-main': '#0d0e10',
    'bg-sidebar': '#0d0e10',
    'bg-card': '#151619',
    'bg-card-hover': '#1c1e22',
    'bg-input': '#1c1e22',
    'bg-chart': '#0d0e10',
    'bg-sub-panel': '#151619',
    'border-main': '#25282e',
    'border-sub': '#1c1e22',
    'border-input': '#25282e',
    'text-primary': '#e8e8ec',
    'text-secondary': '#a8a8b0',
    'text-tertiary': '#787880',
    accent: '#f8b500',
    'accent-hover': '#fbbf24',
    'grid-line': '#151619',
  },
  clearing: {
    'bg-root': '#f5f5f5',
    'bg-main': '#f5f5f5',
    'bg-sidebar': '#f5f5f5',
    'bg-card': '#ffffff',
    'bg-card-hover': '#eeeee',
    'bg-input': '#e5e5e5',
    'bg-chart': '#f5f5f5',
    'bg-sub-panel': '#ffffff',
    'border-main': '#d0d0d0',
    'border-sub': '#e0e0e0',
    'border-input': '#d0d0d0',
    'text-primary': '#1a1a1a',
    'text-secondary': '#404040',
    'text-tertiary': '#606060',
    accent: '#52525b',
    'accent-hover': '#71717a',
    'grid-line': '#e5e5e5',
  },
};

/**
 * 10 套命名主题 — 亮色端点色值
 */
export const THEME_LIGHT: Record<ThemeId, ThemeColors> = {
  terminal: {
    'bg-root': '#faf8f5',
    'bg-main': '#faf8f5',
    'bg-sidebar': '#faf8f5',
    'bg-card': '#ffffff',
    'bg-card-hover': '#f5f0e8',
    'bg-input': '#f0ebe0',
    'bg-chart': '#faf8f5',
    'bg-sub-panel': '#ffffff',
    'border-main': '#d4c8b0',
    'border-sub': '#e8dcc8',
    'border-input': '#d4c8b0',
    'text-primary': '#1a1814',
    'text-secondary': '#3a3428',
    'text-tertiary': '#5c5440',
    accent: '#d97706',
    'accent-hover': '#b45309',
    'grid-line': '#f0ebe0',
  },
  ticker: {
    'bg-root': '#f0f4fa',
    'bg-main': '#f0f4fa',
    'bg-sidebar': '#f0f4fa',
    'bg-card': '#ffffff',
    'bg-card-hover': '#e8edf5',
    'bg-input': '#e0e7f2',
    'bg-chart': '#f0f4fa',
    'bg-sub-panel': '#ffffff',
    'border-main': '#c0cce0',
    'border-sub': '#d8e0ee',
    'border-input': '#c0cce0',
    'text-primary': '#0f1a30',
    'text-secondary': '#283850',
    'text-tertiary': '#506078',
    accent: '#2563eb',
    'accent-hover': '#1d4ed8',
    'grid-line': '#e0e7f2',
  },
  vault: {
    'bg-root': '#f5f2ec',
    'bg-main': '#f5f2ec',
    'bg-sidebar': '#f5f2ec',
    'bg-card': '#ffffff',
    'bg-card-hover': '#ede8dc',
    'bg-input': '#e8e0d0',
    'bg-chart': '#f5f2ec',
    'bg-sub-panel': '#ffffff',
    'border-main': '#d0c4a8',
    'border-sub': '#e0d8c0',
    'border-input': '#d0c4a8',
    'text-primary': '#1a1814',
    'text-secondary': '#3a3428',
    'text-tertiary': '#5c5440',
    accent: '#b8860b',
    'accent-hover': '#996f09',
    'grid-line': '#e8e0d0',
  },
  margin: {
    'bg-root': '#f5f5f5',
    'bg-main': '#f5f5f5',
    'bg-sidebar': '#f5f5f5',
    'bg-card': '#ffffff',
    'bg-card-hover': '#f0f0f0',
    'bg-input': '#e8e8e8',
    'bg-chart': '#f5f5f5',
    'bg-sub-panel': '#ffffff',
    'border-main': '#d0d0d0',
    'border-sub': '#e0e0e0',
    'border-input': '#d0d0d0',
    'text-primary': '#1a1a1a',
    'text-secondary': '#404040',
    'text-tertiary': '#606060',
    accent: '#dc2626',
    'accent-hover': '#b91c1c',
    'grid-line': '#e8e8e8',
  },
  ledger: {
    'bg-root': '#fefcf8',
    'bg-main': '#fefcf8',
    'bg-sidebar': '#fefcf8',
    'bg-card': '#ffffff',
    'bg-card-hover': '#f8f4e8',
    'bg-input': '#f0ecdc',
    'bg-chart': '#fefcf8',
    'bg-sub-panel': '#ffffff',
    'border-main': '#d8ccb4',
    'border-sub': '#ece0c8',
    'border-input': '#d8ccb4',
    'text-primary': '#1a1814',
    'text-secondary': '#3a3428',
    'text-tertiary': '#5c5440',
    accent: '#1e3a8a',
    'accent-hover': '#1e3080',
    'grid-line': '#f0ecdc',
  },
  prospectus: {
    'bg-root': '#ffffff',
    'bg-main': '#ffffff',
    'bg-sidebar': '#ffffff',
    'bg-card': '#f8f8fa',
    'bg-card-hover': '#f0f0f4',
    'bg-input': '#eaeaef',
    'bg-chart': '#ffffff',
    'bg-sub-panel': '#f8f8fa',
    'border-main': '#c8c8d4',
    'border-sub': '#d8d8e4',
    'border-input': '#c8c8d4',
    'text-primary': '#1a1a2e',
    'text-secondary': '#3a3a5a',
    'text-tertiary': '#6a6a8a',
    accent: '#2a2a4e',
    'accent-hover': '#3a3a6e',
    'grid-line': '#eaeaef',
  },
  arbitrage: {
    'bg-root': '#f5f3ff',
    'bg-main': '#f5f3ff',
    'bg-sidebar': '#f5f3ff',
    'bg-card': '#ffffff',
    'bg-card-hover': '#ede8ff',
    'bg-input': '#e0d8f0',
    'bg-chart': '#f5f3ff',
    'bg-sub-panel': '#ffffff',
    'border-main': '#c8b8e0',
    'border-sub': '#ddd0f0',
    'border-input': '#c8b8e0',
    'text-primary': '#1a142e',
    'text-secondary': '#3a285a',
    'text-tertiary': '#5a488a',
    accent: '#6d28d9',
    'accent-hover': '#5b21b6',
    'grid-line': '#e0d8f0',
  },
  circuit: {
    'bg-root': '#f0f0f0',
    'bg-main': '#f0f0f0',
    'bg-sidebar': '#f0f0f0',
    'bg-card': '#ffffff',
    'bg-card-hover': '#e8e8e8',
    'bg-input': '#e0e0e0',
    'bg-chart': '#f0f0f0',
    'bg-sub-panel': '#ffffff',
    'border-main': '#c0c0c0',
    'border-sub': '#d0d0d0',
    'border-input': '#c0c0c0',
    'text-primary': '#1a1a1a',
    'text-secondary': '#404040',
    'text-tertiary': '#707070',
    accent: '#16a34a',
    'accent-hover': '#15803d',
    'grid-line': '#e0e0e0',
  },
  candlestick: {
    'bg-root': '#f5f6f8',
    'bg-main': '#f5f6f8',
    'bg-sidebar': '#f5f6f8',
    'bg-card': '#ffffff',
    'bg-card-hover': '#eeeff2',
    'bg-input': '#e4e6ea',
    'bg-chart': '#f5f6f8',
    'bg-sub-panel': '#ffffff',
    'border-main': '#c8ccd4',
    'border-sub': '#d8dce4',
    'border-input': '#c8ccd4',
    'text-primary': '#141618',
    'text-secondary': '#383c44',
    'text-tertiary': '#686c74',
    accent: '#d49700',
    'accent-hover': '#b07c00',
    'grid-line': '#e4e6ea',
  },
  clearing: {
    'bg-root': '#ffffff',
    'bg-main': '#ffffff',
    'bg-sidebar': '#ffffff',
    'bg-card': '#f8f8f8',
    'bg-card-hover': '#f0f0f0',
    'bg-input': '#e8e8e8',
    'bg-chart': '#ffffff',
    'bg-sub-panel': '#f8f8f8',
    'border-main': '#d4d4d4',
    'border-sub': '#e4e4e4',
    'border-input': '#d4d4d4',
    'text-primary': '#171717',
    'text-secondary': '#404040',
    'text-tertiary': '#737373',
    accent: '#3f3f46',
    'accent-hover': '#27272a',
    'grid-line': '#e8e8e8',
  },
};

/**
 * 主题元数据（名称 + 描述）
 */
const THEME_META: Record<ThemeId, Pick<Theme, 'name' | 'description'>> = {
  terminal: { name: 'Terminal', description: 'Bloomberg Terminal 风格。黑底琥珀字——为交易而生的配色。' },
  ticker: { name: 'Ticker', description: '交易所大屏风格。深蓝底亮白字——为实时行情而生。' },
  vault: { name: 'Vault', description: '私人银行金库风格。暖暗底金棕强调——资产管理的典雅。' },
  margin: { name: 'Margin', description: '保证金交易风格。极致暗底红色强调——高风险的警示。' },
  ledger: { name: 'Ledger', description: '账簿/票据风格。纸白底会计蓝——清算对账的精准。' },
  prospectus: { name: 'Prospectus', description: '招股书/研报风格。纯白底深蓝黑——分析报告的专业。' },
  arbitrage: { name: 'Arbitrage', description: '套利策略风格。高对比紫调——量化交易的神秘。' },
  circuit: { name: 'Circuit', description: '80 年代 CRT 风格。黑底绿字——复古极客的怀旧。' },
  candlestick: { name: 'Candlestick', description: 'K 线配色风格。深灰底金黄——嵌入图表的专业。' },
  clearing: { name: 'Clearing', description: '清算所风格。灰白底灰强调——B2B 后台的中性。' },
};

/* ============================================================
   主题注册表
   ============================================================ */

/** 主题 ID 排序列表 */
const THEME_IDS: ThemeId[] = [
  'terminal', 'ticker', 'vault', 'margin',
  'ledger', 'prospectus', 'arbitrage',
  'circuit', 'candlestick', 'clearing',
];

/** 完整主题注册表 — 包含 id / name / description / dark / light */
export const THEME_REGISTRY: Theme[] = THEME_IDS.map((id) => ({
  id,
  name: THEME_META[id].name,
  description: THEME_META[id].description,
  dark: THEME_DARK[id],
  light: THEME_LIGHT[id],
}));

/* ============================================================
   查询函数
   ============================================================ */

/**
 * 列出所有可用主题 ID（按字母序）
 */
export function listThemes(): ThemeId[] {
  return [...THEME_IDS].sort();
}

/**
 * 获取单个主题的完整定义
 */
export function getTheme(id: ThemeId): Theme {
  const meta = THEME_META[id];
  return {
    id,
    name: meta.name,
    description: meta.description,
    dark: THEME_DARK[id],
    light: THEME_LIGHT[id],
  };
}

/* ============================================================
   运行时状态
   ============================================================ */

/** 当前激活的主题 ID（默认 = 'terminal'） */
export let currentThemeId: ThemeId = 'terminal';

/** 当前暗色端点（随主题切换更新） */
let activeDark: ThemeColors = THEME_DARK.terminal;

/** 当前亮色端点（随主题切换更新） */
let activeLight: ThemeColors = THEME_LIGHT.terminal;

/* ============================================================
   主题切换
   ============================================================ */

/**
 * 切换命名主题（切换色板），但不改变当前亮暗混合比例。
 *
 * 与 mixer.ts 的 applyMix() 正交组合：
 *   applyTheme('ticker');  → 换色板
 *   applyMix(0.3);         → 调亮暗
 *
 * @param id - 主题 ID（terminal / ticker / vault / ...）
 */
export function applyTheme(id: ThemeId): void {
  if (!THEME_DARK[id]) return;
  currentThemeId = id;
  activeDark = THEME_DARK[id];
  activeLight = THEME_LIGHT[id];
  // 通知 mixer.ts 更新端点
  _setEndpoints(activeDark, activeLight);
}

/**
 * 获取当前主题的暗色端点
 */
export function getActiveDark(): ThemeColors {
  return activeDark;
}

/**
 * 获取当前主题的亮色端点
 */
export function getActiveLight(): ThemeColors {
  return activeLight;
}
