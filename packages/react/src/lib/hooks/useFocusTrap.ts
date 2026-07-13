import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusable(el: HTMLElement): HTMLElement[] {
  return Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE));
}

export function useFocusTrap(
  ref: RefObject<HTMLElement | null>,
  options?: { initialFocus?: 'auto' | 'first' | HTMLElement; enabled?: boolean },
) {
  const prev = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const enabled = options?.enabled ?? true;
    if (!enabled || !ref.current) return;

    prev.current = document.activeElement as HTMLElement;
    const container = ref.current;
    const focusable = getFocusable(container);

    if (options?.initialFocus === 'first' && focusable.length > 0) {
      focusable[0].focus();
    } else if (options?.initialFocus instanceof HTMLElement) {
      options.initialFocus.focus();
    } else {
      container.focus();
    }

    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const current = getFocusable(container);
      if (current.length === 0) return;

      const first = current[0];
      const last = current[current.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handler);
    return () => {
      document.removeEventListener('keydown', handler);
      prev.current?.focus();
    };
  }, [ref, options?.enabled, options?.initialFocus]);
}
