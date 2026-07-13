import { cn } from '../lib/utils';
import { useRef } from 'react';
import { useControllableState } from '../lib/hooks/useControllableState';
import { useClickOutside } from '../lib/hooks/useClickOutside';
import { useKeyboardListNav } from '../lib/hooks/useKeyboardListNav';

export interface DropdownItem {
  label?: React.ReactNode;
  value?: string;
  disabled?: boolean;
  onClick?: () => void;
  separator?: boolean;
}

export interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'start' | 'end';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export function DropdownMenu({ trigger, items, align = 'start', open: controlledOpen, onOpenChange, className }: DropdownMenuProps) {
  const [open, setOpen] = useControllableState({
    value: controlledOpen,
    defaultValue: false,
    onChange: onOpenChange,
  });
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setOpen(false), open);

  const actionable = items.filter((i) => !i.separator && !i.disabled);
  const { focusedIndex } = useKeyboardListNav({
    itemCount: actionable.length,
    onSelect: (i) => { actionable[i]?.onClick?.(); setOpen(false); },
    enabled: open,
  });

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
          {items.map((item, i) => {
            if (item.separator) {
              return <div key={i} className="my-1 border-t border-[var(--border-sub)]" />;
            }
            const actionIdx = actionable.indexOf(item);
            return (
              <button
                key={i}
                role="menuitem"
                disabled={item.disabled}
                onClick={() => { item.onClick?.(); setOpen(false); }}
                className={cn(
                  'w-full px-3 py-1.5 text-left text-[12px] text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-colors',
                  item.disabled && 'opacity-40 cursor-not-allowed',
                  focusedIndex === actionIdx && 'bg-[var(--bg-card-hover)]',
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
