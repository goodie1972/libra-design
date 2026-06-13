import { cn } from '../lib/utils';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export function Label({ className, required, children, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        'text-[var(--text-sm)] font-medium text-[var(--text-secondary)]',
        className,
      )}
      {...props}
    >
      {children}
      {required && <span className="ml-0.5 text-[var(--error)]">*</span>}
    </label>
  );
}
