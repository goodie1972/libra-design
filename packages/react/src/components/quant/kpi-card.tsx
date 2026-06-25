import { cn } from '../../lib/utils';

export interface KPICardProps {
  icon?: string;
  label: string;
  value: number | string;
  unit?: string;
  trend?: 'up' | 'down' | 'flat';
  subValue?: string;
  subLabel?: string;
  accentColor?: string;
  className?: string;
}

export function KPICard({
  icon,
  label,
  value,
  unit,
  trend,
  subValue,
  subLabel,
  accentColor,
  className,
}: KPICardProps) {
  const trendColor = trend === 'up' ? 'text-[var(--up)]' : trend === 'down' ? 'text-[var(--down)]' : 'text-[var(--flat)]';

  return (
    <div
      className={cn(
        'rounded-[var(--card-radius)] border border-[var(--border-main)] bg-[var(--bg-card)] p-4',
        className,
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        {icon && (
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-secondary)]"
            style={{ backgroundColor: accentColor ? `${accentColor}15` : 'var(--bg-card-hover)' }}
          >
            <span className="text-lg">{icon}</span>
          </div>
        )}
        <span className="text-[var(--text-sm)] text-[var(--text-secondary)]">{label}</span>
      </div>

      <div className="flex items-baseline gap-1">
        <span
          className="text-[28px] font-bold font-[var(--font-mono)] tabular-nums"
          style={{ color: accentColor || 'var(--text-primary)' }}
        >
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {unit && (
          <span className="text-[var(--text-base)] text-[var(--text-tertiary)]">{unit}</span>
        )}
      </div>

      {(subValue || subLabel) && (
        <div className="flex items-center gap-2 mt-2 text-[var(--text-xs)]">
          {subValue && (
            <span className={cn('font-[var(--font-mono)] tabular-nums font-medium', trendColor)}>
              {subValue}
            </span>
          )}
          {subLabel && (
            <span className="text-[var(--text-tertiary)]">{subLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
