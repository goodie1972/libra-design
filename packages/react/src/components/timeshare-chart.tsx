import { useMemo } from 'react';
import { cn } from '../lib/utils';

/** 分时数据点 — 时间 / 价格 / 成交量 / 均价 */
export interface TimeSharePoint {
  time: string;
  price: number;
  volume: number;
  avgPrice?: number;
}

/** 分时图组件属性 */
export interface TimeShareChartProps {
  data: TimeSharePoint[];
  width?: number;
  height?: number;
  className?: string;
}

/** 分时图组件。渲染日内价格走势线、成交量柱、均价线。 */
export function TimeShareChart({ data, width = 600, height = 300, className }: TimeShareChartProps) {
  const chartH = height * 0.78;
  const volH = height * 0.17;
  const pad = { t: 16, r: 16, b: 24, l: 48 };
  const innerW = width - pad.l - pad.r;
  const innerH = chartH - pad.t - pad.b;

  const { minP, maxP, maxV, line, volBars, avgLine, midP } = useMemo(() => {
    if (!data.length) return { minP: 0, maxP: 0, maxV: 0, line: '', volBars: '', avgLine: '', midP: 0 };
    let minP = Infinity, maxP = -Infinity, maxV = -Infinity;
    for (const d of data) {
      minP = Math.min(minP, d.price); maxP = Math.max(maxP, d.price);
      maxV = Math.max(maxV, d.volume);
    }
    const padP = (maxP - minP) * 0.1 || 1;
    minP -= padP; maxP += padP;
    const midP = (minP + maxP) / 2;

    const line = data.map((d, i) => {
      const x = pad.l + (i / (data.length - 1 || 1)) * innerW;
      const y = pad.t + innerH - ((d.price - minP) / (maxP - minP)) * innerH;
      return `${x},${y}`;
    }).join(' ');

    const volBars = data.map((d, i) => {
      const x = pad.l + (i / (data.length - 1 || 1)) * innerW;
      const bw = Math.max(1, innerW / data.length - 1);
      const barH = (d.volume / maxV) * volH;
      return `<rect x="${x - bw / 2}" y="${chartH + volH - barH}" width="${bw}" height="${barH}" fill="var(--vol-up)" opacity="0.5" />`;
    }).join('');

    const avg = data.filter((d) => d.avgPrice);
    const avgLine = avg.map((d, i) => {
      const idx = data.indexOf(d);
      const x = pad.l + (idx / (data.length - 1 || 1)) * innerW;
      const y = pad.t + innerH - ((d.avgPrice! - minP) / (maxP - minP)) * innerH;
      return `${x},${y}`;
    }).join(' ');

    return { minP, maxP, maxV, line, volBars, avgLine, midP };
  }, [data, innerW, innerH, chartH, volH]);

  if (!data.length) {
    return <div role="img" aria-label="分时图 — 无数据" className={cn('flex items-center justify-center text-[var(--text-tertiary)] text-[12px]', className)} style={{ width, height }}>No data</div>;
  }

  const label = `分时图，${data.length} 个数据点，区间 ${data[0].time} 至 ${data[data.length - 1].time}，最高 ${maxP.toFixed(2)} 最低 ${minP.toFixed(2)}`;
  return (
    <svg width={width} height={height} className={cn('font-[var(--font-mono)]', className)} role="img" aria-label={label} style={{ fontVariantNumeric: 'tabular-nums' }}>
      <title>{label}</title>
      {/* Reference line (mid) */}
      <line x1={pad.l} y1={pad.t + innerH / 2} x2={width - pad.r} y2={pad.t + innerH / 2} stroke="var(--grid-line)" strokeWidth={0.5} strokeDasharray="4,3" />

      {/* Price grid */}
      {[0, 0.5, 1].map((r) => {
        const y = pad.t + innerH * (1 - r);
        return (
          <g key={r}>
            <line x1={pad.l} y1={y} x2={width - pad.r} y2={y} stroke="var(--grid-line)" strokeWidth={0.5} />
            <text x={pad.l - 6} y={y + 3} textAnchor="end" fontSize={9} fill="var(--text-tertiary)">
              {(minP + (maxP - minP) * r).toFixed(2)}
            </text>
          </g>
        );
      })}

      {/* Volume bars */}
      <g dangerouslySetInnerHTML={{ __html: volBars }} />

      {/* Price line */}
      <polyline points={line} fill="none" stroke="var(--accent)" strokeWidth={1.5} />

      {/* Avg price line */}
      {avgLine && <polyline points={avgLine} fill="none" stroke="var(--text-tertiary)" strokeWidth={1} strokeDasharray="3,2" opacity={0.6} />}
    </svg>
  );
}
