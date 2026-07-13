import { cn } from '../lib/utils';

export interface SelectGroupOption {
  value: string;
  label: string;
}

export interface SelectGroupProps {
  options: SelectGroupOption[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function SelectGroup({ options, value, onChange, className }: SelectGroupProps) {
  return (
    <div
      className={cn('inline-flex rounded-[8px] bg-[var(--bg-card-hover)] p-[2px] gap-[2px]', className)}
      role="radiogroup"
    >
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange?.(opt.value)}
            className={cn(
              'rounded-[6px] px-3 py-1.5 text-[13px] font-medium transition-all duration-150',
              selected
                ? 'bg-[var(--accent)] text-white shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
