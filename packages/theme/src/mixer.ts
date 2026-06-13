import { DARK_ENDPOINT, LIGHT_ENDPOINT } from '@libra-design/tokens';
import type { ThemeMix, ThemePreset, ThemeVariable } from '@libra-design/tokens';

/**
 * libra 双主题混合引擎
 *
 * 在暗色（t=0）和亮色（t=1）之间无缝过渡。
 * 三种预置模式：暗色(0) / 柔光(0.7) / 亮色(1) + 手调滑块。
 *
 * @example
 * ```ts
 * import { applyMix } from '@libra-design/theme';
 * applyMix(0.7); // 柔光模式
 * ```
 */

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
  style.setProperty('--bg-root',       lerpColor(DARK_ENDPOINT['bg-root'],       LIGHT_ENDPOINT['bg-root'],       t));
  style.setProperty('--bg-main',       lerpColor(DARK_ENDPOINT['bg-main'],       LIGHT_ENDPOINT['bg-main'],       t));
  style.setProperty('--bg-sidebar',    lerpColor(DARK_ENDPOINT['bg-sidebar'],    LIGHT_ENDPOINT['bg-sidebar'],    t));
  style.setProperty('--bg-card',       lerpColor(DARK_ENDPOINT['bg-card'],       LIGHT_ENDPOINT['bg-card'],       t));
  style.setProperty('--bg-card-hover', lerpColor(DARK_ENDPOINT['bg-card-hover'], LIGHT_ENDPOINT['bg-card-hover'], t));
  style.setProperty('--bg-input',      lerpColor(DARK_ENDPOINT['bg-input'],      LIGHT_ENDPOINT['bg-input'],      t));
  style.setProperty('--bg-chart',      lerpColor(DARK_ENDPOINT['bg-chart'],      LIGHT_ENDPOINT['bg-chart'],      t));
  style.setProperty('--bg-sub-panel',  lerpColor(DARK_ENDPOINT['bg-sub-panel'],  LIGHT_ENDPOINT['bg-sub-panel'],  t));

  // 边框系 — gamma + 平方加速
  style.setProperty('--border-main',   lerpColor(DARK_ENDPOINT['border-main'],   LIGHT_ENDPOINT['border-main'],   bt));
  style.setProperty('--border-sub',    lerpColor(DARK_ENDPOINT['border-sub'],    LIGHT_ENDPOINT['border-sub'],    bt));
  style.setProperty('--border-input',  lerpColor(DARK_ENDPOINT['border-input'],  LIGHT_ENDPOINT['border-input'],  bt));

  // 文字系 — linear RGB + 五次方加速（关键：避免灰色带）
  style.setProperty('--text-primary',  lerpLinear(DARK_ENDPOINT['text-primary'],   LIGHT_ENDPOINT['text-primary'],   tt));
  style.setProperty('--text-secondary',lerpLinear(DARK_ENDPOINT['text-secondary'], LIGHT_ENDPOINT['text-secondary'], tt));
  style.setProperty('--text-tertiary', lerpLinear(DARK_ENDPOINT['text-tertiary'],  LIGHT_ENDPOINT['text-tertiary'],  tt));

  // 交互色
  style.setProperty('--accent',        lerpLinear(DARK_ENDPOINT.accent,        LIGHT_ENDPOINT.accent,        tt));
  style.setProperty('--accent-hover',  lerpLinear(DARK_ENDPOINT['accent-hover'], LIGHT_ENDPOINT['accent-hover'], tt));

  // 图表辅助
  style.setProperty('--grid-line',     lerpColor(DARK_ENDPOINT['grid-line'], LIGHT_ENDPOINT['grid-line'], bt));
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
