import { useMemo } from 'react';
import { cn } from '../lib/utils';

/** 深度图档位 — 价格 / 挂单量 */
export interface DepthLevel {
  price: number;
  volume: number;
}

/** 深度图组件属性 */
export interface DepthChartProps {
  bids: DepthLevel[];
  asks: DepthLevel[];
  width?: number;
  height?: number;
  className?: string;
}

/** 深度图组件。渲染买卖盘累积深度曲线和填充区域。 */
export function DepthChart({ bids, asks, width = 400, height = 260, className }: DepthChartProps) {
  const pad = { t: 16, r: 16, b: 24, l: 48 };
  const innerW = width - pad.l - pad.r;
  const innerH = height - pad.t - pad.b;

  const { paths, maxVol, minPrice, maxPrice } = useMemo(() => {
    const all = [...bids, ...asks];
    if (!all.length) return { paths: { bid: '', ask: '' }, maxVol: 0, minPrice: 0, maxPrice: 0 };

    let cumBid = 0;
    const bidPath: string[] = [];
    for (const d of [...bids].sort((a, b) => b.price - a.price)) {
      cumBid += d.volume;
      bidPath.push(`${d.price},${cumBid}`);
    }

    let cumAsk = 0;
    const askPath: string[] = [];
    for (const d of [...asks].sort((a, b) => a.price - b.price)) {
      cumAsk += d.volume;
      askPath.push(`${d.price},${cumAsk}`);
    }
    // pad to zero
    const bidStart = bids.length ? [...bids].sort((a, b) => b.price - a.price)[0].price : 0;
    const bidEnd = bids.length ? [...bids].sort((a, b) => a.price - b.price)[0].price : 0;
    const askStart = asks.length ? [...asks].sort((a, b) => a.price - b.price)[0].price : 0;
    const askEnd = asks.length ? [...asks].sort((a, b) => a.price - b.price)[0].price : 0;

    // Fill zeros
    const fullBid = `0,0 ${bidPath.join(' ')} ${bidEnd},0`;
    const fullAsk = `${askStart},0 ${askPath.join(' ')} ${askEnd},0`;

    const minPrice = Math.min(bidStart, askStart) * 0.999;
    const maxPrice = Math.max(bidEnd, askEnd) * 1.001;
    const maxVol = Math.max(cumBid, cumAsk) * 1.1;

    return { paths: { bid: fullBid, ask: fullAsk }, maxVol, minPrice, maxPrice };
  }, [bids, asks]);

  const scaleX = (p: number) => pad.l + ((p - minPrice) / (maxPrice - minPrice || 1)) * innerW;
  const scaleY = (v: number) => pad.t + innerH - (v / maxVol) * innerH;

  const toPoints = (path: string) =>
    path.split(' ').map((pt) => {
      const [p, v] = pt.split(',');
      return `${scaleX(parseFloat(p))},${scaleY(parseFloat(v))}`;
    }).join(' ');

  if (!bids.length && !asks.length) {
    return <div role="img" aria-label="深度图 — 无数据" className={cn('flex items-center justify-center text-[var(--text-tertiary)] text-[12px]', className)} style={{ width, height }}>No data</div>;
  }

  // Price labels on x-axis
  const priceTicks = [minPrice, (minPrice + maxPrice) / 2, maxPrice];

  const label = `深度图，${bids.length} 档买单，${asks.length} 档卖单，价格区间 ${minPrice.toFixed(2)} 至 ${maxPrice.toFixed(2)}`;
  return (
    <svg width={width} height={height} className={cn('font-[var(--font-mono)] tabular-nums', className)} role="img" aria-label={label}>
      <title>{label}</title>
      {/* Grid */}
      {[0, 0.5, 1].map((r) => (
        <g key={r}>
          <line x1={pad.l} y1={pad.t + innerH * (1 - r)} x2={width - pad.r} y2={pad.t + innerH * (1 - r)} stroke="var(--grid-line)" strokeWidth={0.5} />
          <text x={pad.l - 6} y={pad.t + innerH * (1 - r) + 3} textAnchor="end" fontSize={9} fill="var(--text-tertiary)">
            {(maxVol * r).toFixed(0)}
          </text>
        </g>
      ))}

      {/* Area — Bid */}
      <polygon points={toPoints(paths.bid)} fill="var(--vol-up)" opacity={0.4} />
      <polyline points={toPoints(paths.bid)} fill="none" stroke="var(--up)" strokeWidth={1.5} />

      {/* Area — Ask */}
      <polygon points={toPoints(paths.ask)} fill="var(--vol-down)" opacity={0.4} />
      <polyline points={toPoints(paths.ask)} fill="none" stroke="var(--down)" strokeWidth={1.5} />

      {/* Price labels */}
      {priceTicks.map((p, i) => (
        <text key={i} x={scaleX(p)} y={height - 6} textAnchor="middle" fontSize={9} fill="var(--text-tertiary)">
          {p.toFixed(2)}
        </text>
      ))}
    </svg>
  );
}
