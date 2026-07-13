import { cn } from '../lib/utils';
import { type MarketRow, type MarketColumn, MarketTable } from './market-table';
import { ChangeBadge } from './change-badge';
import { PriceDisplay } from './price-display';

export type StockTableRow = MarketRow & {
  code: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  open?: number;
  high?: number;
  low?: number;
  volume?: string;
  turnover?: string;
};

export interface StockTableProps {
  data: StockTableRow[];
  showExtra?: boolean;
  className?: string;
  onRowClick?: (row: StockTableRow) => void;
}

export function StockTable({ data, showExtra = false, className, onRowClick }: StockTableProps) {
  const columns: MarketColumn<StockTableRow>[] = [
    { key: 'code', label: 'Code', sortable: true, render: (r) => <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-tertiary)' }}>{r.code}</span> },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'price', label: 'Price', align: 'right', sortable: true, render: (r) => <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{r.price.toFixed(2)}</span> },
    { key: 'change', label: 'Chg', align: 'right', sortable: true, render: (r) => <span style={{ color: r.change >= 0 ? 'var(--up)' : 'var(--down)', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>{r.change > 0 ? '+' : ''}{r.change.toFixed(2)}</span> },
    { key: 'changePercent', label: '%', align: 'right', sortable: true, render: (r) => <ChangeBadge value={r.changePercent} size="sm" /> },
    ...(showExtra
      ? [
          { key: 'open' as string, label: 'Open', align: 'right' as const, render: (r: StockTableRow) => <PriceDisplay value={r.open ?? 0} showArrow={false} precision={2} /> },
          { key: 'high' as string, label: 'High', align: 'right' as const, render: (r: StockTableRow) => <PriceDisplay value={r.high ?? 0} showArrow={false} precision={2} /> },
          { key: 'low' as string, label: 'Low', align: 'right' as const, render: (r: StockTableRow) => <PriceDisplay value={r.low ?? 0} showArrow={false} precision={2} /> },
          { key: 'volume' as string, label: 'Volume', align: 'right' as const },
          { key: 'turnover' as string, label: 'Turnover', align: 'right' as const },
        ]
      : []),
  ];

  return (
    <MarketTable
      data={data}
      columns={columns}
      className={className}
      onRowClick={onRowClick as (row: MarketRow) => void}
    />
  );
}
