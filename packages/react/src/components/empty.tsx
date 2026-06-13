import { cn } from '../lib/utils';

export interface EmptyProps {
  icon?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function Empty({ icon, title, description, action, className }: EmptyProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4', className)}>
      <div className="text-[32px] mb-4 opacity-40">
        {icon ?? (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-[var(--text-tertiary)]">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="9" y1="21" x2="9" y2="9" />
          </svg>
        )}
      </div>
      {title && (
        <div className="text-[14px] font-medium text-[var(--text-primary)] mb-1">{title}</div>
      )}
      {description && (
        <div className="text-[12px] text-[var(--text-tertiary)] max-w-[240px] text-center mb-4">
          {description}
        </div>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
