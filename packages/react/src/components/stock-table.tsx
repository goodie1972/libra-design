import { useState, useMemo } from 'react';
import type { ColumnDef, ConfigurableGridProps } from './configurable-grid';
import { ConfigurableGrid } from './configurable-grid';

// ============================================================
// StockTableRow — 行情行数据类型
// ============================================================
export type StockTableRow = {
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
  [key: string]: unknown;
};

// ============================================================
// StockTableProps
// ============================================================
export interface StockTableProps {
  /** 行情数据 */
  data: StockTableRow[];
  /** 是否显示扩展列（open/high/low/volume/turnover），默认 false */
  showExtra?: boolean;
  className?: string;
  onRowClick?: (row: StockTableRow) => void;
  /** ConfigurableGrid 虚拟滚动配置 */
  virtualized?: ConfigurableGridProps<StockTableRow>['virtualized'];
  /** 列编辑器齿轮按钮（默认 true） */
  columnPicker?: boolean;
  /** 列状态持久化（默认 key="stock-table-columns"） */
  columnStorage?: ConfigurableGridProps<StockTableRow>['columnStorage'];
  /** 行展开配置 */
  expandable?: ConfigurableGridProps<StockTableRow>['expandable'];
  /** 默认列定义（用于 ColumnPicker 「重置为默认」回退） */
  defaultColumns?: ColumnDef<StockTableRow>[];
}

// ============================================================
// 默认行情列定义
// ============================================================
const STOCK_TABLE_COLUMNS: ColumnDef<StockTableRow>[] = [
  {
    key: 'code',
    label: '代码',
    width: 90,
    sortable: true,
    fixed: 'left',
    render: (r) => (
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-tertiary)' }}>
        {r.code}
      </span>
    ),
  },
  { key: 'name', label: '名称', width: 120, sortable: true, fixed: 'left' },
  {
    key: 'price',
    label: '最新价',
    width: 100,
    format: 'price',
    sortable: true,
    align: 'right',
  },
  {
    key: 'change',
    label: '涨跌额',
    width: 90,
    sortable: true,
    align: 'right',
    render: (r) => {
      const isPositive = r.change >= 0;
      return (
        <span
          style={{
            color: isPositive ? 'var(--up)' : 'var(--down)',
            fontFamily: 'var(--font-mono)',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {isPositive ? '+' : ''}
          {r.change.toFixed(2)}
        </span>
      );
    },
  },
  {
    key: 'changePercent',
    label: '涨跌幅',
    width: 90,
    format: 'changePercent',
    sortable: true,
    align: 'right',
  },
];

const STOCK_TABLE_EXTRA_COLUMNS: ColumnDef<StockTableRow>[] = [
  { key: 'open', label: '开盘', width: 100, format: 'price', align: 'right' },
  { key: 'high', label: '最高', width: 100, format: 'price', align: 'right' },
  { key: 'low', label: '最低', width: 100, format: 'price', align: 'right' },
  { key: 'volume', label: '成交量', width: 100, align: 'right' },
  { key: 'turnover', label: '成交额', width: 100, align: 'right' },
];

// ============================================================
// StockTable 组件 — 基于 ConfigurableGrid
// ============================================================

/**
 * 行情表格组件，基于 ConfigurableGrid 实现。
 * 支持列固定、列宽拖拽、排序、虚拟滚动、行展开、ColumnPicker 列编辑、列状态持久化。
 *
 * 用法：
 * ```tsx
 * <StockTable data={stockData} showExtra columnPicker virtualized={{ rowHeight: 48 }} />
 * ```
 */
export function StockTable({
  data,
  showExtra = false,
  className,
  onRowClick,
  virtualized,
  columnPicker = true,
  columnStorage,
  expandable,
  defaultColumns,
}: StockTableProps) {
  const baseColumns = useMemo(
    () => (showExtra ? [...STOCK_TABLE_COLUMNS, ...STOCK_TABLE_EXTRA_COLUMNS] : STOCK_TABLE_COLUMNS),
    [showExtra],
  );

  // 内部列状态——支持 ColumnPicker 编辑 + columnStorage 持久化
  const [workingColumns, setWorkingColumns] = useState<ColumnDef<StockTableRow>[]>(defaultColumns ?? baseColumns);

  // showExtra 变化时重置列（保留 ColumnPicker 的列编排，但根据 showExtra 加减列）
  const displayColumns =
    columnPicker || columnStorage
      ? workingColumns
      : baseColumns;

  return (
    <ConfigurableGrid
      data={data}
      columns={displayColumns}
      onColumnsChange={(cols) => setWorkingColumns(cols as ColumnDef<StockTableRow>[])}
      rowKey="code"
      onRowClick={onRowClick as (row: StockTableRow) => void}
      className={className}
      columnPicker={columnPicker}
      columnStorage={columnStorage ?? { key: 'stock-table-columns' }}
      virtualized={virtualized}
      expandable={expandable}
    />
  );
}
