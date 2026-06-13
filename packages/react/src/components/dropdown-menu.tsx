import { cn } from '../lib/utils';
import { useState, useRef, useEffect } from 'react';

export interface DropdownItem {
  label: React.ReactNode;
  value?: string;
  disabled?: boolean;
  onClick?: () => void;
  separator?: boolean;
}

export interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'start' | 'end';
  className?: string;
}

export function DropdownMenu({ trigger, items, align = 'start', className }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} className={cn('relative inline-block', className)}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div
          className={cn(
            'absolute z-50 mt-1 min-w-[160px] rounded-[8px] border border-[var(--border-sub)] bg-[var(--bg-card)] py-1 shadow-lg',
            align === 'end' ? 'right-0' : 'left-0',
          )}
          role="menu"
        >
          {items.map((item, i) =>
            item.separator ? (
              <div key={i} className="my-1 border-t border-[var(--border-sub)]" />
            ) : (
              <button
                key={i}
                role="menuitem"
                disabled={item.disabled}
                onClick={() => { item.onClick?.(); setOpen(false); }}
                className={cn(
                  'w-full px-3 py-1.5 text-left text-[12px] text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-colors',
                  item.disabled && 'opacity-40 cursor-not-allowed',
                )}
              >
                {item.label}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  );
}
