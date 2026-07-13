import { cn } from '../lib/utils';
import { PriceDisplay } from './price-display';

/** 个股卡片属性 */
export interface StockCardProps {
  code: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: string;
  className?: string;
  onClick?: () => void;
}

/** 个股卡片组件。展示股票代码/名称/价格/涨跌幅概览。 */
export function StockCard({
  code,
  name,
  price,
  change,
  changePercent,
  volume,
  className,
  onClick,
}: StockCardProps) {
  const direction = change >= 0 ? 'up' : 'down';
  const borderColor = direction === 'up' ? 'var(--up)' : 'var(--down)';

  return (
    <div
      className={cn(
        'rounded-[var(--card-radius)] border bg-[var(--bg-card)] p-4 transition-all duration-200',
        'hover:bg-[var(--bg-card-hover)]',
        onClick && 'cursor-pointer',
        className,
      )}
      style={change !== 0 ? { borderLeft: `3px solid ${borderColor}` } : undefined}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); } : undefined}
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-[15px] font-semibold text-[var(--text-primary)] tracking-[-0.02em]">
            {name}
          </div>
          <div className="text-[11px] text-[var(--text-tertiary)] font-[var(--font-mono)] mt-0.5">
            {code}
          </div>
        </div>
      </div>
      <PriceDisplay
        value={price}
        change={change}
        changePercent={changePercent}
        showArrow={false}
        showSign={true}
        precision={2}
      />
      {volume && (
        <div className="text-[11px] text-[var(--text-tertiary)] mt-2">
          {volume}
        </div>
      )}
    </div>
  );
}
