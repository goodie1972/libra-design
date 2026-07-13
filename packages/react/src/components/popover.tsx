import { cn } from '../lib/utils';
import { useRef } from 'react';
import { useControllableState } from '../lib/hooks/useControllableState';
import { useClickOutside } from '../lib/hooks/useClickOutside';

export interface PopoverProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

const placementStyles: Record<string, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

export function Popover({ trigger, content, placement = 'bottom', open: controlledOpen, onOpenChange, className }: PopoverProps) {
  const [isOpen, setIsOpen] = useControllableState({
    value: controlledOpen,
    defaultValue: false,
    onChange: onOpenChange,
  });
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setIsOpen(false), isOpen);

  return (
    <div ref={ref} className={cn('relative inline-flex', className)}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>
      {isOpen && (
        <div className={cn('absolute z-50', placementStyles[placement])}>
          <div className="rounded-[8px] bg-[var(--bg-card)] border border-[var(--border-main)] shadow-lg p-3 min-w-[160px]">
            {content}
          </div>
        </div>
      )}
    </div>
  );
}
