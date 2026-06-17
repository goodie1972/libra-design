import { cn } from '../lib/utils';
import type { ThemeId, ThemePreset } from '@libra-design/tokens';

/* ============================================================
   主题注册数据 — 与 @libra-design/theme 对齐
   ============================================================ */

export interface ThemeOption {
  id: ThemeId;
  name: string;
  /** 主题的 accent 色预览 */
  accent: string;
}

/** 10 套命名主题选项 */
export const THEME_OPTIONS: ThemeOption[] = [
  { id: 'terminal',   name: 'Terminal',    accent: '#f59e0b' },
  { id: 'ticker',     name: 'Ticker',      accent: '#3b82f6' },
  { id: 'vault',      name: 'Vault',       accent: '#d4a853' },
  { id: 'margin',     name: 'Margin',      accent: '#ef4444' },
  { id: 'ledger',     name: 'Ledger',      accent: '#1e40af' },
  { id: 'prospectus', name: 'Prospectus',  accent: '#1a1a2e' },
  { id: 'arbitrage',  name: 'Arbitrage',   accent: '#7c3aed' },
  { id: 'circuit',    name: 'Circuit',     accent: '#22c55e' },
  { id: 'candlestick',name: 'Candlestick', accent: '#f8b500' },
  { id: 'clearing',   name: 'Clearing',    accent: '#52525b' },
];

/** 亮暗模式预设 */
export const PRESET_OPTIONS: { value: ThemePreset; label: string }[] = [
  { value: 'dark',  label: '🌙 暗色' },
  { value: 'soft',  label: '🌤️ 柔光' },
  { value: 'light', label: '☀️ 亮色' },
];

/* ============================================================
   ThemeSwitcher 主组件
   ============================================================ */

export interface ThemeSwitcherProps {
  /** 当前主题 ID */
  themeId?: ThemeId;
  /** 当前亮暗预设 */
  preset?: ThemePreset;
  /** 混合比例滑块值 (0-1)，仅在 preset='custom' 时生效 */
  mix?: number;
  /** 主题切换回调 */
  onThemeChange?: (id: ThemeId) => void;
  /** 预设切换回调 */
  onPresetChange?: (preset: ThemePreset) => void;
  /** 自定义混合回调 */
  onMixChange?: (mix: number) => void;
  /** 布局方向 */
  direction?: 'horizontal' | 'vertical';
  /** 是否显示 mix 滑块 */
  showSlider?: boolean;
  className?: string;
}

/**
 * 主题切换器 — 10 套命名金融主题 + 亮暗模式 + 手调滑块
 *
 * 两个正交维度：
 *  1. 主题色板 (ThemeId): terminal / ticker / vault / ...
 *  2. 亮暗比例 (ThemeMix): dark(0) → soft(0.7) → light(1)
 *
 * @example
 * ```tsx
 * <ThemeSwitcher
 *   themeId="terminal"
 *   preset="soft"
 *   onThemeChange={applyTheme}
 *   onPresetChange={applyPreset}
 * />
 * ```
 */
export function ThemeSwitcher({
  themeId = 'terminal',
  preset = 'soft',
  mix = 0.7,
  onThemeChange,
  onPresetChange,
  onMixChange,
  direction = 'vertical',
  showSlider = true,
  className,
}: ThemeSwitcherProps) {
  const isVertical = direction === 'vertical';

  return (
    <div
      className={cn(
        'flex gap-3',
        isVertical ? 'flex-col' : 'flex-row items-start',
        className,
      )}
    >
      {/* 色板选择器 */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-medium tracking-wide text-[var(--text-tertiary)] uppercase">
          Theme
        </span>
        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: isVertical
              ? 'repeat(5, minmax(0, 1fr))'
              : 'repeat(10, minmax(0, 1fr))',
          }}
        >
          {THEME_OPTIONS.map((opt) => {
            const isSelected = themeId === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                title={`${opt.name}${isSelected ? ' (active)' : ''}`}
                aria-label={opt.name}
                aria-pressed={isSelected}
                onClick={() => onThemeChange?.(opt.id)}
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-[6px] transition-all duration-150',
                  isSelected
                    ? 'ring-2 ring-[var(--accent)] ring-offset-1 ring-offset-[var(--bg-card)]'
                    : 'hover:scale-110',
                )}
              >
                {/* 色块预览 */}
                <span
                  className="h-4 w-4 rounded-[4px] transition-transform duration-150"
                  style={{ backgroundColor: opt.accent }}
                />
              </button>
            );
          })}
        </div>
        <span className="text-[11px] text-[var(--text-tertiary)]">
          {THEME_OPTIONS.find((o) => o.id === themeId)?.name}
        </span>
      </div>

      {/* 亮暗模式 + 滑块 */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-medium tracking-wide text-[var(--text-tertiary)] uppercase">
          Mode
        </span>
        {/* 预设按钮组 */}
        <div
          className="inline-flex rounded-[8px] bg-[var(--bg-card-hover)] p-[2px]"
          role="radiogroup"
          aria-label="Theme brightness mode"
        >
          {PRESET_OPTIONS.map((p) => {
            const isActive = preset === p.value;
            return (
              <button
                key={p.value}
                type="button"
                role="radio"
                aria-checked={isActive}
                onClick={() => onPresetChange?.(p.value)}
                className={cn(
                  'rounded-[6px] px-3 py-1.5 text-[12px] font-medium transition-all duration-150',
                  isActive
                    ? 'bg-[var(--accent)] text-white shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
                )}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* 手调滑块（仅 preset=custom 时完全激活，但始终可见） */}
        {showSlider && (
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[10px] text-[var(--text-tertiary)]">dark</span>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(mix * 100)}
              onChange={(e) => {
                const v = Number(e.target.value) / 100;
                onMixChange?.(v);
                if (preset !== 'custom') {
                  onPresetChange?.('custom');
                }
              }}
              className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-[var(--border-main)] accent-[var(--accent)]"
              aria-label="Theme brightness slider"
            />
            <span className="text-[10px] text-[var(--text-tertiary)]">light</span>
            <span className="min-w-[28px] text-right text-[10px] tabular-nums text-[var(--text-secondary)]">
              {Math.round(mix * 100)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
