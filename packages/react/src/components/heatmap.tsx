import { cn } from '../lib/utils';

/** 热力图单元格 — 标签 / 数值 / 副标题 / 自定义色 */
export interface HeatmapCell {
  label: string;
  value: number;
  subtitle?: string;
  color?: string;
}

/** 热力图组件属性 */
export interface HeatmapProps {
  data: HeatmapCell[];
  columns?: number;
  width?: number;
  className?: string;
}

function getColor(v: number): string {
  if (v > 0) return `rgba(var(--up-rgb), ${Math.min(0.9, v / 10 + 0.2)})`;
  if (v < 0) return `rgba(var(--down-rgb), ${Math.min(0.9, Math.abs(v) / 10 + 0.2)})`;
  return 'var(--bg-card-hover)';
}

function getTextColor(v: number): string {
  return Math.abs(v) > 5 ? '#fff' : Math.abs(v) > 2 ? '#fff' : 'var(--text-primary)';
}

/** 热力图组件。以网格色块展示涨跌幅排行，支持正负色阶映射。 */
export function Heatmap({ data, columns = 4, className }: HeatmapProps) {
  if (!data.length) return null;

  return (
    <div className={cn('grid gap-1', className)} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {data.map((cell, i) => {
        const bg = cell.color || getColor(cell.value);
        const textColor = cell.color ? 'var(--text-primary)' : getTextColor(cell.value);

        return (
          <div
            key={i}
            className="rounded-[6px] p-3 flex flex-col items-center justify-center min-h-[64px] transition-transform duration-150 hover:scale-[1.03]"
            style={{ background: bg }}
          >
            <span className="text-[11px] font-medium leading-tight" style={{ color: textColor }}>
              {cell.label}
            </span>
            <span className="text-[15px] font-semibold font-[var(--font-mono)] leading-tight mt-0.5" style={{ color: textColor, fontVariantNumeric: 'tabular-nums' }}>
              {cell.value > 0 ? '+' : ''}{typeof cell.value === 'number' ? cell.value.toFixed(2) : cell.value}%
            </span>
            {cell.subtitle && (
              <span className="text-[9px] opacity-70 mt-0.5" style={{ color: textColor }}>
                {cell.subtitle}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
