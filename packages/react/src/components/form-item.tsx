import { cn } from '../lib/utils';

export interface FormItemProps {
  label?: string;
  required?: boolean;
  error?: string | null;
  hint?: string;
  children: React.ReactElement<{ hasError?: boolean }>;
  className?: string;
}

export function FormItem({ label, required, error, hint, children, className }: FormItemProps) {
  const child = error
    ? <children.type {...children.props} hasError />
    : children;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label className="flex items-center gap-1 text-[13px] font-medium text-[var(--text-primary)]">
          {label}
          {required && <span className="text-[var(--error)]">*</span>}
        </label>
      )}
      {child}
      {(hint || error) && (
        <p
          className={cn(
            'text-[11px] leading-normal',
            error ? 'text-[var(--error)]' : 'text-[var(--text-tertiary)]',
          )}
          role={error ? 'alert' : undefined}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
}
