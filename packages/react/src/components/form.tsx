import { cn } from '../lib/utils';

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  layout?: 'vertical' | 'horizontal';
}

export function Form({ className, layout = 'vertical', ...props }: FormProps) {
  return (
    <form
      className={cn(
        layout === 'vertical' ? 'flex flex-col gap-5' : 'flex flex-row gap-4 items-center',
        className,
      )}
      {...props}
    />
  );
}
