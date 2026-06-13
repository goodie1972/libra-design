import { cn } from '../lib/utils';
import React from 'react';

export interface StepData {
  title: string;
  description?: string;
  status?: 'completed' | 'active' | 'waiting';
}

export interface StepsProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: StepData[];
  current?: number;
  direction?: 'horizontal' | 'vertical';
}

const statusStyles: Record<string, { circle: string; line: string; text: string; desc: string }> = {
  completed: {
    circle: 'bg-[var(--success)] text-white border-[var(--success)]',
    line: 'bg-[var(--success)]',
    text: 'text-[var(--text-primary)] font-medium',
    desc: 'text-[var(--text-secondary)]',
  },
  active: {
    circle: 'bg-[var(--accent)] text-white border-[var(--accent)]',
    line: 'bg-[var(--border-sub)]',
    text: 'text-[var(--accent)] font-semibold',
    desc: 'text-[var(--text-secondary)]',
  },
  waiting: {
    circle: 'bg-transparent text-[var(--text-tertiary)] border-[var(--border-sub)]',
    line: 'bg-[var(--border-sub)]',
    text: 'text-[var(--text-tertiary)]',
    desc: 'text-[var(--text-tertiary)]',
  },
};

function getStepStatus(index: number, current: number): 'completed' | 'active' | 'waiting' {
  if (index < current) return 'completed';
  if (index === current) return 'active';
  return 'waiting';
}

export function Steps({
  steps,
  current = 0,
  direction = 'horizontal',
  className,
  ...props
}: StepsProps) {
  const isVertical = direction === 'vertical';

  return (
    <div
      className={cn(
        'flex',
        isVertical ? 'flex-col' : 'flex-row items-start',
        className,
      )}
      role="list"
      {...props}
    >
      {steps.map((step, index) => {
        const status = step.status ?? getStepStatus(index, current);
        const s = statusStyles[status];
        const stepNum = index + 1;
        const isLast = index === steps.length - 1;

        return (
          <div
            key={index}
            className={cn(
              'flex',
              isVertical
                ? 'flex-row'
                : 'flex-1 flex-col items-center',
              !isLast && (isVertical ? 'pb-6' : ''),
              !isLast && !isVertical ? 'min-w-0' : '',
            )}
            role="listitem"
            aria-current={status === 'active' ? 'step' : undefined}
          >
            <div
              className={cn(
                'flex items-center',
                isVertical ? 'flex-row' : 'flex-col',
              )}
            >
              {/* Step indicator row */}
              <div className="flex items-center">
                {/* Circle */}
                <div
                  className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-full border-2 text-[12px] font-semibold shrink-0 transition-colors duration-200',
                    s.circle,
                  )}
                >
                  {status === 'completed' ? (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M3 7.5l2.5 2.5L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span className="font-[var(--font-mono)] tabular-nums">{stepNum}</span>
                  )}
                </div>

                {/* Connector line (horizontal) */}
                {!isLast && !isVertical && (
                  <div className={cn('h-0.5 flex-1 mx-2 min-w-[24px]', s.line)} />
                )}
              </div>

              {/* Content */}
              <div
                className={cn(
                  isVertical ? 'ml-3 flex-1' : 'mt-2 text-center',
                  status === 'waiting' ? 'opacity-50' : '',
                )}
              >
                <div className={cn('text-[var(--text-sm)] leading-tight', s.text)}>
                  {step.title}
                </div>
                {step.description && (
                  <div className={cn('text-[11px] mt-0.5 leading-tight', s.desc)}>
                    {step.description}
                  </div>
                )}
              </div>
            </div>

            {/* Connector line (vertical) */}
            {!isLast && isVertical && (
              <div className={cn('ml-4 w-0.5 h-6', s.line)} />
            )}
          </div>
        );
      })}
    </div>
  );
}
