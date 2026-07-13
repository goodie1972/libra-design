import { cn } from '../lib/utils';

/** 盘口档位 — 价格 / 挂单量 / 累计量 */
export interface BoardLevel {
  price: number;
  volume: number;
  total?: number;
}

/** 盘口五档组件属性 */
export interface MarketBoardProps {
  bids: BoardLevel[];
  asks: BoardLevel[];
  className?: string;
  style?: React.CSSProperties;
}

/** 盘口五档组件。展示买卖五档报价与挂单量。 */
export function MarketBoard({ bids, asks, className }: MarketBoardProps) {
  const maxVol = Math.max(
    ...bids.map((b) => b.volume),
    ...asks.map((a) => a.volume),
    1,
  );

  return (
    <div className={cn('rounded-[var(--card-radius)] border border-[var(--border-main)] bg-[var(--bg-card)] overflow-hidden', className)}>
      {/* Header */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '8px 12px', borderBottom: '1px solid var(--border-sub)' }}>
        {['Price', 'Volume', 'Total'].map((h) => (
          <div key={h} className="text-[10px] text-[var(--text-tertiary)] tracking-[0.04em] font-medium">{h}</div>
        ))}
      </div>

      {/* Asks (reversed — highest first) */}
      {[...asks].reverse().map((a, i) => (
        <div key={`a${i}`} className="relative" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '4px 12px' }}>
          <div className="absolute right-0 top-0 bottom-0 bg-[var(--vol-down)]" style={{ width: `${(a.volume / maxVol) * 100}%`, opacity: 0.25 }} />
          <span className="relative text-[12px] font-[var(--font-mono)] text-[var(--down)]" style={{ fontVariantNumeric: 'tabular-nums' }}>{a.price.toFixed(2)}</span>
          <span className="relative text-[12px] font-[var(--font-mono)] text-[var(--text-primary)] text-right" style={{ fontVariantNumeric: 'tabular-nums' }}>{a.volume.toLocaleString()}</span>
          <span className="relative text-[12px] font-[var(--font-mono)] text-[var(--text-secondary)] text-right" style={{ fontVariantNumeric: 'tabular-nums' }}>{a.total?.toLocaleString() ?? ''}</span>
        </div>
      ))}

      {/* Spread */}
      {asks.length && bids.length ? (
        <div style={{ padding: '6px 12px', borderTop: '1px solid var(--border-sub)', borderBottom: '1px solid var(--border-sub)', background: 'var(--bg-input)', fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
          Spread: {(asks[asks.length - 1].price - bids[0].price).toFixed(2)}
        </div>
      ) : null}

      {/* Bids */}
      {bids.map((b, i) => (
        <div key={`b${i}`} className="relative" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '4px 12px' }}>
          <div className="absolute right-0 top-0 bottom-0 bg-[var(--vol-up)]" style={{ width: `${(b.volume / maxVol) * 100}%`, opacity: 0.25 }} />
          <span className="relative text-[12px] font-[var(--font-mono)] text-[var(--up)]" style={{ fontVariantNumeric: 'tabular-nums' }}>{b.price.toFixed(2)}</span>
          <span className="relative text-[12px] font-[var(--font-mono)] text-[var(--text-primary)] text-right" style={{ fontVariantNumeric: 'tabular-nums' }}>{b.volume.toLocaleString()}</span>
          <span className="relative text-[12px] font-[var(--font-mono)] text-[var(--text-secondary)] text-right" style={{ fontVariantNumeric: 'tabular-nums' }}>{b.total?.toLocaleString() ?? ''}</span>
        </div>
      ))}
    </div>
  );
}
