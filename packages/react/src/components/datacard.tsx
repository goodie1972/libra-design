import { cn } from '../lib/utils';

export interface DataField {
  label: string;
  value: string;
  trend?: 'up' | 'down';
}

export interface DataCardProps {
  title: string;
  fields: DataField[];
  className?: string;
  style?: React.CSSProperties;
}

export function DataCard({ title, fields, className }: DataCardProps) {
  return (
    <div
      className={cn(
        'rounded-[var(--card-radius)] border border-[var(--border-main)] bg-[var(--bg-card)] p-4',
        className,
      )}
    >
      {/* Title */}
      <div className="text-[var(--text-base)] font-semibold text-[var(--text-primary)] mb-3">
        {title}
      </div>

      {/* Fields */}
      <div className="space-y-2">
        {fields.map((field, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between"
          >
            <span className="text-[var(--text-sm)] text-[var(--text-tertiary)]">
              {field.label}
            </span>
            <span
              className={cn(
                'text-[var(--text-sm)] font-[var(--font-mono)] tabular-nums font-medium',
                field.trend === 'up' && 'text-[var(--up)]',
                field.trend === 'down' && 'text-[var(--down)]',
                !field.trend && 'text-[var(--text-primary)]',
              )}
            >
              {field.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
