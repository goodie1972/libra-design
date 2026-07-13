import { cn } from '../lib/utils';

export interface ImageCheckOption {
  value: string;
  label: string;
  src: string;
}

export interface ImageCheckProps {
  options: ImageCheckOption[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function ImageCheck({ options, value, onChange, className }: ImageCheckProps) {
  return (
    <div className={cn('flex flex-wrap gap-3', className)}>
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
              'flex flex-col items-center gap-1.5 rounded-[8px] border-2 p-2 transition-all duration-150',
              selected
                ? 'border-[var(--accent)] bg-[var(--accent)]/5'
                : 'border-[var(--border-main)] hover:border-[var(--border-sub)]',
            )}
          >
            <img src={opt.src} alt={opt.label} className="w-12 h-12 rounded-[4px] object-cover" />
            <span className="text-[11px] text-[var(--text-secondary)]">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
