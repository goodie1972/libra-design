import { cn } from '../../lib/utils';

export interface DrawdownCardProps {
  maxDrawdown: number;
  currentDrawdown?: number;
  recoveryDays?: number;
  className?: string;
}

export function DrawdownCard({
  maxDrawdown,
  currentDrawdown,
  recoveryDays,
  className,
}: DrawdownCardProps) {
  const severity = Math.abs(maxDrawdown) > 20 ? 'high' : Math.abs(maxDrawdown) > 10 ? 'medium' : 'low';
  const severityColor = severity === 'high' ? 'var(--error)' : severity === 'medium' ? 'var(--warning)' : 'var(--success)';

  return (
    <div
      className={cn(
        'rounded-[var(--card-radius)] border border-[var(--border-main)] bg-[var(--bg-card)] p-4',
        className,
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[var(--text-sm)] text-[var(--text-secondary)]">最大回撤</span>
        <div
          className={cn(
            'px-2 py-[2px] rounded text-[10px] font-medium',
            severity === 'high' && 'bg-[var(--error)]/10 text-[var(--error)]',
            severity === 'medium' && 'bg-[var(--warning)]/10 text-[var(--warning)]',
            severity === 'low' && 'bg-[var(--success)]/10 text-[var(--success)]',
          )}
        >
          {severity === 'high' ? '高风险' : severity === 'medium' ? '中风险' : '低风险'}
        </div>
      </div>

      <div className="flex items-baseline gap-1 mb-4">
        <span className="text-[32px] font-bold font-[var(--font-mono)] tabular-nums text-[var(--down)]">
          {maxDrawdown.toFixed(2)}%
        </span>
      </div>

      <div className="space-y-2">
        {currentDrawdown !== undefined && (
          <div className="flex items-center justify-between text-[var(--text-xs)]">
            <span className="text-[var(--text-tertiary)]">当前回撤</span>
            <span className="text-[var(--down)] font-[var(--font-mono)] tabular-nums font-medium">
              {currentDrawdown.toFixed(2)}%
            </span>
          </div>
        )}
        {recoveryDays !== undefined && (
          <div className="flex items-center justify-between text-[var(--text-xs)]">
            <span className="text-[var(--text-tertiary)]">恢复天数</span>
            <span className="text-[var(--text-primary)] font-[var(--font-mono)] tabular-nums font-medium">
              {recoveryDays} 天
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 h-2 rounded-full bg-[var(--bg-card-hover)] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${Math.min(Math.abs(maxDrawdown), 100)}%`,
            backgroundColor: severityColor,
          }}
        />
      </div>
    </div>
  );
}
