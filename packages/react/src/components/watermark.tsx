import { cn } from '../lib/utils';

export interface WatermarkProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string;
  opacity?: number;
  color?: string;
  rotate?: number;
}

export function Watermark({
  className,
  text = '数据仅供参考，投资有风险',
  opacity = 0.06,
  color = 'var(--text-primary)',
  rotate = -25,
  ...props
}: WatermarkProps) {
  const watermarkStyle = {
    opacity,
    color,
  };

  const cells = Array.from({ length: 9 }, (_, i) => i);

  return (
    <div
      className={cn('fixed inset-0 z-[9999] pointer-events-none overflow-hidden', className)}
      aria-hidden="true"
      {...props}
    >
      <div className="grid grid-cols-3 grid-rows-3 w-full h-full">
        {cells.map((i) => (
          <div
            key={i}
            className="flex items-center justify-center"
            style={{ transform: `rotate(${rotate}deg)` }}
          >
            <span
              className="select-none whitespace-nowrap text-[14px] font-[var(--font-mono)]"
              style={watermarkStyle}
            >
              {text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
