import { DARK_ENDPOINT, LIGHT_ENDPOINT } from '@libra-design/tokens';
import type { ThemeMix, ThemePreset, ThemeVariable, ThemeColors } from '@libra-design/tokens';

/**
 * libra 双主题混合引擎
 *
 * 在暗色（t=0）和亮色（t=1）之间无缝过渡。
 * 三种预置模式：暗色(0) / 柔光(0.7) / 亮色(1) + 手调滑块。
 *
 * 支持与命名主题正交组合：先 applyTheme('ticker') 切换色板，
 * 再 applyMix(0.3) 调整亮暗比例。
 *
 * @example
 * ```ts
 * import { applyMix, applyTheme } from '@libra-design/theme';
 * applyTheme('terminal'); // 切换到 Bloomberg Terminal 风格
 * applyMix(0.7);          // 柔光模式
 * ```
 */

/** 当前暗色端点（默认为 tokens 中的 DARK_ENDPOINT，可被 applyTheme 替换） */
let _dark: ThemeColors = DARK_ENDPOINT;

/** 当前亮色端点（默认为 tokens 中的 LIGHT_ENDPOINT，可被 applyTheme 替换） */
let _light: ThemeColors = LIGHT_ENDPOINT;

/**
 * 替换混合引擎使用的暗色/亮色端点。
 * 由 themes.ts 的 applyTheme() 调用。
 */
export function _setEndpoints(dark: ThemeColors, light: ThemeColors): void {
  _dark = dark;
  _light = light;
}

/* ============================================================
   颜色插值
   ============================================================ */

/** Gamma-aware 插值 — 背景/大块色用，过渡更自然 */
export function lerpColor(h1: string, h2: string, t: number): string {
  const c1 = parseInt(h1.slice(1), 16);
  const c2 = parseInt(h2.slice(1), 16);
  const r1 = (c1 >> 16) & 0xff, g1 = (c1 >> 8) & 0xff, b1 = c1 & 0xff;
  const r2 = (c2 >> 16) & 0xff, g2 = (c2 >> 8) & 0xff, b2 = c2 & 0xff;
  const r = Math.round(Math.sqrt((1 - t) * r1 * r1 + t * r2 * r2));
  const g = Math.round(Math.sqrt((1 - t) * g1 * g1 + t * g2 * g2));
  const b = Math.round(Math.sqrt((1 - t) * b1 * b1 + t * b2 * b2));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/** 线性 RGB 插值 — 文字色用，直穿灰色带避免撞色 */
export function lerpLinear(h1: string, h2: string, t: number): string {
  const c1 = parseInt(h1.slice(1), 16);
  const c2 = parseInt(h2.slice(1), 16);
  const r1 = (c1 >> 16) & 0xff, g1 = (c1 >> 8) & 0xff, b1 = c1 & 0xff;
  const r2 = (c2 >> 16) & 0xff, g2 = (c2 >> 8) & 0xff, b2 = c2 & 0xff;
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/** 数值线性插值 */
export function lerpNum(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/* ============================================================
   加速曲线
   ============================================================ */

/**
 * 文字色五次方缓出曲线
 * 避免中低混合比例时文字色和背景色相遇在同一灰阶。
 * t=0.3 → 0.83（目标值的 83%）
 */
export function textCurve(t: number): number {
  return 1 - Math.pow(1 - t, 5);
}

/** 边框平方缓出曲线 */
export function borderCurve(t: number): number {
  return 1 - Math.pow(1 - t, 2);
}

/* ============================================================
   预设值
   ============================================================ */

/** 预置主题模式对应的混合比例 */
export const PRESETS: Record<ThemePreset, ThemeMix> = {
  dark: 0,
  soft: 0.7,
  light: 1,
  custom: 0.7,
};

/** 预置模式的显示名称 */
export const PRESET_LABELS: Record<ThemePreset, string> = {
  dark: '🌙 暗色',
  soft: '🌤️ 柔光',
  light: '☀️ 亮色',
  custom: '🎚️ 手调',
};

/* ============================================================
   主函数
   ============================================================ */

/** 当前混合比例 */
export let currentMix: ThemeMix = PRESETS.soft;

/**
 * 应用主题混合比例，将 CSS 变量写入 document.documentElement
 *
 * @param t - 混合比例: 0=暗色, 0.7=柔光(默认), 1=亮色
 * @param root - 目标元素（默认 document.documentElement）
 */
export function applyMix(t: ThemeMix, root: HTMLElement = document.documentElement): void {
  currentMix = t;
  const style = root.style;
  const tt = textCurve(t);   // 文字加速
  const bt = borderCurve(t); // 边框中等加速

  // 背景系 — gamma 插值
  style.setProperty('--bg-root',       lerpColor(_dark['bg-root'],       _light['bg-root'],       t));
  style.setProperty('--bg-main',       lerpColor(_dark['bg-main'],       _light['bg-main'],       t));
  style.setProperty('--bg-sidebar',    lerpColor(_dark['bg-sidebar'],    _light['bg-sidebar'],    t));
  style.setProperty('--bg-card',       lerpColor(_dark['bg-card'],       _light['bg-card'],       t));
  style.setProperty('--bg-card-hover', lerpColor(_dark['bg-card-hover'], _light['bg-card-hover'], t));
  style.setProperty('--bg-input',      lerpColor(_dark['bg-input'],      _light['bg-input'],      t));
  style.setProperty('--bg-chart',      lerpColor(_dark['bg-chart'],      _light['bg-chart'],      t));
  style.setProperty('--bg-sub-panel',  lerpColor(_dark['bg-sub-panel'],  _light['bg-sub-panel'],  t));

  // 边框系 — gamma + 平方加速
  style.setProperty('--border-main',   lerpColor(_dark['border-main'],   _light['border-main'],   bt));
  style.setProperty('--border-sub',    lerpColor(_dark['border-sub'],    _light['border-sub'],    bt));
  style.setProperty('--border-input',  lerpColor(_dark['border-input'],  _light['border-input'],  bt));

  // 文字系 — linear RGB + 五次方加速（关键：避免灰色带）
  style.setProperty('--text-primary',  lerpLinear(_dark['text-primary'],   _light['text-primary'],   tt));
  style.setProperty('--text-secondary',lerpLinear(_dark['text-secondary'], _light['text-secondary'], tt));
  style.setProperty('--text-tertiary', lerpLinear(_dark['text-tertiary'],  _light['text-tertiary'],  tt));

  // 交互色
  style.setProperty('--accent',        lerpLinear(_dark.accent,        _light.accent,        tt));
  style.setProperty('--accent-hover',  lerpLinear(_dark['accent-hover'], _light['accent-hover'], tt));

  // 图表辅助
  style.setProperty('--grid-line',     lerpColor(_dark['grid-line'], _light['grid-line'], bt));
  style.setProperty('--vol-up',        `rgba(239,83,80,${(0.5 + t * 0.1).toFixed(2)})`);
  style.setProperty('--vol-down',      `rgba(38,166,154,${(0.5 + t * 0.1).toFixed(2)})`);

  // 结构属性
  style.setProperty('--btn-radius',  `${Math.round(lerpNum(8, 20, t))}px`);
  style.setProperty('--card-radius', `${Math.round(lerpNum(10, 12, t))}px`);
  style.setProperty('--card-shadow', t < 0.01
    ? 'none'
    : `0 1px 3px rgba(0,0,0,${(t * 0.04).toFixed(2)}), 0 3px 12px rgba(0,0,0,${(t * 0.024).toFixed(3)})`);
  style.setProperty('--card-border', t > 0.5 ? 'none' : '1px solid var(--border-main)');
}

/**
 * 按预置模式切换主题
 *
 * @example
 * ```ts
 * import { applyPreset } from '@libra-design/theme';
 * applyPreset('dark');
 * ```
 */
export function applyPreset(preset: ThemePreset): void {
  applyMix(PRESETS[preset]);
}

/**
 * 获取当前计算后的主题色值
 *
 * @example
 * ```ts
 * import { getThemeColor } from '@libra-design/theme';
 * const upColor = getThemeColor('up');
 * ```
 */
export function getThemeColor(name: ThemeVariable | string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim();
}

/**
 * 获取当前主题的亮暗比例 label
 */
export function getMixLabel(t: ThemeMix = currentMix): string {
  return `${Math.round(t * 100)}%`;
}
