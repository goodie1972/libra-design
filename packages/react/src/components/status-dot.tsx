import { cn } from '../lib/utils';

export interface StatusDotProps {
  status?: 'up' | 'down' | 'flat' | 'warning' | 'inactive';
  size?: number;
  className?: string;
}

const colorMap: Record<string, string> = {
  up: 'bg-[var(--up)]',
  down: 'bg-[var(--down)]',
  flat: 'bg-[var(--text-tertiary)]',
  warning: 'bg-[var(--warning)]',
  inactive: 'bg-[var(--border-sub)]',
};

export function StatusDot({ status = 'flat', size = 8, className }: StatusDotProps) {
  return (
    <span
      className={cn('inline-block rounded-full shrink-0', colorMap[status], className)}
      style={{ width: size, height: size }}
      role="status"
      aria-label={status}
    />
  );
}
