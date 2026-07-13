import { cn } from '../lib/utils';

/** 价格展示组件属性 */
export interface PriceDisplayProps {
  value: number;
  change?: number;
  changePercent?: number;
  showArrow?: boolean;
  showSign?: boolean;
  precision?: number;
  mono?: boolean;
  className?: string;
}

function getDirection(change?: number): 'up' | 'down' | 'flat' {
  if (change == null) return 'flat';
  if (change > 0) return 'up';
  if (change < 0) return 'down';
  return 'flat';
}

const directionColors: Record<string, string> = {
  up: 'text-[var(--up)]',
  down: 'text-[var(--down)]',
  flat: 'text-[var(--flat)]',
};

const arrows: Record<string, string> = {
  up: '\u25B2',
  down: '\u25BC',
  flat: '\u25C6',
};

/** 价格展示组件。格式化显示价格 + 涨跌方向/颜色/箭头。 */
export function PriceDisplay({
  value,
  change,
  changePercent,
  showArrow = true,
  showSign = true,
  precision = 2,
  mono = true,
  className,
}: PriceDisplayProps) {
  const dir = getDirection(change);

  return (
    <span
      className={cn(
        'inline-flex items-baseline gap-1.5 font-variant-numeric-tabular',
        mono && 'font-[var(--font-mono)]',
        directionColors[dir],
        className,
      )}
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {showArrow && <span className="text-[0.7em] leading-none">{arrows[dir]}</span>}
      <span className="text-[inherit] font-medium tracking-[-0.02em]">
        {value.toFixed(precision)}
      </span>
      {(change != null || changePercent != null) && (
        <span className="text-[0.85em] opacity-90">
          {showSign && change != null && change > 0 && '+'}
          {change != null && change.toFixed(precision)}
          {changePercent != null && ` (${changePercent > 0 ? '+' : ''}${changePercent.toFixed(2)}%)`}
        </span>
      )}
    </span>
  );
}
