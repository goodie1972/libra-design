/**
 * @libra-design/theme
 *
 * libra 双主题混合引擎 + 10 套命名金融主题。
 * 通过 applyTheme(id) 切换色板，applyMix(t) 调整亮暗比例。
 *
 * @example
 * ```ts
 * import { applyTheme, applyMix, applyPreset, getThemeColor } from '@libra-design/theme';
 * applyTheme('terminal');  // Bloomberg Terminal 风格
 * applyMix(0.7);            // 柔光模式
 * applyPreset('dark');      // 暗色模式
 * ```
 */

export * from './mixer.js';
export * from './themes.js';
