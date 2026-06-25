import { cn } from '../../lib/utils';

export interface WinRateCardProps {
  winRate: number;
  winCount: number;
  lossCount: number;
  className?: string;
}

export function WinRateCard({ winRate, winCount, lossCount, className }: WinRateCardProps) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (winRate / 100) * circumference;

  return (
    <div
      className={cn(
        'rounded-[var(--card-radius)] border border-[var(--border-main)] bg-[var(--bg-card)] p-4 flex flex-col items-center',
        className,
      )}
    >
      <div className="relative w-[120px] h-[120px] mb-3">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="var(--border-main)"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="var(--up)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[24px] font-bold font-[var(--font-mono)] tabular-nums text-[var(--up)]">
            {winRate.toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 text-[var(--text-sm)]">
        <div className="flex items-center gap-1">
          <span className="text-[var(--up)] font-[var(--font-mono)] tabular-nums font-semibold">
            {winCount}
          </span>
          <span className="text-[var(--text-tertiary)]">盈</span>
        </div>
        <div className="w-px h-3 bg-[var(--border-sub)]" />
        <div className="flex items-center gap-1">
          <span className="text-[var(--down)] font-[var(--font-mono)] tabular-nums font-semibold">
            {lossCount}
          </span>
          <span className="text-[var(--text-tertiary)]">亏</span>
        </div>
      </div>
    </div>
  );
}
