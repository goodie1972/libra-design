import { useState, useCallback } from 'react';

export interface KeyboardListNavOptions {
  itemCount: number;
  onSelect?: (index: number) => void;
  loop?: boolean;
  horizontal?: boolean;
  initialIndex?: number;
  enabled?: boolean;
}

export function useKeyboardListNav(options: KeyboardListNavOptions) {
  const { itemCount, onSelect, loop = false, horizontal = false, initialIndex = -1, enabled = true } = options;
  const [focusedIndex, setFocusedIndex] = useState(initialIndex);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!enabled || itemCount === 0) return;

      const prev = horizontal ? 'ArrowLeft' : 'ArrowUp';
      const next = horizontal ? 'ArrowRight' : 'ArrowDown';

      if (e.key === prev) {
        e.preventDefault();
        setFocusedIndex((i) => {
          if (i <= 0) return loop ? itemCount - 1 : 0;
          return i - 1;
        });
      } else if (e.key === next) {
        e.preventDefault();
        setFocusedIndex((i) => {
          if (i >= itemCount - 1) return loop ? 0 : itemCount - 1;
          return i + 1;
        });
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < itemCount) {
          onSelect?.(focusedIndex);
        }
      }
    },
    [itemCount, onSelect, loop, horizontal, enabled, focusedIndex],
  );

  return { focusedIndex, setFocusedIndex, handleKeyDown };
}
