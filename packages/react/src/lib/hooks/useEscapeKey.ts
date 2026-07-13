import { useEffect, useCallback } from 'react';

export function useEscapeKey(handler: () => void, enabled = true) {
  const cb = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') handler();
    },
    [handler],
  );

  useEffect(() => {
    if (!enabled) return;
    document.addEventListener('keydown', cb);
    return () => document.removeEventListener('keydown', cb);
  }, [cb, enabled]);
}
