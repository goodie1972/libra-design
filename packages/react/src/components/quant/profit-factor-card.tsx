import { cn } from '../../lib/utils';

export interface ProfitFactorCardProps {
  profitFactor: number;
  grossProfit: number;
  grossLoss: number;
  className?: string;
}

export function ProfitFactorCard({
  profitFactor,
  grossProfit,
  grossLoss,
  className,
}: ProfitFactorCardProps) {
  const isGood = profitFactor >= 1.5;
  const color = isGood ? 'var(--up)' : profitFactor >= 1 ? 'var(--warning)' : 'var(--down)';

  return (
    <div
      className={cn(
        'rounded-[var(--card-radius)] border border-[var(--border-main)] bg-[var(--bg-card)] p-4',
        className,
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[var(--text-sm)] text-[var(--text-secondary)]">盈亏比</span>
        <div
          className={cn(
            'px-2 py-[2px] rounded text-[10px] font-medium',
            isGood ? 'bg-[var(--up-bg)] text-[var(--up)]' : 'bg-[var(--warning)]/10 text-[var(--warning)]',
          )}
        >
          {isGood ? '优秀' : profitFactor >= 1 ? '一般' : '较差'}
        </div>
      </div>

      <div className="flex items-baseline gap-1 mb-4">
        <span
          className="text-[32px] font-bold font-[var(--font-mono)] tabular-nums"
          style={{ color }}
        >
          {profitFactor.toFixed(2)}
        </span>
        <span className="text-[var(--text-base)] text-[var(--text-tertiary)]">:1</span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-[var(--text-xs)]">
          <span className="text-[var(--text-tertiary)]">总盈利</span>
          <span className="text-[var(--up)] font-[var(--font-mono)] tabular-nums font-medium">
            +${grossProfit.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between text-[var(--text-xs)]">
          <span className="text-[var(--text-tertiary)]">总亏损</span>
          <span className="text-[var(--down)] font-[var(--font-mono)] tabular-nums font-medium">
            -${grossLoss.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
