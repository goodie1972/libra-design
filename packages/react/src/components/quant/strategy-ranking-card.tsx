import { cn } from '../../lib/utils';
import { TypePill } from './type-pill';

export interface StrategyRankingCardProps {
  rank: number;
  name: string;
  type: 'signal' | 'script' | 'bot';
  pnl: number;
  pnlPercent: number;
  totalTrades: number;
  profitFactor?: number;
  maxPnL?: number;
  className?: string;
}

export function StrategyRankingCard({
  rank,
  name,
  type,
  pnl,
  pnlPercent,
  totalTrades,
  profitFactor,
  maxPnL = Math.abs(pnl),
  className,
}: StrategyRankingCardProps) {
  const isPositive = pnl >= 0;
  const progressPercent = Math.min((Math.abs(pnl) / maxPnL) * 100, 100);

  return (
    <div
      className={cn(
        'rounded-[var(--card-radius)] border border-[var(--border-main)] bg-[var(--bg-card)] p-4',
        className,
      )}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className={cn(
            'w-6 h-6 rounded flex items-center justify-center text-[11px] font-bold',
            rank <= 3 ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-card-hover)] text-[var(--text-secondary)]',
          )}
        >
          {rank}
        </div>
        <span className="text-[var(--text-base)] font-medium text-[var(--text-primary)] flex-1 truncate">
          {name}
        </span>
        <TypePill type={type} />
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span
          className={cn(
            'text-[18px] font-bold font-[var(--font-mono)] tabular-nums',
            isPositive ? 'text-[var(--up)]' : 'text-[var(--down)]',
          )}
        >
          {isPositive ? '+' : ''}${pnl.toLocaleString()}
        </span>
        <span
          className={cn(
            'text-[var(--text-sm)] font-[var(--font-mono)] tabular-nums',
            isPositive ? 'text-[var(--up)]' : 'text-[var(--down)]',
          )}
        >
          ({isPositive ? '+' : ''}{pnlPercent.toFixed(1)}%)
        </span>
      </div>

      <div className="h-2 rounded-full bg-[var(--bg-card-hover)] overflow-hidden mb-3">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300',
            isPositive ? 'bg-[var(--up)]' : 'bg-[var(--down)]',
          )}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="flex items-center gap-4 text-[var(--text-xs)] text-[var(--text-tertiary)]">
        <span>
          总计: <span className="font-[var(--font-mono)] tabular-nums font-medium text-[var(--text-secondary)]">{totalTrades}</span> 笔
        </span>
        {profitFactor !== undefined && (
          <span>
            PF: <span className="font-[var(--font-mono)] tabular-nums font-medium text-[var(--text-secondary)]">{profitFactor.toFixed(2)}</span>
          </span>
        )}
      </div>
    </div>
  );
}
