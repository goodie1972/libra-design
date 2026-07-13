import { useRef, useEffect, useState } from 'react';

export interface CountUpProps {
  from?: number;
  to: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  enabled?: boolean;
}

export function CountUp({
  from = 0,
  to,
  duration = 800,
  decimals = 0,
  prefix = '',
  suffix = '',
  className,
  enabled = true,
}: CountUpProps) {
  const [display, setDisplay] = useState(from);
  const startRef = useRef(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    if (!enabled) { setDisplay(to); return; }
    startRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) * (1 - progress);
      const current = from + (to - from) * eased;
      setDisplay(current);

      if (progress < 1) {
        raf.current = requestAnimationFrame(tick);
      }
    };

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [from, to, duration, enabled]);

  return (
    <span className={className}>
      {prefix}{display.toFixed(decimals)}{suffix}
    </span>
  );
}
