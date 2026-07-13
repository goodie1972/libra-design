import { cn } from '../lib/utils';
import { useControllableState } from '../lib/hooks/useControllableState';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
  showCount?: boolean;
}

export function Textarea({
  className,
  hasError,
  showCount,
  value,
  defaultValue,
  onChange,
  maxLength,
  ...props
}: TextareaProps) {
  const [internalValue, setInternalValue] = useControllableState({
    value: value as string | undefined,
    defaultValue: (defaultValue?.toString() ?? '') as string,
    onChange: (v) => onChange?.({
      target: { value: v },
      currentTarget: { value: v },
    } as React.ChangeEvent<HTMLTextAreaElement>),
  });

  return (
    <div className="relative">
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-[6px] border bg-[var(--bg-input)] px-3 py-2 text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] transition-colors duration-200 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 resize-y',
          hasError
            ? 'border-[var(--error)] focus-visible:border-[var(--error)]'
            : 'border-[var(--border-input)] focus-visible:border-[var(--accent)]',
          className,
        )}
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        maxLength={maxLength}
        {...props}
      />
      {showCount && maxLength && (
        <div className="absolute bottom-2 right-3 text-[10px] text-[var(--text-tertiary)] pointer-events-none select-none">
          {String(internalValue).length}/{maxLength}
        </div>
      )}
    </div>
  );
}
