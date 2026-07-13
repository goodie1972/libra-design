import { cn } from '../lib/utils';

/** 订单簿档位 — 价格 / 挂单量 / 累计量 */
export interface OrderLevel {
  price: number;
  size: number;
  total: number;
}

/** 订单簿组件属性 */
export interface OrderBookProps {
  bids: OrderLevel[];
  asks: OrderLevel[];
  maxLevels?: number;
  className?: string;
  style?: React.CSSProperties;
}

/** 订单簿组件。渲染买卖盘十档深度表，带累积量可视条。 */
export function OrderBook({ bids, asks, maxLevels = 10, className }: OrderBookProps) {
  const maxTotal = Math.max(
    ...bids.map((b) => b.total),
    ...asks.map((a) => a.total),
    1,
  );

  const renderRow = (level: OrderLevel, side: 'bid' | 'ask', i: number) => {
    const pct = (level.total / maxTotal) * 100;
    const barColor = side === 'bid' ? 'var(--vol-up)' : 'var(--vol-down)';
    const textColor = side === 'bid' ? 'var(--up)' : 'var(--down)';

    return (
      <div key={`${side}${i}`} className="relative grid grid-cols-3 px-3 py-[3px] text-[11px]">
        <div className="absolute right-0 top-0 bottom-0 opacity-20" style={{ width: `${pct}%`, background: barColor }} />
        <span className="font-[var(--font-mono)] tabular-nums z-[1]" style={{ color: textColor }}>{level.price.toFixed(2)}</span>
        <span className="font-[var(--font-mono)] text-[var(--text-primary)] text-right tabular-nums z-[1]">{level.size.toFixed(4)}</span>
        <span className="font-[var(--font-mono)] text-[var(--text-secondary)] text-right tabular-nums z-[1]">{level.total.toFixed(4)}</span>
      </div>
    );
  };

  return (
    <div className={cn('rounded-[var(--card-radius)] border border-[var(--border-main)] bg-[var(--bg-card)] overflow-hidden', className)}>
      {/* Header */}
      <div className="grid grid-cols-3 px-3 py-[6px] border-b border-[var(--border-sub)] text-[10px] text-[var(--text-tertiary)] font-medium">
        <span>Price</span>
        <span className="text-right">Size</span>
        <span className="text-right">Total</span>
      </div>

      {/* Asks (reversed: highest near spread) */}
      <div className="border-b-2 border-[var(--border-sub)] pb-[2px] mb-[2px]">
        {[...asks].reverse().slice(0, maxLevels).map((level, i) => renderRow(level, 'ask', i))}
      </div>

      {/* Spread indicator */}
      {asks.length && bids.length ? (
        <div className="text-center py-[3px] text-[10px] text-[var(--text-tertiary)] font-[var(--font-mono)]">
          {(asks[asks.length - 1]?.price - bids[0]?.price).toFixed(2)}
        </div>
      ) : null}

      {/* Bids */}
      <div className="pt-[2px]">
        {bids.slice(0, maxLevels).map((level, i) => renderRow(level, 'bid', i))}
      </div>
    </div>
  );
}
