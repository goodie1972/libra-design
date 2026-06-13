import { cn } from '../lib/utils';

export interface StatisticProps {
  title?: React.ReactNode;
  value: number | string;
  precision?: number;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  trend?: 'up' | 'down';
  className?: string;
}

export function Statistic({
  title, value, precision, prefix, suffix, trend, className,
}: StatisticProps) {
  const displayValue = typeof value === 'number' && precision !== undefined
    ? value.toFixed(precision)
    : String(value);

  return (
    <div className={cn('flex flex-col', className)}>
      {title && (
        <div className="text-[12px] text-[var(--text-tertiary)] mb-1">{title}</div>
      )}
      <div
        className={cn(
          'inline-flex items-baseline gap-1.5 font-[var(--font-mono)] text-[24px] font-semibold tracking-[-0.03em]',
          trend === 'up' && 'text-[var(--up)]',
          trend === 'down' && 'text-[var(--down)]',
        )}
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {prefix && <span className="text-[0.7em] font-normal">{prefix}</span>}
        {displayValue}
        {suffix && <span className="text-[0.6em] font-normal text-[var(--text-secondary)]">{suffix}</span>}
      </div>
    </div>
  );
}
