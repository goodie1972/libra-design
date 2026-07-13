import { cn } from '../lib/utils';

export interface SkeletonProps {
  className?: string;
  text?: boolean;
  circle?: boolean;
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
}

export function Skeleton({ className, text, circle, width, height }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-[4px] bg-[var(--border-main)]',
        text && 'h-4 w-full',
        circle && 'rounded-full',
        className,
      )}
      style={{
        width,
        height: height ?? (text ? undefined : height),
      }}
      aria-hidden="true"
    />
  );
}

export interface SkeletonCardProps {
  lines?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function SkeletonCard({ lines = 3, className }: SkeletonCardProps) {
  return (
    <div className={cn('rounded-[var(--card-radius)] border border-[var(--border-sub)] bg-[var(--bg-card)] p-5 space-y-3', className)}>
      <Skeleton className="h-5 w-2/3" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-3" style={{ width: `${70 - i * 15}%` }} />
      ))}
    </div>
  );
}
