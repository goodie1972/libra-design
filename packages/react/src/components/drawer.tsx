import { cn } from '../lib/utils';
import { useRef } from 'react';
import { useEscapeKey } from '../lib/hooks/useEscapeKey';
import { useFocusTrap } from '../lib/hooks/useFocusTrap';
import { Portal } from './portal';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  placement?: 'left' | 'right' | 'top' | 'bottom';
  children: React.ReactNode;
  className?: string;
}

const panelStyles: Record<string, string> = {
  left: 'inset-y-0 left-0 w-[320px] translate-x-0',
  right: 'inset-y-0 right-0 w-[320px] translate-x-0',
  top: 'inset-x-0 top-0 h-[280px] translate-y-0',
  bottom: 'inset-x-0 bottom-0 h-[280px] translate-y-0',
};

const closedStyles: Record<string, string> = {
  left: '-translate-x-full',
  right: 'translate-x-full',
  top: '-translate-y-full',
  bottom: 'translate-y-full',
};

export function Drawer({ open, onClose, title, placement = 'right', children, className }: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEscapeKey(onClose, open);
  useFocusTrap(panelRef, { enabled: open });

  return (
    <Portal>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 transition-opacity duration-300',
          open ? 'bg-black/50 opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
      />
      {/* Panel */}
      <div
        ref={panelRef}
        className={cn(
          'fixed z-50 flex flex-col bg-[var(--bg-card)] border-[var(--border-main)] shadow-xl transition-transform duration-300 outline-hidden',
          placement === 'left' || placement === 'right' ? 'border-l' : '',
          placement === 'top' || placement === 'bottom' ? 'border-b' : '',
          panelStyles[placement],
          open ? 'translate-x-0 translate-y-0' : closedStyles[placement],
          className,
        )}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
      >
        {title && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-sub)]">
            <h2 className="text-[15px] font-semibold text-[var(--text-primary)]">{title}</h2>
            <button
              onClick={onClose}
              className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors text-[20px] leading-none"
              aria-label="Close"
            >
              &times;
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </Portal>
  );
}
