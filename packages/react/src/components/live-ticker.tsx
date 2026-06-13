import { useRef, useEffect } from 'react';
import { cn } from '../lib/utils';

export interface TickerItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface LiveTickerProps {
  items: TickerItem[];
  speed?: 'slow' | 'normal' | 'fast';
  className?: string;
}

const speedMap: Record<NonNullable<LiveTickerProps['speed']>, string> = {
  slow: '40s',
  normal: '25s',
  fast: '15s',
};

export function LiveTicker({ items, speed = 'normal', className }: LiveTickerProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || items.length === 0) return;

    // 克隆内容实现无缝滚动
    while (track.children.length > items.length) {
      track.removeChild(track.lastChild!);
    }
    // 复制一份用于无缝衔接
    const originalCount = track.children.length;
    if (originalCount === items.length) {
      for (let i = 0; i < originalCount; i++) {
        const clone = track.children[i].cloneNode(true);
        track.appendChild(clone);
      }
    }
  }, [items]);

  if (items.length === 0) {
    return null;
  }

  const duration = speedMap[speed];

  return (
    <div
      className={cn(
        'overflow-hidden bg-[var(--bg-sub-panel)] border border-[var(--border-main)]',
        className,
      )}
      style={{ height: '40px' }}
    >
      <style>{`
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-track {
          display: flex;
          width: fit-content;
          animation: ticker-scroll ${duration} linear infinite;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div
        ref={trackRef}
        className="ticker-track h-full items-center"
      >
        {items.map((item, idx) => {
          const isUp = item.changePercent >= 0;
          return (
            <div
              key={`${item.symbol}-${idx}`}
              className="flex items-center gap-2 px-4 h-full shrink-0"
            >
              <span className="text-[13px] font-semibold text-[var(--text-primary)]">
                {item.symbol}
              </span>
              <span className="text-[12px] text-[var(--text-secondary)] max-w-[80px] truncate">
                {item.name}
              </span>
              <span className="text-[13px] font-[var(--font-mono)] tabular-nums text-[var(--text-primary)]">
                {item.price.toFixed(2)}
              </span>
              <span
                className={cn(
                  'text-[12px] font-[var(--font-mono)] tabular-nums font-medium',
                  isUp ? 'text-[var(--up)]' : 'text-[var(--down)]',
                )}
              >
                {isUp ? '+' : ''}{item.changePercent.toFixed(2)}%
              </span>
              <span className="text-[var(--border-sub)] text-[11px] mx-1">|</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
