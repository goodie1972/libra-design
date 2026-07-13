import { cn } from '../lib/utils';

/** 迷你走势图属性 */
export interface MiniChartProps {
  data: number[];
  trend?: 'up' | 'down';
  width?: number;
  height?: number;
  className?: string;
}

/** 迷你走势图组件。渲染内联 SVG 小火花图，自动识别涨跌趋势色。 */
export function MiniChart({
  data,
  trend,
  width = 120,
  height = 32,
  className,
}: MiniChartProps) {
  if (data.length < 2) {
    return (
      <div
        role="img"
        aria-label="迷你走势图 — 无数据"
        className={cn('inline-flex items-center justify-center', className)}
        style={{ width, height }}
      >
        <span className="text-[10px] text-[var(--text-tertiary)]">No data</span>
      </div>
    );
  }

  // Auto-detect trend if not provided
  const autoTrend =
    trend ?? (data[data.length - 1] >= data[0] ? 'up' : 'down');
  const strokeColor =
    autoTrend === 'up' ? 'var(--up)' : 'var(--down)';

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const padding = 2;
  const viewW = width - padding * 2;
  const viewH = height - padding * 2;

  const points = data.map((val, i) => {
    const x = padding + (i / (data.length - 1)) * viewW;
    const y = padding + viewH - ((val - min) / range) * viewH;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const d = `M${points.join(' L')}`;

  const label = `迷你走势图，${data.length} 个数据点，趋势 ${autoTrend === 'up' ? '上涨' : '下跌'}`;
  return (
    <svg
      className={cn('inline-block overflow-visible', className)}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={label}
    >
      <title>{label}</title>
      {/* Gradient fill under the line */}
      <defs>
        <linearGradient id={`mini-grad-${autoTrend}-${data.length}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.2" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Fill area */}
      <path
        d={`${d} L${width - padding},${height - padding} L${padding},${height - padding} Z`}
        fill={`url(#mini-grad-${autoTrend}-${data.length})`}
      />

      {/* Line */}
      <path
        d={d}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* End dot */}
      <circle
        cx={width - padding}
        cy={padding + viewH - ((data[data.length - 1] - min) / range) * viewH}
        r="2"
        fill={strokeColor}
      />
    </svg>
  );
}
