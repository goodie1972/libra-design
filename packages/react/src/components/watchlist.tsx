import { cn } from '../lib/utils';

export interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface WatchlistProps {
  items: WatchlistItem[];
  className?: string;
  style?: React.CSSProperties;
}

export function Watchlist({ items, className }: WatchlistProps) {
  return (
    <div
      className={cn(
        'rounded-[var(--card-radius)] border border-[var(--border-main)] bg-[var(--bg-card)] overflow-hidden',
        className,
      )}
    >
      {/* Header */}
      <div
        className="grid gap-0 px-4 py-2.5 border-b border-[var(--border-sub)] text-[10px] font-medium text-[var(--text-tertiary)] tracking-[0.04em] uppercase"
        style={{ gridTemplateColumns: '90px 1fr 80px 80px' }}
      >
        <span>Symbol</span>
        <span>Name</span>
        <span className="text-right">Price</span>
        <span className="text-right">Chg%</span>
      </div>

      {/* Rows */}
      {items.map((item) => {
        const isUp = item.change >= 0;
        return (
          <div
            key={item.symbol}
            className={cn(
              'grid gap-0 px-4 py-2.5 transition-colors border-b border-[var(--border-sub)] last:border-b-0',
              'hover:bg-[var(--bg-card-hover)]',
            )}
            style={{ gridTemplateColumns: '90px 1fr 80px 80px' }}
          >
            <span className="text-[var(--text-sm)] font-semibold text-[var(--text-primary)]">
              {item.symbol}
            </span>
            <span className="text-[var(--text-sm)] text-[var(--text-secondary)] truncate">
              {item.name}
            </span>
            <span className="text-[var(--text-sm)] font-[var(--font-mono)] tabular-nums text-[var(--text-primary)] text-right">
              {item.price.toFixed(2)}
            </span>
            <span
              className={cn(
                'text-[var(--text-sm)] font-[var(--font-mono)] tabular-nums text-right font-medium',
                isUp ? 'text-[var(--up)]' : 'text-[var(--down)]',
              )}
            >
              {isUp ? '+' : ''}
              {item.changePercent.toFixed(2)}%
            </span>
          </div>
        );
      })}
    </div>
  );
}
