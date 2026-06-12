/**
 * @libra/tokens — TypeScript 类型定义
 *
 * 这些类型与 CSS Token 一一对应，供消费方 TypeScript 项目类型检查。
 */

/** 涨跌方向 */
export type Direction = 'up' | 'down' | 'flat';

/** 均线周期 */
export type MAPeriod = 5 | 10 | 20 | 60 | 120 | 250;

/** 预置主题模式 */
export type ThemePreset = 'dark' | 'soft' | 'light' | 'custom';

/** 主题混合比例 */
export type ThemeMix = number; // 0 = dark, 0.7 = soft, 1 = light

/** 字体层级 */
export type TextLevel = 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

/** 间距层级 */
export type SpaceLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/** 语义色映射 */
export const SEMANTIC_COLORS = {
  up: '#ef5350',
  down: '#26a69a',
  flat: '#9e9e9e',
  ma5: '#f8b500',
  ma10: '#4a6cf7',
  ma20: '#9c27b0',
  ma60: '#009688',
  ma120: '#ff7043',
  ma250: '#78909c',
  success: '#34a853',
  warning: '#fbbc04',
  error: '#ea4335',
} as const;

/** 暗色端点色值（t=0） */
export const DARK_ENDPOINT = {
  'bg-root': '#0c0c0e',
  'bg-main': '#0c0c0e',
  'bg-sidebar': '#0c0c0e',
  'bg-card': '#121214',
  'bg-card-hover': '#18181b',
  'bg-input': '#18181b',
  'bg-chart': '#0c0c0e',
  'bg-sub-panel': '#121214',
  'border-main': '#1e1e22',
  'border-sub': '#161618',
  'border-input': '#1e1e22',
  'text-primary': '#e8e8ed',
  'text-secondary': '#9a9aa0',
  'text-tertiary': '#63636a',
  accent: '#4a6cf7',
  'accent-hover': '#5d7cf9',
  'grid-line': '#18191c',
} as const;

/** 亮色端点色值（t=1） */
export const LIGHT_ENDPOINT = {
  'bg-root': '#f5f5f7',
  'bg-main': '#f5f5f7',
  'bg-sidebar': '#f5f5f7',
  'bg-card': '#ffffff',
  'bg-card-hover': '#f0f0f2',
  'bg-input': '#eaeaee',
  'bg-chart': '#f5f5f7',
  'bg-sub-panel': '#ffffff',
  'border-main': '#d4d4d8',
  'border-sub': '#e8e8ec',
  'border-input': '#d4d4d8',
  'text-primary': '#0d0d12',
  'text-secondary': '#6e6e78',
  'text-tertiary': '#8e8e98',
  accent: '#533afd',
  'accent-hover': '#4527e0',
  'grid-line': '#e8ecf0',
} as const;

/** 所有主题变量名 */
export type ThemeVariable = keyof typeof DARK_ENDPOINT;

/** 字号定义 */
export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  base: 13,
  md: 14,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
} as const;

/** 间距定义 */
export const SPACING = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 24,
  6: 32,
  7: 48,
  8: 64,
} as const;
