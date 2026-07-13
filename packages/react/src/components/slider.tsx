import { cn } from '../lib/utils';
import { useRef } from 'react';
import { useControllableState } from '../lib/hooks/useControllableState';

export interface SliderProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  className?: string;
}

export function Slider({
  value: controlledValue,
  defaultValue = 50,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  disabled,
  className,
}: SliderProps) {
  const [value, setValue] = useControllableState({
    value: controlledValue,
    defaultValue,
    onChange,
  });
  const trackRef = useRef<HTMLDivElement>(null);

  const pct = ((value - min) / (max - min)) * 100;

  const handleChange = (clientX: number) => {
    if (!trackRef.current || disabled) return;
    const rect = trackRef.current.getBoundingClientRect();
    const raw = (clientX - rect.left) / rect.width;
    const clamped = Math.max(0, Math.min(1, raw));
    const stepped = Math.round((min + clamped * (max - min)) / step) * step;
    setValue(Math.max(min, Math.min(max, stepped)));
  };

  return (
    <div
      className={cn(
        'relative flex h-5 w-full touch-none items-center select-none',
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
      role="slider"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        const dir = e.key === 'ArrowRight' || e.key === 'ArrowUp' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -1 : 0;
        if (dir) setValue(Math.max(min, Math.min(max, value + dir * step)));
      }}
    >
      <div
        ref={trackRef}
        className="relative h-1.5 w-full rounded-full bg-[var(--border-main)]"
        onClick={(e) => handleChange(e.clientX)}
        onMouseMove={(e) => e.buttons === 1 && handleChange(e.clientX)}
      >
        <div
          className="absolute top-0 left-0 h-full rounded-full bg-[var(--accent)]"
          style={{ width: `${pct}%` }}
        />
        <div
          className={cn(
            'absolute top-1/2 h-4 w-4 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-[var(--accent)] bg-white shadow-xs transition-transform duration-150',
            !disabled && 'hover:scale-125 active:scale-110',
          )}
          style={{ left: `${pct}%` }}
          onMouseDown={(e) => {
            e.preventDefault();
            const onMove = (ev: MouseEvent) => handleChange(ev.clientX);
            const onUp = () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
          }}
        />
      </div>
    </div>
  );
}
