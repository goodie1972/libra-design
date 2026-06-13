/**
 * @libra-design/theme
 *
 * libra 双主题混合引擎。
 * 通过 applyMix(t) 在暗色(t=0)和亮色(t=1)之间无缝过渡。
 *
 * @example
 * ```ts
 * import { applyMix, applyPreset, getThemeColor } from '@libra-design/theme';
 * applyMix(0.7); // 柔光模式
 * applyPreset('dark'); // 暗色模式
 * ```
 */

export * from './mixer.js';
