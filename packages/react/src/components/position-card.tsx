import { useMemo } from 'react';
import { cn } from '../lib/utils';

export interface PositionCardProps {
  symbol: string;
  name: string;
  quantity: number;
  avgCost: number;
  currentPrice: number;
  className?: string;
}

export function PositionCard({
  symbol,
  name,
  quantity,
  avgCost,
  currentPrice,
  className,
}: PositionCardProps) {
  const changePercent = useMemo(() => {
    if (avgCost === 0) return 0;
    return ((currentPrice - avgCost) / avgCost) * 100;
  }, [currentPrice, avgCost]);

  const pnl = useMemo(() => {
    return (currentPrice - avgCost) * quantity;
  }, [currentPrice, avgCost, quantity]);

  const isUp = changePercent >= 0;

  return (
    <div
      className={cn(
        'p-4 rounded-[var(--card-radius)] bg-[var(--bg-card)] border border-[var(--border-main)] transition-colors duration-200 hover:bg-[var(--bg-card-hover)]',
        className,
      )}
    >
      {/* 顶部：代码 + 名称 */}
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-[15px] font-semibold text-[var(--text-primary)]">
          {symbol}
        </span>
        <span className="text-[13px] text-[var(--text-secondary)]">
          {name}
        </span>
      </div>

      {/* 中间：现价 + 涨跌幅 */}
      <div className="flex items-baseline gap-3 mb-4">
        <span className="text-[var(--text-2xl)] font-[var(--font-mono)] tabular-nums text-[var(--text-primary)] font-bold">
          {currentPrice.toFixed(2)}
        </span>
        <span
          className={cn(
            'text-[14px] font-[var(--font-mono)] tabular-nums font-medium',
            isUp ? 'text-[var(--up)]' : 'text-[var(--down)]',
          )}
        >
          {isUp ? '\u2191' : '\u2193'} {changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%
        </span>
      </div>

      {/* 底部：三列数据 */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[var(--border-sub)]">
        {/* 盈亏金额 */}
        <div>
          <div className="text-[11px] text-[var(--text-tertiary)] mb-0.5">盈亏金额</div>
          <div
            className={cn(
              'text-[13px] font-[var(--font-mono)] tabular-nums font-medium',
              pnl >= 0 ? 'text-[var(--up)]' : 'text-[var(--down)]',
            )}
          >
            {pnl >= 0 ? '+' : ''}{pnl.toFixed(2)}
          </div>
        </div>

        {/* 持仓数量 */}
        <div>
          <div className="text-[11px] text-[var(--text-tertiary)] mb-0.5">持仓数量</div>
          <div className="text-[13px] font-[var(--font-mono)] tabular-nums text-[var(--text-primary)]">
            {quantity}
          </div>
        </div>

        {/* 成本价 */}
        <div>
          <div className="text-[11px] text-[var(--text-tertiary)] mb-0.5">成本价</div>
          <div className="text-[13px] font-[var(--font-mono)] tabular-nums text-[var(--text-primary)]">
            {avgCost.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}
