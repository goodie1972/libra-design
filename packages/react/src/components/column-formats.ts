import React from 'react';
import { ChangeBadge } from './change-badge';

export interface ColumnFormat {
  align: 'left' | 'right' | 'center';
  font?: string;
  render?: (value: unknown, row?: unknown) => React.ReactNode;
  format?: (value: unknown) => string;
}

export const FORMAT_PRESETS = {
  number: {
    align: 'right' as const,
    font: 'var(--font-mono)',
    format: (v: unknown): string => {
      const n = Number(v);
      if (isNaN(n)) return '-';
      return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },
  },
  percent: {
    align: 'right' as const,
    font: 'var(--font-mono)',
    format: (v: unknown): string => {
      const n = Number(v);
      if (isNaN(n)) return '-%';
      const sign = n > 0 ? '+' : '';
      return `${sign}${n.toFixed(2)}%`;
    },
  },
  price: {
    align: 'right' as const,
    font: 'var(--font-mono)',
    render: (v: unknown): React.ReactNode => {
      const n = Number(v);
      if (isNaN(n)) return React.createElement('span', null, '-');
      return React.createElement(
        'span',
        {
          style: {
            color: n >= 0 ? 'var(--up)' : 'var(--down)',
            fontFamily: 'var(--font-mono)',
            fontVariantNumeric: 'tabular-nums',
          },
        },
        n.toFixed(2),
      );
    },
  },
  changePercent: {
    align: 'right' as const,
    render: (v: unknown): React.ReactNode => {
      const n = Number(v);
      if (isNaN(n)) return React.createElement('span', null, '-');
      return React.createElement(ChangeBadge, { value: n, size: 'sm' });
    },
  },
  volume: {
    align: 'right' as const,
    font: 'var(--font-mono)',
    format: (v: unknown): string => {
      const n = Number(v);
      if (isNaN(n)) return '-';
      const abs = Math.abs(n);
      if (abs >= 1e8) return `${(n / 1e8).toFixed(2)}亿`;
      if (abs >= 1e4) return `${(n / 1e4).toFixed(2)}万`;
      return String(n);
    },
  },
  text: {
    align: 'left' as const,
    font: 'var(--font-body)',
    format: (v: unknown): string => {
      if (v === null || v === undefined) return '-';
      return String(v);
    },
  },
  date: {
    align: 'center' as const,
    font: 'var(--font-body)',
    format: (v: unknown): string => {
      if (!v) return '-';
      if (typeof v === 'string') return v.slice(0, 10);
      if (v instanceof Date) return v.toISOString().split('T')[0];
      return new Date(v as any).toISOString().split('T')[0];
    },
  },
} as const;

export type FormatPresetKey = keyof typeof FORMAT_PRESETS;

export function getFormatPreset(key: string): ColumnFormat | undefined {
  return FORMAT_PRESETS[key as FormatPresetKey];
}
