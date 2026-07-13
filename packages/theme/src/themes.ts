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

// 自动生成的主题色值数据 — 由 scripts/generate-themes.mjs 从 tokens/themes/*.json 生成
import { THEME_DARK, THEME_LIGHT, THEME_IDS } from './themes.generated.js';
export { THEME_DARK, THEME_LIGHT, THEME_IDS };

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
