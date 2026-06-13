import { cn } from '../lib/utils';
import React from 'react';

export interface TimelineItemData {
  title: string;
  description?: string;
  time?: string;
  color?: string;
  dot?: React.ReactNode;
}

export interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  items: TimelineItemData[];
  pending?: boolean;
}

export function Timeline({
  items,
  pending = false,
  className,
  ...props
}: TimelineProps) {
  const displayItems = pending && items.length > 0
    ? items
    : items;

  return (
    <div className={cn('flex flex-col', className)} role="list" {...props}>
      {displayItems.map((item, index) => {
        const isLast = index === displayItems.length - 1;
        const isPending = isLast && pending;
        const dotColor = item.color ?? 'var(--accent)';

        return (
          <div
            key={index}
            className={cn(
              'relative flex pb-8 last:pb-0',
              'animate-[timeline-fadeIn_0.4s_ease-out_forwards] opacity-0',
            )}
            style={{ animationDelay: `${index * 120}ms` }}
            role="listitem"
          >
            {/* Vertical line */}
            {!isLast && (
              <div
                className="absolute left-[11px] top-5 bottom-0 w-0.5"
                style={{ backgroundColor: isPending ? 'var(--border-sub)' : 'var(--border-main)' }}
              />
            )}

            {/* Pending dashed line */}
            {isPending && (
              <div
                className="absolute left-[11px] top-5 bottom-0 w-0.5"
                style={{
                  backgroundImage: 'linear-gradient(to bottom, var(--border-sub) 50%, transparent 50%)',
                  backgroundSize: '2px 6px',
                  backgroundRepeat: 'repeat-y',
                  width: 2,
                }}
              />
            )}

            {/* Dot */}
            <div className="relative flex items-center justify-center shrink-0">
              {item.dot ? (
                <div className="flex items-center justify-center">{item.dot}</div>
              ) : isPending ? (
                <div className="flex items-center justify-center w-6 h-6">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="animate-spin"
                    aria-hidden="true"
                  >
                    <circle cx="8" cy="8" r="6" stroke="var(--border-sub)" strokeWidth="2" fill="none" />
                    <path
                      d="M14 8A6 6 0 1 1 8 2"
                      stroke="var(--accent)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                </div>
              ) : (
                <div
                  className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                  style={{ borderColor: dotColor, backgroundColor: 'var(--bg-card)' }}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: dotColor }}
                  />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="ml-3 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="text-[var(--text-sm)] font-medium text-[var(--text-primary)]">
                  {item.title}
                </div>
                {item.time && (
                  <span className="text-[11px] text-[var(--text-tertiary)] font-[var(--font-mono)] tabular-nums ml-auto shrink-0">
                    {item.time}
                  </span>
                )}
              </div>
              {item.description && (
                <div className="text-[12px] text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                  {item.description}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Inline keyframes for fadeIn animation */}
      <style>{`
        @keyframes timeline-fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
