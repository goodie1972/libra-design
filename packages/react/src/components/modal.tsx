import { cn } from '../lib/utils';
import { useRef } from 'react';
import { useEscapeKey } from '../lib/hooks/useEscapeKey';
import { useFocusTrap } from '../lib/hooks/useFocusTrap';
import { Portal } from './portal';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

export function Modal({ open, onClose, title, children, className, size = 'md' }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEscapeKey(onClose, open);
  useFocusTrap(ref, { enabled: open });

  if (!open) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <div
          ref={ref}
          className={cn(
            'relative w-full rounded-[var(--card-radius)] border border-[var(--border-main)] bg-[var(--bg-card)] shadow-lg p-6 mx-4 outline-hidden',
            sizeStyles[size],
            className,
          )}
          tabIndex={-1}
        >
          {title && (
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[16px] font-semibold text-[var(--text-primary)]">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors text-[20px] leading-none"
                aria-label="Close"
              >
                &times;
              </button>
            </div>
          )}
          {children}
        </div>
      </div>
    </Portal>
  );
}
