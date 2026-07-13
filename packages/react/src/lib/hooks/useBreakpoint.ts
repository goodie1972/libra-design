import { useState, useEffect } from 'react';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const queries: Record<Breakpoint, string> = {
  xs: '(max-width: 639px)',
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
};

function resolveBreakpoint(matches: Record<Breakpoint, boolean>): Breakpoint {
  if (matches['2xl']) return '2xl';
  if (matches.xl) return 'xl';
  if (matches.lg) return 'lg';
  if (matches.md) return 'md';
  if (matches.sm) return 'sm';
  return 'xs';
}

export function useBreakpoint() {
  const [matches, setMatches] = useState<Record<Breakpoint, boolean>>(() => {
    const mq: Record<string, boolean> = {};
    for (const [key, q] of Object.entries(queries)) {
      mq[key] = window.matchMedia(q).matches;
    }
    return mq as Record<Breakpoint, boolean>;
  });

  useEffect(() => {
    const mqls: { key: Breakpoint; mql: MediaQueryList; listener: () => void }[] = [];

    for (const [key, q] of Object.entries(queries)) {
      const mql = window.matchMedia(q);
      const listener = () => {
        setMatches((prev) => ({ ...prev, [key]: mql.matches }));
      };
      mql.addEventListener('change', listener);
      mqls.push({ key: key as Breakpoint, mql, listener });
    }

    return () => {
      for (const { mql, listener } of mqls) {
        mql.removeEventListener('change', listener);
      }
    };
  }, []);

  return { breakpoint: resolveBreakpoint(matches), matches };
}
