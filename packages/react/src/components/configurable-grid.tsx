import React, { useState, useCallback, useRef, useEffect } from 'react';
import { cn } from '../lib/utils';
import { getFormatPreset, type ColumnFormat } from './column-formats';
import { Empty } from './empty';
import { ColumnPicker } from './column-picker';

export interface ColumnDef<T> {
  key: string;
  label: string;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  visible?: boolean;
  fixed?: 'left' | 'right' | false;
  align?: 'left' | 'right' | 'center';
  sortable?: boolean;
  resizable?: boolean;
  format?: string;
  render?: (row: T, index: number) => React.ReactNode;
  renderHeader?: () => React.ReactNode;
  /** 子列定义——用于列分组（多级表头） */
  children?: ColumnDef<T>[];
}

export interface VirtualizedConfig {
  rowHeight: number;
  /** 上下 overscan 缓冲行数，默认 5 */
  overscan?: number;
  /** 展开行的固定占位高度（expandable + virtualized 共存时），默认 rowHeight */
  detailRowHeight?: number;
}

export interface ExpandableConfig<T> {
  renderDetail: (row: T, index: number) => React.ReactNode;
  expandedKeys?: Set<string>;
  defaultExpandedKeys?: Set<string>;
  onExpandedChange?: (keys: Set<string>) => void;
  getRowKey?: (row: T, index: number) => string;
}

export interface ColumnStorageConfig {
  key: string;
  storage?: Storage;
}

export interface ConfigurableGridProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  onColumnsChange?: (columns: ColumnDef<T>[]) => void;
  rowKey: string | ((row: T) => string);
  onRowClick?: (row: T) => void;
  sortable?: boolean;
  emptyText?: string;
  className?: string;
  /** 虚拟滚动配置 */
  virtualized?: VirtualizedConfig;
  /** 行展开配置 */
  expandable?: ExpandableConfig<T>;
  /** 列状态持久化 */
  columnStorage?: ColumnStorageConfig;
  /** 是否显示 ColumnPicker 按钮 */
  columnPicker?: boolean;
}

type SortDir = 'asc' | 'desc' | null;

function getRowKey<T>(row: T, rowKey: string | ((row: T) => string)): string {
  if (typeof rowKey === 'function') return rowKey(row);
  return String((row as Record<string, unknown>)[rowKey] ?? '');
}

// ─── 列分组辅助函数 ───────────────────────────────────

/** 展开分组列，返回叶子列列表 */
function flattenColumns<T>(cols: ColumnDef<T>[]): ColumnDef<T>[] {
  return cols.flatMap((c) => {
    if (c.children && c.children.length > 0 && c.visible !== false) {
      return flattenColumns(c.children);
    }
    return c.visible !== false ? [c] : [];
  });
}

/** 计算分组列的树深度 */
function maxColumnDepth<T>(cols: ColumnDef<T>[]): number {
  let max = 0;
  for (const c of cols) {
    if (c.children && c.children.length > 0) {
      max = Math.max(max, 1 + maxColumnDepth(c.children));
    }
  }
  return max;
}

interface HeaderCellInfo {
  column: ColumnDef<unknown>;
  colSpan: number;
  rowSpan: number;
  isGroup: boolean;
}

/** 递归构建表头行网格 */
function buildHeaderRows<T>(
  cols: ColumnDef<T>[],
  depth: number,
  maxDepth: number,
): HeaderCellInfo[][] {
  const rows: HeaderCellInfo[][] = Array.from({ length: maxDepth + 1 }, () => []);
  for (const col of cols) {
    if (col.visible === false) continue;
    if (col.children && col.children.length > 0) {
      // 分组节点——占据 1 行，colSpan = 可见子列数
      const leafCount = flattenColumns(col.children).length;
      rows[depth].push({ column: col as ColumnDef<unknown>, colSpan: leafCount, rowSpan: 1, isGroup: true });
      const childRows = buildHeaderRows(col.children, depth + 1, maxDepth);
      for (let r = depth + 1; r <= maxDepth; r++) {
        rows[r].push(...childRows[r]);
      }
    } else {
      // 叶子节点——rowSpan = 剩余深度 + 1
      const rowSpan = maxDepth - depth + 1;
      rows[depth].push({ column: col as ColumnDef<unknown>, colSpan: 1, rowSpan, isGroup: false });
    }
  }
  return rows;
}

function useColumnResize(
  onColumnsChange: ((columns: ColumnDef<unknown>[]) => void) | undefined,
  columns: ColumnDef<unknown>[],
) {
  const resizingRef = useRef<{ key: string; startX: number; startWidth: number } | null>(null);
  const listenersRef = useRef<{ mousemove: (ev: MouseEvent) => void; mouseup: () => void } | null>(null);

  const cleanup = useCallback(() => {
    if (listenersRef.current) {
      document.removeEventListener('mousemove', listenersRef.current.mousemove);
      document.removeEventListener('mouseup', listenersRef.current.mouseup);
      listenersRef.current = null;
    }
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
    resizingRef.current = null;
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, colIndex: number) => {
      const col = columns[colIndex];
      if (!col || !col.resizable) return;
      e.preventDefault();
      const startX = e.clientX;
      const startWidth = col.width || 120;
      resizingRef.current = { key: col.key, startX, startWidth };

      const handleMouseMove = (ev: MouseEvent) => {
        if (!resizingRef.current) return;
        const { startX: sx, startWidth: sw, key } = resizingRef.current;
        const diff = ev.clientX - sx;
        const newWidth = Math.max(col.minWidth || 60, Math.min(col.maxWidth || 9999, sw + diff));
        const updated = columns.map((c) => (c.key === key ? { ...c, width: newWidth } : c));
        onColumnsChange?.(updated);
      };

      const handleMouseUp = () => {
        cleanup();
      };

      listenersRef.current = { mousemove: handleMouseMove, mouseup: handleMouseUp };
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [columns, onColumnsChange, cleanup],
  );

  return { handleMouseDown, cleanup };
}

function ConfigurableGridInner<T>({
  data,
  columns: rawColumns,
  onColumnsChange,
  rowKey,
  onRowClick,
  sortable: globalSortable,
  emptyText,
  className,
  virtualized,
  expandable,
  columnStorage,
  columnPicker,
}: ConfigurableGridProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      setScrollTop(scrollRef.current.scrollTop);
      setContainerHeight(scrollRef.current.clientHeight);
    }
  }, []);

  // 行展开状态
  const isExpandableControlled = !!expandable?.expandedKeys;
  const [localExpanded, setLocalExpanded] = useState<Set<string>>(
    () => new Set(expandable?.defaultExpandedKeys ?? []),
  );
  const expandedKeys = isExpandableControlled
    ? (expandable!.expandedKeys ?? new Set<string>())
    : localExpanded;
  const getExpandKey = expandable?.getRowKey ?? ((row: T, idx: number) => getRowKey(row, rowKey) || String(idx));

  const toggleExpand = useCallback(
    (row: T, idx: number) => {
      const key = getExpandKey(row, idx);
      const next = new Set(expandedKeys);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      if (isExpandableControlled) {
        expandable?.onExpandedChange?.(next);
      } else {
        setLocalExpanded(next);
      }
    },
    [expandedKeys, getExpandKey, isExpandableControlled, expandable],
  );

  const hasGroupedColumns = rawColumns.some((c) => c.children && c.children.length > 0);
  const columns = hasGroupedColumns
    ? flattenColumns(rawColumns).filter((c) => c.visible !== false)
    : rawColumns.filter((c) => c.visible !== false);
  const hasResizable = columns.some((c) => c.resizable);
  const colSpanTotal = columns.length + (expandable ? 1 : 0);

  // 列状态持久化
  const storageRef = useRef(columnStorage?.storage ?? (typeof window !== 'undefined' ? window.localStorage : null));
  useEffect(() => {
    if (!columnStorage?.key || !onColumnsChange) return;
    try {
      const saved = storageRef.current?.getItem(columnStorage.key);
      if (saved) {
        const parsed = JSON.parse(saved) as ColumnDef<T>[];
        // 只合并可序列化的字段，保留原始列的结构
        const merged = rawColumns.map((orig) => {
          const savedCol = parsed.find((s) => s.key === orig.key);
          if (savedCol) {
            return { ...orig, width: savedCol.width ?? orig.width, visible: savedCol.visible, fixed: savedCol.fixed };
          }
          return orig;
        });
        onColumnsChange(merged);
      }
    } catch {
      // storage parse error — 静默忽略，使用默认列
    }
    // 仅在挂载时执行一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!columnStorage?.key) return;
    try {
      const serializable = rawColumns.map((c) => ({ key: c.key, width: c.width, visible: c.visible, fixed: c.fixed }));
      storageRef.current?.setItem(columnStorage.key, JSON.stringify(serializable));
    } catch {
      // storage write error — 静默忽略
    }
  }, [rawColumns, columnStorage?.key]);

  // ColumnPicker 状态 + 保存初始列作为默认值
  const [pickerOpen, setPickerOpen] = useState(false);
  const defaultColumnsRef = useRef(rawColumns);

  // 列分组：构建表头行网格
  const headerRows = React.useMemo(() => {
    if (!hasGroupedColumns) return null;
    const depth = maxColumnDepth(rawColumns);
    return buildHeaderRows(rawColumns, 0, depth);
  }, [rawColumns, hasGroupedColumns]);

  const { handleMouseDown, cleanup: resizeCleanup } = useColumnResize(
    (onColumnsChange ?? (() => {})) as (cols: ColumnDef<unknown>[]) => void,
    rawColumns as ColumnDef<unknown>[],
  );

  useEffect(() => resizeCleanup, [resizeCleanup]);

  const handleSort = useCallback((key: string) => {
    setSortKey((prev) => {
      if (prev === key) {
        setSortDir((d) => {
          if (d === 'asc') return 'desc';
          if (d === 'desc') return null;
          return 'desc';
        });
        return key;
      }
      setSortDir('asc');
      return key;
    });
  }, []);

  // Compute fixed column offsets
  const fixedLeftWidths: number[] = [];
  const fixedRightWidths: number[] = [];
  let leftAccum = 0;
  let rightAccum = 0;

  columns.forEach((col, i) => {
    if (col.fixed === 'left') {
      fixedLeftWidths[i] = leftAccum;
      leftAccum += col.width || 120;
    } else {
      fixedLeftWidths[i] = 0;
    }
  });

  for (let i = columns.length - 1; i >= 0; i--) {
    const col = columns[i];
    if (col.fixed === 'right') {
      fixedRightWidths[i] = rightAccum;
      rightAccum += col.width || 120;
    } else {
      fixedRightWidths[i] = 0;
    }
  }

  // Sort data
  const sorted = React.useMemo(() => {
    if (!sortKey || !sortDir) return data;
    return [...data].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortKey];
      const bVal = (b as Record<string, unknown>)[sortKey];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      const aStr = String(aVal ?? '');
      const bStr = String(bVal ?? '');
      return sortDir === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    });
  }, [data, sortKey, sortDir]);

  const isSortable = (col: ColumnDef<T>) => globalSortable ?? col.sortable ?? false;
  const hasFixedCol = columns.some((c) => c.fixed);

  // 虚拟滚动计算
  const virtualRowHeight = virtualized?.rowHeight ?? 0;
  const overscan = virtualized?.overscan ?? 5;
  const isVirtualized = !!virtualized;

  let visibleStart = 0;
  let visibleEnd = data.length;
  let topSpacerHeight = 0;
  let bottomSpacerHeight = 0;

  if (isVirtualized && containerHeight > 0) {
    visibleStart = Math.max(0, Math.floor(scrollTop / virtualRowHeight) - overscan);
    visibleEnd = Math.min(data.length, Math.ceil((scrollTop + containerHeight) / virtualRowHeight) + overscan);
    topSpacerHeight = visibleStart * virtualRowHeight;
    bottomSpacerHeight = (data.length - visibleEnd) * virtualRowHeight;
  }

  const visibleData = isVirtualized && containerHeight > 0 ? sorted.slice(visibleStart, visibleEnd) : sorted;

  return (
    <div
      ref={scrollRef}
      onScroll={isVirtualized ? handleScroll : undefined}
      className={cn(
        'relative w-full overflow-auto rounded-[var(--card-radius)] border border-[var(--border-main)] bg-[var(--bg-card)]',
        className,
      )}
    >
      {/* ColumnPicker 集成：工具条 */}
      {columnPicker && (
        <div className="flex items-center justify-end px-3 py-1 border-b border-[var(--border-sub)]">
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="inline-flex items-center justify-center w-6 h-6 text-[13px] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] rounded hover:bg-[var(--bg-card-hover)] transition-colors"
            title="列设置"
          >
            ⚙
          </button>
        </div>
      )}
      {/* ColumnPicker 弹窗 */}
      {columnPicker && pickerOpen && (
        <ColumnPicker
          open={pickerOpen}
          onOpenChange={setPickerOpen}
          columns={rawColumns as ColumnDef<unknown>[]}
          onChange={(cols) => onColumnsChange?.(cols as ColumnDef<T>[])}
          defaultColumns={defaultColumnsRef.current as ColumnDef<unknown>[]}
        />
      )}
      <table className="w-full caption-bottom text-[13px] text-[var(--text-primary)]" style={{ tableLayout: 'fixed' }}>
        <thead>
          {hasGroupedColumns && headerRows
            ? headerRows.map((row, rowIdx) => (
                <tr key={`hdr-${rowIdx}`} className="border-b border-[var(--border-sub)]">
                  {expandable && rowIdx === 0 && (
                    <th
                      key="__expand"
                      className="h-10 px-2 text-[11px] font-medium text-[var(--text-secondary)] w-8 select-none"
                      style={{ width: 32, minWidth: 32, maxWidth: 32 }}
                      rowSpan={headerRows.length}
                    />
                  )}
                  {row.map((cell, ci) => {
                    const col = cell.column;
                    const headerAlign = col.align || 'left';
                    return (
                      <th
                        key={col.key || `hdr-${rowIdx}-${ci}`}
                        colSpan={cell.colSpan}
                        rowSpan={cell.rowSpan}
                        className={cn(
                          'h-10 px-5 text-[11px] font-medium text-[var(--text-secondary)] tracking-[0.03em] select-none',
                          headerAlign === 'right'
                            ? 'text-right'
                            : headerAlign === 'center'
                              ? 'text-center'
                              : 'text-left',
                          !cell.isGroup && isSortable(col as ColumnDef<T>) &&
                            'cursor-pointer select-none hover:text-[var(--text-primary)] transition-colors',
                        )}
                        style={{
                          width: !cell.isGroup && col.width ? col.width : undefined,
                          minWidth: col.minWidth || 60,
                        }}
                        onClick={() => {
                          if (!cell.isGroup && isSortable(col as ColumnDef<T>)) {
                            handleSort(col.key);
                          }
                        }}
                      >
                        {col.renderHeader ? col.renderHeader() : (
                          <span className="inline-flex items-center gap-1">
                            {col.label}
                            {!cell.isGroup && isSortable(col as ColumnDef<T>) && sortKey === col.key && (
                              <span className="text-[10px]">{sortDir === 'asc' ? '\u25B2' : '\u25BC'}</span>
                            )}
                          </span>
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))
            : (
              <tr className="border-b border-[var(--border-sub)]">
                {expandable && (
                  <th
                    key="__expand"
                    className="h-10 px-2 text-[11px] font-medium text-[var(--text-secondary)] w-8 select-none"
                    style={{ width: 32, minWidth: 32, maxWidth: 32 }}
                  />
                )}
                {columns.map((col, i) => {
                  const formatPreset: ColumnFormat | undefined = col.format
                    ? getFormatPreset(col.format)
                    : undefined;
                  const headerAlign = col.align || formatPreset?.align || 'left';

                  return (
                    <th
                      key={col.key}
                      className={cn(
                        'h-10 px-5 text-[11px] font-medium text-[var(--text-secondary)] tracking-[0.03em] relative select-none',
                        headerAlign === 'right'
                          ? 'text-right'
                          : headerAlign === 'center'
                            ? 'text-center'
                            : 'text-left',
                        isSortable(col) &&
                          'cursor-pointer select-none hover:text-[var(--text-primary)] transition-colors',
                      )}
                      style={{
                        width: col.width || 120,
                        minWidth: col.minWidth || 60,
                        maxWidth: col.maxWidth,
                        ...(hasFixedCol && col.fixed === 'left'
                          ? ({ position: 'sticky', left: fixedLeftWidths[i], zIndex: col.fixed ? 4 : 3 } as React.CSSProperties)
                          : {}),
                        ...(hasFixedCol && col.fixed === 'right'
                          ? ({ position: 'sticky', right: fixedRightWidths[i], zIndex: col.fixed ? 4 : 3 } as React.CSSProperties)
                          : {}),
                        ...(col.fixed ? { background: 'var(--bg-card)' } : {}),
                      }}
                      onClick={() => isSortable(col) && handleSort(col.key)}
                    >
                      {col.renderHeader ? (
                        col.renderHeader()
                      ) : (
                        <span className="inline-flex items-center gap-1">
                          {col.label}
                          {isSortable(col) && sortKey === col.key && (
                            <span className="text-[10px]">{sortDir === 'asc' ? '\u25B2' : '\u25BC'}</span>
                          )}
                        </span>
                      )}
                      {col.resizable && hasResizable && (
                        <div
                          className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-[var(--accent)] hover:opacity-50"
                          onMouseDown={(e) => {
                            const idx = rawColumns.findIndex((c) => c.key === col.key);
                            if (idx >= 0) handleMouseDown(e, idx);
                          }}
                        />
                      )}
                    </th>
                  );
                })}
              </tr>
            )}
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr>
              <td colSpan={colSpanTotal} className="p-8 text-center">
                <Empty description={emptyText} />
              </td>
            </tr>
          ) : (
            <>
              {isVirtualized && topSpacerHeight > 0 && (
                <tr>
                  <td colSpan={colSpanTotal} style={{ height: topSpacerHeight, border: 'none', padding: 0 }} />
                </tr>
              )}
              {visibleData.map((row, displayIdx) => {
                const realIdx = isVirtualized ? visibleStart + displayIdx : displayIdx;
                const rowKeyStr = getRowKey(row, rowKey) || String(realIdx);
                const isExpanded = expandable ? expandedKeys.has(getExpandKey(row, realIdx)) : false;
                const detailHeight = virtualized?.detailRowHeight ?? virtualRowHeight;
                return (
                  <React.Fragment key={rowKeyStr}>
                    <tr
                      className={cn(
                        'border-b border-[var(--border-sub)] transition-colors hover:bg-[var(--bg-card-hover)]',
                        onRowClick && 'cursor-pointer',
                      )}
                      onClick={() => onRowClick?.(row)}
                    >
                      {expandable && (
                        <td
                          className="p-2 px-3 text-center w-8 select-none"
                          style={{ width: 32, minWidth: 32, maxWidth: 32 }}
                          onClick={(e) => { e.stopPropagation(); toggleExpand(row, realIdx); }}
                        >
                          <span className="inline-flex items-center justify-center w-4 h-4 text-[10px] cursor-pointer text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">
                            {isExpanded ? '\u25BC' : '\u25B6'}
                          </span>
                        </td>
                      )}
                      {columns.map((col, ci) => {
                        const formatPreset: ColumnFormat | undefined = col.format
                          ? getFormatPreset(col.format)
                          : undefined;
                        const colAlign = col.align || formatPreset?.align || 'left';
                        const cellValue = (row as Record<string, unknown>)[col.key];
                        return (
                          <td
                            key={col.key}
                            className={cn(
                              'p-3 px-5',
                              colAlign === 'right'
                                ? 'text-right font-[var(--font-mono)]'
                                : colAlign === 'center'
                                  ? 'text-center'
                                  : 'text-left',
                            )}
                            style={{
                              width: col.width || 120,
                              ...(hasFixedCol && col.fixed === 'left'
                                ? ({ position: 'sticky', left: fixedLeftWidths[ci], zIndex: col.fixed ? 2 : 1 } as React.CSSProperties)
                                : {}),
                              ...(hasFixedCol && col.fixed === 'right'
                                ? ({ position: 'sticky', right: fixedRightWidths[ci], zIndex: col.fixed ? 2 : 1 } as React.CSSProperties)
                                : {}),
                              ...(col.fixed ? { background: 'var(--bg-card)' } : {}),
                            }}
                          >
                            {col.render
                              ? col.render(row, realIdx)
                              : formatPreset?.render
                                ? formatPreset.render(cellValue, row)
                                : formatPreset?.format
                                  ? formatPreset.format(cellValue)
                                  : String(cellValue ?? '')}
                          </td>
                        );
                      })}
                    </tr>
                    {isExpanded && expandable?.renderDetail && (
                      <tr key={`${rowKeyStr}_detail`} className="border-b border-[var(--border-sub)]">
                        <td
                          colSpan={colSpanTotal}
                          className="p-4"
                          style={{ height: isVirtualized ? detailHeight : undefined }}
                        >
                          {expandable.renderDetail(row, realIdx)}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
              {isVirtualized && bottomSpacerHeight > 0 && (
                <tr>
                  <td colSpan={colSpanTotal} style={{ height: bottomSpacerHeight, border: 'none', padding: 0 }} />
                </tr>
              )}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}

export function ConfigurableGrid<T>(props: ConfigurableGridProps<T>) {
  return <ConfigurableGridInner<T> {...props} />;
}
