import { useRef } from 'react';
import { cn } from '../lib/utils';
import { useControllableState } from '../lib/hooks/useControllableState';

export interface InputMaskProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  mask: 'amount' | 'integer' | 'percent';
  placeholder?: string;
  hasError?: boolean;
  className?: string;
}

const formatters: Record<string, (v: string) => string> = {
  amount: (v) => {
    const digits = v.replace(/[^\d.]/g, '');
    const parts = digits.split('.');
    const int = parts[0].replace(/^0+/, '') || '0';
    const dec = parts.length > 1 ? '.' + parts[1].slice(0, 2) : '';
    return int.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + dec;
  },
  integer: (v) => {
    const digits = v.replace(/\D/g, '');
    return digits.replace(/^0+/, '') || '0';
  },
  percent: (v) => {
    const digits = v.replace(/[^\d.]/g, '');
    const match = digits.match(/^(\d+)(\.(\d{0,2}))?/);
    if (!match) return '';
    return match[1] + (match[2] ?? '');
  },
};

export function InputMask({
  value: controlledValue,
  defaultValue = '',
  onChange,
  mask,
  placeholder,
  hasError,
  className,
}: InputMaskProps) {
  const [raw, setRaw] = useControllableState({
    value: controlledValue,
    defaultValue,
    onChange,
  });
  const cursorRef = useRef<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const format = formatters[mask];
  const display = format(raw);

  return (
    <input
      ref={inputRef}
      className={cn(
        'flex h-9 w-full rounded-[6px] border bg-[var(--bg-input)] px-3 py-2 text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] transition-colors duration-200 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
        hasError
          ? 'border-[var(--error)] focus-visible:border-[var(--error)]'
          : 'border-[var(--border-input)] focus-visible:border-[var(--accent)]',
        className,
      )}
      value={display}
      placeholder={placeholder}
      onChange={(e) => {
        const oldLen = raw.length;
        const newRaw = e.target.value.replace(/[^\d.]/g, '');
        const cursor = e.target.selectionStart ?? 0;

        if (newRaw.length <= oldLen + 1 || newRaw.length <= 1) {
          cursorRef.current = cursor;
          setRaw(newRaw);
        } else {
          const diff = newRaw.length - oldLen;
          const inserted = newRaw.slice(cursor - diff, cursor);
          setRaw(raw + inserted);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === 'Backspace') {
          setRaw(raw.slice(0, -1));
        }
      }}
      inputMode={mask === 'amount' ? 'decimal' : 'numeric'}
    />
  );
}
