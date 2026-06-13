import { cn } from '../lib/utils';

export interface SpaceProps {
  direction?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg' | number;
  wrap?: boolean;
  className?: string;
  children: React.ReactNode;
}

const sizeMap = { sm: 6, md: 12, lg: 20 };

export function Space({ direction = 'horizontal', size = 'md', wrap, className, children }: SpaceProps) {
  const gap = typeof size === 'number' ? size : sizeMap[size];

  return (
    <div
      className={cn(
        'flex',
        direction === 'vertical' ? 'flex-col' : 'flex-row',
        wrap && 'flex-wrap',
        className,
      )}
      style={{ gap }}
    >
      {children}
    </div>
  );
}
