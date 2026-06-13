import { cn } from '../lib/utils';

export interface FlexProps {
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  gap?: 'sm' | 'md' | 'lg' | number;
  wrap?: boolean;
  className?: string;
  children: React.ReactNode;
}

const gapMap = { sm: 6, md: 12, lg: 20 };

const alignMap: Record<string, string> = {
  start: 'items-start', center: 'items-center', end: 'items-end',
  stretch: 'items-stretch', baseline: 'items-baseline',
};

const justifyMap: Record<string, string> = {
  start: 'justify-start', center: 'justify-center', end: 'justify-end',
  between: 'justify-between', around: 'justify-around', evenly: 'justify-evenly',
};

export function Flex({
  direction = 'row', align, justify, gap, wrap, className, children,
}: FlexProps) {
  return (
    <div
      className={cn(
        'flex',
        direction === 'column' ? 'flex-col' : direction === 'row-reverse' ? 'flex-row-reverse' : direction === 'column-reverse' ? 'flex-col-reverse' : 'flex-row',
        align && alignMap[align],
        justify && justifyMap[justify],
        wrap && 'flex-wrap',
        className,
      )}
      style={gap !== undefined ? { gap: typeof gap === 'number' ? gap : gapMap[gap] } : undefined}
    >
      {children}
    </div>
  );
}
