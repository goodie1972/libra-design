import { cn } from '../lib/utils';

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  label?: React.ReactNode;
  className?: string;
}

export function Divider({ orientation = 'horizontal', label, className }: DividerProps) {
  if (orientation === 'vertical') {
    return (
      <div
        className={cn('inline-block w-px self-stretch bg-[var(--border-sub)]', className)}
        role="separator"
        aria-orientation="vertical"
      />
    );
  }

  if (label) {
    return (
      <div className={cn('flex items-center gap-3', className)} role="separator" aria-orientation="horizontal">
        <div className="flex-1 h-px bg-[var(--border-sub)]" />
        <span className="text-[11px] text-[var(--text-tertiary)] whitespace-nowrap">{label}</span>
        <div className="flex-1 h-px bg-[var(--border-sub)]" />
      </div>
    );
  }

  return (
    <div className={cn('h-px w-full bg-[var(--border-sub)]', className)} role="separator" aria-orientation="horizontal" />
  );
}
