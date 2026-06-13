import { cn } from '../lib/utils';
import { useState } from 'react';

export interface AccordionItem {
  value: string;
  title: React.ReactNode;
  content: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  multiple?: boolean;
  className?: string;
}

export function Accordion({ items, multiple = false, className }: AccordionProps) {
  const [openValues, setOpenValues] = useState<string[]>([]);

  const toggle = (value: string) => {
    setOpenValues((prev) =>
      multiple
        ? prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
        : prev.includes(value) ? [] : [value],
    );
  };

  return (
    <div className={cn('divide-y divide-[var(--border-sub)]', className)}>
      {items.map((item) => {
        const isOpen = openValues.includes(item.value);
        return (
          <div key={item.value}>
            <button
              onClick={() => toggle(item.value)}
              className="flex w-full items-center justify-between py-3 text-[13px] font-medium text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors text-left"
            >
              {item.title}
              <span
                className={cn(
                  'text-[10px] text-[var(--text-tertiary)] transition-transform duration-200',
                  isOpen && 'rotate-180',
                )}
              >
                &#9660;
              </span>
            </button>
            <div
              className={cn(
                'overflow-hidden transition-all duration-200',
                isOpen ? 'pb-3 max-h-[500px] opacity-100' : 'max-h-0 opacity-0',
              )}
            >
              <div className="text-[12px] text-[var(--text-secondary)] leading-relaxed">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
