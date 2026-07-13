import { cn } from '../lib/utils';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  hasError?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

export function Input({ className, hasError, prefix, suffix, ...props }: InputProps) {
  const input = (
    <input
      className={cn(
        'flex h-9 w-full rounded-[6px] border bg-[var(--bg-input)] px-3 py-2 text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] transition-colors duration-200 file:border-0 file:bg-transparent file:text-[13px] file:font-medium focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
        hasError
          ? 'border-[var(--error)] focus-visible:border-[var(--error)]'
          : 'border-[var(--border-input)] focus-visible:border-[var(--accent)]',
        prefix && 'pl-8',
        suffix && 'pr-8',
        className,
      )}
      {...props}
    />
  );

  if (!prefix && !suffix) return input;

  return (
    <div className="relative">
      {prefix && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] pointer-events-none">
          {prefix}
        </div>
      )}
      {input}
      {suffix && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] pointer-events-none">
          {suffix}
        </div>
      )}
    </div>
  );
}
