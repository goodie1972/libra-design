import React, { useState, useCallback, useRef, useEffect } from 'react';
import { cn } from '../lib/utils';
import { getFormatPreset, type ColumnFormat } from './column-formats';
import { Empty } from './empty';
import { ColumnPicker } from './column-picker';

export interface ColumnGroupable {
  /** 折叠时仅显示这些子列的 key */
  collapsedColumns: string[];
  /** 默认是否折叠 */
  defaultCollapsed?: boolean;
}

export interface ColumnConditionalColor {
  /** 比较值 */
  value: number | string;
  /** 颜色，如 'var(--up)' / 'var(--down)' / '#ff0' */
  color: string;
  /** 背景色，可选 */
  bg?: string;
  /** 比较操作符，默认 '>' */
  op?: '>' | '<' | '>=' | '<=' | '=' | 'between';
  /** between 模式的上限 */
  max?: number | string;
}

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
  /** Excel 风格列组折叠 */
  groupable?: ColumnGroupable;
  /** 条件着色规则 */
  conditionalColor?: ColumnConditionalColor[];
  /** 筛选器配置 */
  filterable?: boolean;
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

export interface SelectableConfig<T> {
  selectedKeys?: Set<string>;
  defaultSelectedKeys?: Set<string>;
  onSelectionChange?: (keys: Set<string>) => void;
  showCheckbox?: boolean;
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
  /** 启用键盘导航（ArrowUp/Down/Home/End） */
  navigable?: boolean;
  /** 多选配置 */
  selectable?: SelectableConfig<T>;
}

type SortDir = 'asc' | 'desc' | null;

function getRowKey<T>(row: T, rowKey: string | ((row: T) => string)): string {
  if (typeof rowKey === 'function') return rowKey(row);
  return String((row as Record<string, unknown>)[rowKey] ?? '');
}

// ─── 列分组辅助函数 ───────────────────────────────────

/** 展开分组列，返回叶子列列表（支持折叠状态） */
function flattenColumns<T>(cols: ColumnDef<T>[], collapsedGroups?: Set<string>): ColumnDef<T>[] {
  return cols.flatMap((c) => {
    if (c.children && c.children.length > 0 && c.visible !== false) {
      if (collapsedGroups?.has(c.key)) {
        return c.children.filter((ch) => ch.visible !== false && c.groupable?.collapsedColumns.includes(ch.key));
      }
      return flattenColumns(c.children, collapsedGroups);
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
  collapsedGroups?: Set<string>,
): HeaderCellInfo[][] {
  const rows: HeaderCellInfo[][] = Array.from({ length: maxDepth + 1 }, () => []);
  for (const col of cols) {
    if (col.visible === false) continue;
    if (col.children && col.children.length > 0) {
      const isCollapsed = collapsedGroups?.has(col.key);
      const visibleChildren = isCollapsed
        ? col.children.filter((ch) => ch.visible !== false && col.groupable?.collapsedColumns.includes(ch.key))
        : col.children.filter((ch) => ch.visible !== false);
      if (visibleChildren.length === 0) continue;
      const leafCount = isCollapsed
        ? visibleChildren.length
        : flattenColumns(visibleChildren, collapsedGroups).length;
      rows[depth].push({ column: col as ColumnDef<unknown>, colSpan: leafCount, rowSpan: 1, isGroup: true });
      if (!isCollapsed) {
        const childRows = buildHeaderRows(col.children, depth + 1, maxDepth, collapsedGroups);
        for (let r = depth + 1; r <= maxDepth; r++) {
          rows[r].push(...childRows[r]);
        }
      }
    } else {
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
  navigable,
  selectable,
}: ConfigurableGridProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const lastClickIndexRef = useRef<number>(-1);

  const isSelectControlled = !!selectable?.selectedKeys;
  const defaultSelected = selectable?.defaultSelectedKeys ?? new Set<string>();
  const [localSelectedKeys, setLocalSelectedKeys] = useState<Set<string>>(new Set(defaultSelected));
  const selectedKeys = isSelectControlled
    ? (selectable!.selectedKeys ?? new Set<string>())
    : localSelectedKeys;

  const toggleSelection = useCallback((key: string, ctrlKey?: boolean) => {
    const next = new Set(selectedKeys);
    if (ctrlKey) {
      if (next.has(key)) next.delete(key);
      else next.add(key);
    } else {
      if (next.has(key) && next.size === 1) next.clear();
      else { next.clear(); next.add(key); }
    }
    if (isSelectControlled) {
      selectable?.onSelectionChange?.(next);
    } else {
      setLocalSelectedKeys(next);
    }
  }, [selectedKeys, isSelectControlled, selectable]);

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

  // 列组折叠状态
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(() => {
    const init = new Set<string>();
    for (const col of rawColumns) {
      if (col.groupable?.defaultCollapsed) init.add(col.key);
    }
    return init;
  });
  const toggleCollapseGroup = useCallback((key: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  // 表头筛选状态
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!openFilter) return;
    const cb = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setOpenFilter(null);
    };
    document.addEventListener('mousedown', cb);
    return () => document.removeEventListener('mousedown', cb);
  }, [openFilter]);

  // 列拖拽排序状态
  const dragColRef = useRef<{ key: string; startX: number; startIdx: number } | null>(null);

  const hasGroupedColumns = rawColumns.some((c) => c.children && c.children.length > 0);
  const columns = hasGroupedColumns
    ? flattenColumns(rawColumns, collapsedGroups).filter((c) => c.visible !== false)
    : rawColumns.filter((c) => c.visible !== false);
  const hasResizable = columns.some((c) => c.resizable);
  const colSpanTotal = columns.length + (expandable ? 1 : 0);

  // 条件着色辅助
  function getConditionalStyle(col: ColumnDef<T>, value: unknown): React.CSSProperties {
    const rules = col.conditionalColor;
    if (!rules || rules.length === 0) return {};
    const numVal = typeof value === 'number' ? value : Number(value);
    for (const rule of rules) {
      const op = rule.op || '>';
      let match = false;
      if (typeof numVal === 'number' && !isNaN(numVal)) {
        const rv = typeof rule.value === 'number' ? rule.value : Number(rule.value);
        switch (op) {
          case '>': match = numVal > rv; break;
          case '<': match = numVal < rv; break;
          case '>=': match = numVal >= rv; break;
          case '<=': match = numVal <= rv; break;
          case '=': match = numVal === rv; break;
          case 'between': match = numVal >= rv && numVal <= Number(rule.max ?? Infinity); break;
        }
      }
      if (match) {
        const s: React.CSSProperties = {};
        if (rule.color) s.color = rule.color;
        if (rule.bg) s.background = rule.bg;
        return s;
      }
    }
    return {};
  }

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

  // Filter data
  const filtered = React.useMemo(() => {
    const filterKeys = Object.keys(filterValues);
    if (filterKeys.length === 0) return data;
    return data.filter((row) => {
      for (const key of filterKeys) {
        const val = filterValues[key];
        if (!val) continue;
        const cellVal = String((row as Record<string, unknown>)[key] ?? '');
        if (!cellVal.toLowerCase().includes(val.toLowerCase())) return false;
      }
      return true;
    });
  }, [data, filterValues]);

  // Sort data
  const sorted = React.useMemo(() => {
    if (!sortKey || !sortDir) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortKey];
      const bVal = (b as Record<string, unknown>)[sortKey];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      const aStr = String(aVal ?? '');
      const bStr = String(bVal ?? '');
      return sortDir === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    });
  }, [filtered, sortKey, sortDir]);

  const handleRowSelect = useCallback((row: T, idx: number, e: React.MouseEvent) => {
    if (!selectable) return;
    const key = getRowKey(row, rowKey) || String(idx);
    if (e.shiftKey && lastClickIndexRef.current >= 0) {
      const from = lastClickIndexRef.current;
      const next = new Set(selectedKeys);
      const start = Math.min(from, idx);
      const end = Math.max(from, idx);
      for (let i = start; i <= end; i++) {
        const r = sorted[i];
        if (r) next.add(getRowKey(r, rowKey) || String(i));
      }
      if (isSelectControlled) {
        selectable?.onSelectionChange?.(next);
      } else {
        setLocalSelectedKeys(next);
      }
    } else if (e.ctrlKey || e.metaKey) {
      toggleSelection(key, true);
    } else {
      toggleSelection(key);
    }
    lastClickIndexRef.current = idx;
  }, [selectable, rowKey, toggleSelection, isSelectControlled, sorted]);

  const isSortable = (col: ColumnDef<T>) => globalSortable ?? col.sortable ?? false;
  const hasFixedCol = columns.some((c) => c.fixed);

  // 虚拟滚动计算
  const virtualRowHeight = virtualized?.rowHeight ?? 0;
  const overscan = virtualized?.overscan ?? 5;
  const isVirtualized = !!virtualized;

  let visibleStart = 0;
  let visibleEnd = filtered.length;
  let topSpacerHeight = 0;
  let bottomSpacerHeight = 0;

  if (isVirtualized && containerHeight > 0) {
    visibleStart = Math.max(0, Math.floor(scrollTop / virtualRowHeight) - overscan);
    visibleEnd = Math.min(filtered.length, Math.ceil((scrollTop + containerHeight) / virtualRowHeight) + overscan);
    topSpacerHeight = visibleStart * virtualRowHeight;
    bottomSpacerHeight = (filtered.length - visibleEnd) * virtualRowHeight;
  }

  const visibleData = isVirtualized && containerHeight > 0 ? sorted.slice(visibleStart, visibleEnd) : sorted;

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!navigable && !selectable) return;
    const maxIdx = sorted.length - 1;
    if (maxIdx < 0) return;
    let nextFocus = focusedIndex;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        nextFocus = Math.min(focusedIndex + 1, maxIdx);
        break;
      case 'ArrowUp':
        e.preventDefault();
        nextFocus = Math.max(focusedIndex - 1, 0);
        break;
      case 'Home':
        e.preventDefault();
        nextFocus = 0;
        break;
      case 'End':
        e.preventDefault();
        nextFocus = maxIdx;
        break;
      case 'Escape':
        e.preventDefault();
        setFocusedIndex(-1);
        return;
      case ' ':
        if (selectable && focusedIndex >= 0) {
          e.preventDefault();
          const row = sorted[focusedIndex];
          const key = getRowKey(row, rowKey) || String(focusedIndex);
          toggleSelection(key, false);
          lastClickIndexRef.current = focusedIndex;
        }
        return;
      case 'a':
        if (selectable && (e.ctrlKey || e.metaKey)) {
          e.preventDefault();
          const all = new Set(sorted.map((r, i) => getRowKey(r, rowKey) || String(i)));
          if (isSelectControlled) {
            selectable?.onSelectionChange?.(all);
          } else {
            setLocalSelectedKeys(all);
          }
        }
        return;
      default:
        return;
    }

    if (nextFocus !== focusedIndex) {
      setFocusedIndex(nextFocus);
      if (isVirtualized && scrollRef.current && nextFocus >= 0) {
        const rowTop = nextFocus * virtualRowHeight;
        const rowBottom = rowTop + virtualRowHeight;
        const st = scrollRef.current.scrollTop;
        const ch = scrollRef.current.clientHeight;
        if (rowTop < st) scrollRef.current.scrollTop = rowTop;
        else if (rowBottom > st + ch) scrollRef.current.scrollTop = rowBottom - ch;
      }
    }
  }, [navigable, selectable, focusedIndex, sorted, rowKey, toggleSelection, isSelectControlled, isVirtualized, virtualRowHeight]);

  const showCheckbox = selectable?.showCheckbox === true;
  const totalColSpan = colSpanTotal + (showCheckbox ? 1 : 0);

  return (
    <div
      ref={scrollRef}
      onScroll={isVirtualized ? handleScroll : undefined}
      tabIndex={navigable || selectable ? 0 : undefined}
      onKeyDown={handleKeyDown}
      className={cn(
        'relative w-full overflow-auto rounded-[var(--card-radius)] border border-[var(--border-main)] bg-[var(--bg-card)]',
        (navigable || selectable) && 'outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)]',
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
                  {showCheckbox && rowIdx === 0 && (
                    <th
                      className="h-10 px-2 text-[11px] font-medium text-[var(--text-secondary)] select-none"
                      style={{ width: 40, minWidth: 40, maxWidth: 40 }}
                      rowSpan={headerRows.length}
                    >
                      <input
                        ref={(el) => { if (el) el.indeterminate = selectedKeys.size > 0 && selectedKeys.size < sorted.length; }}
                        type="checkbox"
                        className="cursor-pointer accent-[var(--accent)]"
                        checked={sorted.length > 0 && selectedKeys.size === sorted.length}
                        onChange={() => {
                          if (selectedKeys.size === sorted.length) {
                            if (isSelectControlled) selectable?.onSelectionChange?.(new Set());
                            else setLocalSelectedKeys(new Set());
                          } else {
                            const all = new Set(sorted.map((r, i) => getRowKey(r, rowKey) || String(i)));
                            if (isSelectControlled) selectable?.onSelectionChange?.(all);
                            else setLocalSelectedKeys(all);
                          }
                        }}
                      />
                    </th>
                  )}
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
                    const isCollapsed = cell.isGroup && collapsedGroups.has(col.key);
                    const hasGroupToggle = cell.isGroup && !!(col as ColumnDef<T>).groupable;
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
                            {hasGroupToggle && (
                              <span
                                className="inline-flex items-center justify-center w-3.5 h-3.5 text-[10px] cursor-pointer hover:text-[var(--text-primary)] transition-colors select-none"
                                onClick={(e) => { e.stopPropagation(); toggleCollapseGroup(col.key); }}
                              >
                                {isCollapsed ? '\u25B6' : '\u25BC'}
                              </span>
                            )}
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
                {showCheckbox && (
                  <th
                    className="h-10 px-2 text-[11px] font-medium text-[var(--text-secondary)] select-none"
                    style={{ width: 40, minWidth: 40, maxWidth: 40 }}
                  >
                    <input
                      ref={(el) => { if (el) el.indeterminate = selectedKeys.size > 0 && selectedKeys.size < sorted.length; }}
                      type="checkbox"
                      className="cursor-pointer accent-[var(--accent)]"
                      checked={sorted.length > 0 && selectedKeys.size === sorted.length}
                      onChange={() => {
                        if (selectedKeys.size === sorted.length) {
                          if (isSelectControlled) selectable?.onSelectionChange?.(new Set());
                          else setLocalSelectedKeys(new Set());
                        } else {
                          const all = new Set(sorted.map((r, i) => getRowKey(r, rowKey) || String(i)));
                          if (isSelectControlled) selectable?.onSelectionChange?.(all);
                          else setLocalSelectedKeys(all);
                        }
                      }}
                    />
                  </th>
                )}
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
                  const hasFilter = col.filterable;
                  const isFilterOpen = openFilter === col.key;
                  const hasColGroup = !!(col as ColumnDef<T>).groupable;
                  const isColGroupCollapsed = hasColGroup && collapsedGroups.has(col.key);

                  return (
                    <th
                      key={col.key}
                      draggable={!col.fixed}
                      className={cn(
                        'h-10 px-5 text-[11px] font-medium text-[var(--text-secondary)] tracking-[0.03em] relative select-none',
                        headerAlign === 'right'
                          ? 'text-right'
                          : headerAlign === 'center'
                            ? 'text-center'
                            : 'text-left',
                        isSortable(col) &&
                          'cursor-pointer select-none hover:text-[var(--text-primary)] transition-colors',
                        !col.fixed && 'cursor-grab active:cursor-grabbing',
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
                      onDragStart={(e) => {
                        dragColRef.current = { key: col.key, startX: e.clientX, startIdx: i };
                        e.dataTransfer.effectAllowed = 'move';
                      }}
                      onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
                      onDrop={(e) => {
                        e.preventDefault();
                        const src = dragColRef.current;
                        if (!src || src.key === col.key || !onColumnsChange) return;
                        const updated = [...rawColumns];
                        const srcIdx = updated.findIndex((c) => c.key === src.key);
                        const dstIdx = updated.findIndex((c) => c.key === col.key);
                        if (srcIdx < 0 || dstIdx < 0) return;
                        const [moved] = updated.splice(srcIdx, 1);
                        updated.splice(dstIdx, 0, moved);
                        onColumnsChange(updated);
                        dragColRef.current = null;
                      }}
                    >
                      {col.renderHeader ? (
                        col.renderHeader()
                      ) : (
                        <span className="inline-flex items-center gap-1">
                          {hasColGroup && (
                            <span
                              className="inline-flex items-center justify-center w-3.5 h-3.5 text-[10px] cursor-pointer hover:text-[var(--text-primary)] transition-colors"
                              onClick={(e) => { e.stopPropagation(); toggleCollapseGroup(col.key); }}
                            >
                              {isColGroupCollapsed ? '\u25B6' : '\u25BC'}
                            </span>
                          )}
                          {col.label}
                          {isSortable(col) && sortKey === col.key && (
                            <span className="text-[10px]">{sortDir === 'asc' ? '\u25B2' : '\u25BC'}</span>
                          )}
                          {hasFilter && (
                            <span
                              className={cn(
                                'inline-flex items-center justify-center w-4 h-4 text-[11px] rounded cursor-pointer hover:bg-[var(--bg-card-hover)]',
                                filterValues[col.key] ? 'text-[var(--accent)]' : 'text-[var(--text-tertiary)]',
                              )}
                              onClick={(e) => { e.stopPropagation(); setOpenFilter(isFilterOpen ? null : col.key); }}
                            >
                              \u25C6
                            </span>
                          )}
                        </span>
                      )}
                      {isFilterOpen && (
                        <div
                          ref={filterRef}
                          className="absolute top-full left-0 mt-1 z-50 w-48 p-2 rounded bg-[var(--bg-card)] border border-[var(--border-main)] shadow-lg"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            className="w-full h-7 px-2 text-[12px] rounded bg-[var(--bg-card-hover)] border border-[var(--border-sub)] text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
                            placeholder="搜索..."
                            autoFocus
                            value={filterValues[col.key] || ''}
                            onChange={(e) => {
                              setFilterValues((prev) => ({ ...prev, [col.key]: e.target.value }));
                            }}
                          />
                          {filterValues[col.key] && (
                            <button
                              className="mt-1 w-full h-6 text-[11px] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] rounded hover:bg-[var(--bg-card-hover)] transition-colors"
                              onClick={() => {
                                const next = { ...filterValues };
                                delete next[col.key];
                                setFilterValues(next);
                              }}
                            >
                              清除筛选
                            </button>
                          )}
                        </div>
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
              <td colSpan={totalColSpan} className="p-8 text-center">
                <Empty description={emptyText} />
              </td>
            </tr>
          ) : (
            <>
              {isVirtualized && topSpacerHeight > 0 && (
                <tr>
                  <td colSpan={totalColSpan} style={{ height: topSpacerHeight, border: 'none', padding: 0 }} />
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
                        'border-b border-[var(--border-sub)] transition-colors',
                        onRowClick && 'cursor-pointer',
                        !selectedKeys.has(rowKeyStr) && 'hover:bg-[var(--bg-card-hover)]',
                        selectedKeys.has(rowKeyStr) && 'bg-[var(--accent)]/10',
                        navigable && focusedIndex === realIdx && 'outline outline-1 outline-[var(--accent)] outline-offset-[-1px]',
                      )}
                      onClick={(e) => {
                        handleRowSelect(row, realIdx, e);
                        onRowClick?.(row);
                      }}
                      onMouseEnter={() => { if (navigable) setFocusedIndex(realIdx); }}
                    >
                      {showCheckbox && (
                        <td
                          className="p-2 px-3 text-center select-none"
                          style={{ width: 40, minWidth: 40, maxWidth: 40 }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            className="cursor-pointer accent-[var(--accent)]"
                            checked={selectedKeys.has(rowKeyStr)}
                            onChange={() => toggleSelection(rowKeyStr, true)}
                          />
                        </td>
                      )}
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
                        const condStyle = getConditionalStyle(col, cellValue);
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
                              ...condStyle,
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
                          colSpan={totalColSpan}
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
                  <td colSpan={totalColSpan} style={{ height: bottomSpacerHeight, border: 'none', padding: 0 }} />
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
