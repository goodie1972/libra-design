import { useMemo } from 'react';
import { cn } from '../lib/utils';

/** K 线数据点 — OHLC + 成交量 */
export interface KLineData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

/** K 线图组件属性 */
export interface KLineChartProps {
  data: KLineData[];
  width?: number;
  height?: number;
  className?: string;
}

function formatVol(v: number): string {
  if (v >= 1e8) return (v / 1e8).toFixed(1) + 'B';
  if (v >= 1e4) return (v / 1e4).toFixed(1) + 'K';
  return v.toFixed(0);
}

/** K 线图组件。渲染蜡烛图 + 成交量柱 + MA5/MA10/MA20 均线。 */
export function KLineChart({ data, width = 600, height = 360, className }: KLineChartProps) {
  const chartHeight = height * 0.75;
  const volHeight = height * 0.2;
  const pad = { t: 16, r: 16, b: 4, l: 48 };
  const innerW = width - pad.l - pad.r;
  const innerH = chartHeight - pad.t - pad.b;

  const { minP, maxP, minV, maxV, candleW, ma5, ma10, ma20 } = useMemo(() => {
    if (!data.length) return { minP: 0, maxP: 0, minV: 0, maxV: 0, candleW: 0, ma5: [] as number[], ma10: [] as number[], ma20: [] as number[] };

    let minP = Infinity, maxP = -Infinity, minV = Infinity, maxV = -Infinity;
    for (const d of data) {
      minP = Math.min(minP, d.low); maxP = Math.max(maxP, d.high);
      minV = Math.min(minV, d.volume); maxV = Math.max(maxV, d.volume);
    }
    const padP = (maxP - minP) * 0.08 || 1;
    minP -= padP; maxP += padP;

    const ma5: number[] = [];
    const ma10: number[] = [];
    const ma20: number[] = [];
    for (let i = 0; i < data.length; i++) {
      const slice = data.slice(Math.max(0, i - 4), i + 1);
      ma5.push(slice.reduce((s, d) => s + d.close, 0) / slice.length);
      const slice10 = data.slice(Math.max(0, i - 9), i + 1);
      ma10.push(slice10.reduce((s, d) => s + d.close, 0) / slice10.length);
      if (i >= 19) {
        const slice20 = data.slice(i - 19, i + 1);
        ma20.push(slice20.reduce((s, d) => s + d.close, 0) / slice20.length);
      } else ma20.push(NaN);
    }

    return { minP, maxP, minV, maxV, candleW: Math.max(2, innerW / data.length - 1), ma5, ma10, ma20 };
  }, [data, innerW]);

  const toX = (i: number) => pad.l + i * (candleW + 1) + candleW / 2;
  const toY = (v: number) => pad.t + innerH - ((v - minP) / (maxP - minP)) * innerH;
  const toVolY = (v: number) => chartHeight + volHeight - ((v - minV) / (maxV - minV || 1)) * volHeight;

  if (!data.length) {
    return <div role="img" aria-label="K 线图 — 无数据" className={cn('flex items-center justify-center text-[var(--text-tertiary)] text-[12px]', className)} style={{ width, height }}>No data</div>;
  }

  const label = `K 线图，${data.length} 根 K 线，区间 ${data[0].time} 至 ${data[data.length - 1].time}，最高 ${maxP.toFixed(1)} 最低 ${minP.toFixed(1)}`;
  return (
    <svg width={width} height={height} className={cn('font-[var(--font-mono)] tabular-nums', className)} role="img" aria-label={label}>
      <title>{label}</title>
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((r) => {
        const y = pad.t + innerH * (1 - r);
        return (
          <g key={r}>
            <line x1={pad.l} y1={y} x2={width - pad.r} y2={y} stroke="var(--grid-line)" strokeWidth={0.5} />
            <text x={pad.l - 6} y={y + 3} textAnchor="end" fontSize={9} fill="var(--text-tertiary)">
              {(minP + (maxP - minP) * r).toFixed(1)}
            </text>
          </g>
        );
      })}

      {/* Candlesticks */}
      {data.map((d, i) => {
        const x = toX(i);
        const isUp = d.close >= d.open;
        const color = isUp ? 'var(--up)' : 'var(--down)';
        return (
          <g key={i}>
            <line x1={x} y1={toY(d.high)} x2={x} y2={toY(d.low)} stroke={color} strokeWidth={1} />
            <rect
              x={x - candleW / 2} y={toY(Math.max(d.open, d.close))}
              width={candleW} height={Math.max(1, Math.abs(toY(d.open) - toY(d.close)))}
              fill={color}
            />
            {/* Volume bar */}
            <rect
              x={x - candleW / 2} y={toVolY(d.volume)} width={candleW}
              height={Math.max(1, toVolY(0) - toVolY(d.volume))}
              fill={isUp ? 'var(--vol-up)' : 'var(--vol-down)'}
            />
          </g>
        );
      })}

      {/* MA lines */}
      {[
        { data: ma5, color: 'var(--ma5)', dash: '' },
        { data: ma10, color: 'var(--ma10)', dash: '3,2' },
        { data: ma20, color: 'var(--ma20)', dash: '4,3' },
      ].map((line) => {
        const pts = line.data.map((v, i) => (isNaN(v) ? '' : `${toX(i)},${toY(v)}`)).filter(Boolean).join(' ');
        if (!pts) return null;
        return <polyline key={line.color} points={pts} fill="none" stroke={line.color} strokeWidth={1} strokeDasharray={line.dash} />;
      })}
    </svg>
  );
}
