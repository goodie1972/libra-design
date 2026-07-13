import { cn } from '../lib/utils';

export interface ColorCheckOption {
  value: string;
  color: string;
  label?: string;
}

export interface ColorCheckProps {
  options: ColorCheckOption[];
  value?: string;
  onChange?: (value: string) => void;
  size?: number;
  className?: string;
}

export function ColorCheck({ options, value, onChange, size = 24, className }: ColorCheckProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={opt.label ?? opt.value}
            onClick={() => onChange?.(opt.value)}
            className={cn(
              'rounded-full transition-all duration-150',
              selected ? 'ring-2 ring-[var(--accent)] ring-offset-2' : 'hover:scale-110',
            )}
            style={{ width: size, height: size, backgroundColor: opt.color }}
            title={opt.label ?? opt.value}
          />
        );
      })}
    </div>
  );
}
