import { cn } from '../lib/utils';

export interface ScreenField {
  label: string;
  value: string;
}

export interface ScreenerProps {
  fields: ScreenField[];
  className?: string;
  style?: React.CSSProperties;
}

export function Screener({ fields, className }: ScreenerProps) {
  return (
    <div
      className={cn(
        'rounded-[var(--card-radius)] border border-[var(--border-main)] bg-[var(--bg-card)] overflow-hidden',
        className,
      )}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-[var(--border-sub)]">
        <span className="text-[var(--text-sm)] font-semibold text-[var(--text-primary)]">
          Stock Screener
        </span>
      </div>

      {/* Conditions */}
      <div className="divide-y divide-[var(--border-sub)]">
        {fields.length === 0 && (
          <div className="p-6 text-center text-[var(--text-tertiary)] text-[var(--text-sm)]">
            No filter conditions
          </div>
        )}
        {fields.map((field, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between px-4 py-2.5 transition-colors hover:bg-[var(--bg-card-hover)]"
          >
            <span className="text-[var(--text-sm)] text-[var(--text-tertiary)]">
              {field.label}
            </span>
            <span className="text-[var(--text-sm)] font-[var(--font-mono)] tabular-nums text-[var(--text-primary)] font-medium">
              {field.value}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-[var(--border-sub)] bg-[var(--bg-input)]">
        <span className="text-[10px] text-[var(--text-tertiary)] tracking-[0.03em]">
          {fields.length} condition{fields.length !== 1 ? 's' : ''} applied
        </span>
      </div>
    </div>
  );
}
