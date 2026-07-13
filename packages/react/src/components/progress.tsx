import { cn } from '../lib/utils';
import { motion } from '../lib/motion';

export interface ProgressProps {
  value: number;
  max?: number;
  variant?: 'line' | 'circle';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function Progress({
  value,
  max = 100,
  variant = 'line',
  size = 'md',
  showLabel = false,
  className,
}: ProgressProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const sizeMap = { sm: 4, md: 6, lg: 10 };

  if (variant === 'circle') {
    const r = 36;
    const circumference = 2 * Math.PI * r;
    const offset = circumference - (pct / 100) * circumference;
    const strokeWidth = sizeMap[size];

    return (
      <div className={cn('inline-flex items-center justify-center', className)}>
        <svg width={90} height={90} className="-rotate-90">
          <circle cx={45} cy={45} r={r} fill="none" stroke="var(--border-main)" strokeWidth={strokeWidth} />
          <circle
            cx={45} cy={45} r={r}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: motion.transition('stroke-dashoffset', 'slow') }}
          />
        </svg>
        {showLabel && (
          <span className="absolute text-[13px] font-semibold text-[var(--text-primary)] font-[var(--font-mono)]" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {Math.round(pct)}%
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="flex-1 rounded-full bg-[var(--border-main)]" style={{ height: sizeMap[size] }}>
        <div
          className="h-full rounded-full bg-[var(--accent)] transition-all duration-400 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-[12px] text-[var(--text-secondary)] font-[var(--font-mono)] min-w-[36px] text-right" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {Math.round(pct)}%
        </span>
      )}
    </div>
  );
}
