import { cn } from '../lib/utils';
import { useState } from 'react';

export interface MarketRow {
  code: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: string;
  [key: string]: unknown;
}

export interface MarketColumn<T extends MarketRow> {
  key: string;
  label: string;
  sortable?: boolean;
  align?: 'left' | 'right';
  render?: (row: T) => React.ReactNode;
}

export interface MarketTableProps<T extends MarketRow> {
  data: T[];
  columns: MarketColumn<T>[];
  className?: string;
  onRowClick?: (row: T) => void;
}

/**
 * @deprecated 请使用 StockTable（基于 ConfigurableGrid，支持列固定/列宽拖拽/虚拟滚动/列编辑器/列持久化等高级功能）。
 * MarketTable 保留以保持向后兼容，新项目请用 StockTable。
 */
export function MarketTable<T extends MarketRow>({
  data,
  columns,
  className,
  onRowClick,
}: MarketTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const sorted = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
    }
    const aStr = String(aVal ?? '');
    const bStr = String(bVal ?? '');
    return sortDir === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
  });

  return (
    <div className={cn('relative w-full overflow-auto rounded-[var(--card-radius)] border border-[var(--border-main)] bg-[var(--bg-card)]', className)}>
      <table className="w-full caption-bottom text-[13px] text-[var(--text-primary)]">
        <thead>
          <tr className="border-b border-[var(--border-sub)]">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'h-10 px-5 text-[11px] font-medium text-[var(--text-secondary)] tracking-[0.03em]',
                  col.align === 'right' ? 'text-right' : 'text-left',
                  col.sortable && 'cursor-pointer select-none hover:text-[var(--text-primary)] transition-colors',
                )}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                {col.label}
                {col.sortable && sortKey === col.key && (
                  <span className="ml-1 text-[10px]">{sortDir === 'asc' ? '\u25B2' : '\u25BC'}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => (
            <tr
              key={i}
              className={cn(
                'border-b border-[var(--border-sub)] transition-colors hover:bg-[var(--bg-card-hover)]',
                onRowClick && 'cursor-pointer',
              )}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    'p-3 px-5',
                    col.align === 'right' ? 'text-right font-[var(--font-mono)] font-variant-numeric-tabular-nums' : 'text-left',
                  )}
                  style={col.align === 'right' ? { fontVariantNumeric: 'tabular-nums' } : undefined}
                >
                  {col.render ? col.render(row) : String(row[col.key as keyof T] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
