import React, { useState, useCallback, useRef } from 'react';
import { cn } from '../lib/utils';
import { FORMAT_PRESETS, type FormatPresetKey, type ColumnFormat } from './column-formats';
import type { ColumnDef } from './configurable-grid';

// ─── Preset 定义 ───────────────────────────────────────────

export interface ColumnPreset {
  name: string;
  label: string;
  columns: Partial<ColumnDef<unknown>>[];
}

export const COLUMN_PRESETS: ColumnPreset[] = [
  {
    name: 'common',
    label: '常用',
    columns: [
      { key: 'code', label: '代码', width: 90, sortable: true, fixed: 'left' },
      { key: 'name', label: '名称', width: 120, sortable: true, fixed: 'left' },
      { key: 'price', label: '最新价', width: 100, format: 'price', sortable: true },
      { key: 'change', label: '涨跌额', width: 90, format: 'price', sortable: true },
      { key: 'changePercent', label: '涨跌幅', width: 90, format: 'changePercent', sortable: true },
      { key: 'volume', label: '成交量', width: 100, format: 'volume' },
    ],
  },
  {
    name: 'full',
    label: '完整',
    columns: [
      { key: 'code', label: '代码', width: 90, fixed: 'left' },
      { key: 'name', label: '名称', width: 120, fixed: 'left' },
      { key: 'price', label: '最新价', width: 100, format: 'price', sortable: true },
      { key: 'change', label: '涨跌额', width: 90, format: 'price', sortable: true },
      { key: 'changePercent', label: '涨跌幅', width: 90, format: 'changePercent', sortable: true },
      { key: 'volume', label: '成交量', width: 100, format: 'volume' },
      { key: 'turnover', label: '成交额', width: 100, format: 'volume' },
      { key: 'high', label: '最高', width: 90, format: 'price' },
      { key: 'low', label: '最低', width: 90, format: 'price' },
      { key: 'open', label: '开盘', width: 90, format: 'price' },
      { key: 'amplitude', label: '振幅', width: 80, format: 'percent' },
      { key: 'turnoverRate', label: '换手率', width: 80, format: 'percent' },
      { key: 'pe', label: 'PE', width: 80, format: 'number' },
      { key: 'marketCap', label: '总市值', width: 100, format: 'volume' },
    ],
  },
  {
    name: 'compact',
    label: '简洁',
    columns: [
      { key: 'name', label: '名称', width: 100 },
      { key: 'price', label: '最新', width: 90, format: 'price' },
      { key: 'changePercent', label: '涨跌幅', width: 80, format: 'changePercent' },
    ],
  },
];

// ─── ColumnPicker Props ─────────────────────────────────────

export interface ColumnPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  columns: ColumnDef<unknown>[];
  onChange: (columns: ColumnDef<unknown>[]) => void;
  defaultColumns?: ColumnDef<unknown>[];
  presets?: ColumnPreset[];
}

// ─── ColumnEditRow（行内编辑） ─────────────────────────────

interface EditColumn {
  key: string;
  label: string;
  width: number;
  align: 'left' | 'right' | 'center';
  fixed: 'left' | 'right' | false;
  format: string;
  visible: boolean;
}

function toEditColumn(col: { key?: string } & Partial<ColumnDef<unknown>>): EditColumn {
  return {
    key: col.key ?? `col_${Date.now()}`,
    label: col.label ?? col.key ?? '未命名列',
    width: col.width ?? 120,
    align: col.align ?? 'left',
    fixed: col.fixed ?? false,
    format: col.format ?? '',
    visible: col.visible !== false,
  };
}

function toColumnDef(edit: EditColumn): ColumnDef<unknown> {
  return {
    key: edit.key,
    label: edit.label,
    width: edit.width,
    align: edit.align,
    fixed: edit.fixed,
    format: edit.format || undefined,
    visible: edit.visible,
    sortable: true,
  };
}

// ─── DnD Helpers ───────────────────────────────────────────

function useDragReorder(
  items: EditColumn[],
  setItems: (items: EditColumn[]) => void,
) {
  const dragIndexRef = useRef<number | null>(null);

  const onDragStart = useCallback((index: number) => {
    dragIndexRef.current = index;
  }, []);

  const onDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      if (dragIndexRef.current === null || dragIndexRef.current === index) return;
      const dragIdx = dragIndexRef.current;
      const newItems = [...items];
      const [removed] = newItems.splice(dragIdx, 1);
      newItems.splice(index, 0, removed);
      setItems(newItems);
      dragIndexRef.current = index;
    },
    [items, setItems],
  );

  const onDragEnd = useCallback(() => {
    dragIndexRef.current = null;
  }, []);

  return { onDragStart, onDragOver, onDragEnd };
}

// ─── 导出 JSON ──────────────────────────────────────────────

function exportConfigJSON(columns: EditColumn[]) {
  const config = columns.map((c) => ({
    key: c.key,
    label: c.label,
    width: c.width,
    visible: c.visible,
    fixed: c.fixed || undefined,
    align: c.align,
    format: c.format || undefined,
  }));
  const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'column-config.json';
  a.click();
  URL.revokeObjectURL(url);
}

// ─── ColumnPicker Component ─────────────────────────────────

export function ColumnPicker({
  open,
  onOpenChange,
  columns: initialColumns,
  onChange,
  defaultColumns,
  presets = COLUMN_PRESETS,
}: ColumnPickerProps) {
  const [editColumns, setEditColumns] = useState<EditColumn[]>(() =>
    initialColumns.map(toEditColumn),
  );
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string>('');

  const { onDragStart, onDragOver, onDragEnd } = useDragReorder(editColumns, setEditColumns);

  // Sync state when initialColumns change
  React.useEffect(() => {
    setEditColumns(initialColumns.map(toEditColumn));
  }, [initialColumns]);

  const handleToggleVisible = useCallback((key: string) => {
    setEditColumns((prev) =>
      prev.map((c) => (c.key === key ? { ...c, visible: !c.visible } : c)),
    );
  }, []);

  const handleEditField = useCallback(
    (key: string, field: keyof EditColumn, value: string | number | boolean) => {
      setEditColumns((prev) =>
        prev.map((c) => (c.key === key ? { ...c, [field]: value } : c)),
      );
    },
    [],
  );

  const handleAddColumn = useCallback(() => {
    const newKey = `custom_${Date.now()}`;
    setEditColumns((prev) => [
      ...prev,
      { key: newKey, label: '新列', width: 100, align: 'left', fixed: false, format: '', visible: true },
    ]);
    setExpandedKey(newKey);
  }, []);

  const handleRemoveColumn = useCallback((key: string) => {
    setEditColumns((prev) => prev.filter((c) => c.key !== key));
  }, []);

  const handleApplyPreset = useCallback((presetName: string) => {
    setSelectedPreset(presetName);
    const preset = presets.find((p) => p.name === presetName);
    if (preset) {
      setEditColumns(preset.columns.map(toEditColumn));
    }
  }, [presets]);

  const handleReset = useCallback(() => {
    const base = defaultColumns ?? initialColumns;
    setEditColumns(base.map(toEditColumn));
    setSelectedPreset('');
  }, [defaultColumns, initialColumns]);

  const handleConfirm = useCallback(() => {
    onChange(editColumns.map(toColumnDef));
    onOpenChange(false);
  }, [editColumns, onChange, onOpenChange]);

  const handleCancel = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  if (!open) return null;

  const formatOptions = Object.keys(FORMAT_PRESETS);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={handleCancel} />

      {/* Panel */}
      <div className="relative z-10 w-[520px] max-h-[70vh] overflow-hidden rounded-[var(--card-radius)] border border-[var(--border-main)] bg-[var(--bg-card)] shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-sub)]">
          <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">列编辑器</h3>
          <div className="flex items-center gap-2">
            {/* Preset selector */}
            <select
              value={selectedPreset}
              onChange={(e) => handleApplyPreset(e.target.value)}
              className="h-7 rounded-[var(--btn-radius)] border border-[var(--border-input)] bg-[var(--bg-input)] px-2 text-[11px] text-[var(--text-primary)] outline-none"
            >
              <option value="">预设方案</option>
              {presets.map((p) => (
                <option key={p.name} value={p.name}>{p.label}</option>
              ))}
            </select>
            <button
              onClick={handleReset}
              className="h-7 rounded-[var(--btn-radius)] border border-[var(--border-input)] px-3 text-[11px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              重置
            </button>
          </div>
        </div>

        {/* Column list */}
        <div className="overflow-y-auto px-3 py-2" style={{ maxHeight: 'calc(70vh - 130px)' }}>
          {editColumns.map((col, index) => {
            const formatLabel = col.format
              ? (FORMAT_PRESETS[col.format as FormatPresetKey] as ColumnFormat | undefined)
              : undefined;

            return (
              <div
                key={col.key}
                draggable
                onDragStart={() => onDragStart(index)}
                onDragOver={(e) => onDragOver(e, index)}
                onDragEnd={onDragEnd}
                className={cn(
                  'group flex flex-col rounded-[var(--radius-sm)] border border-transparent hover:border-[var(--border-sub)] transition-colors',
                )}
              >
                {/* Row header */}
                <div className="flex items-center gap-2 px-2 py-1.5">
                  {/* Drag handle */}
                  <span
                    className="cursor-grab active:cursor-grabbing text-[var(--text-tertiary)] hover:text-[var(--text-primary)] select-none"
                    draggable
                  >
                    ⠿
                  </span>

                  {/* Visible toggle */}
                  <input
                    type="checkbox"
                    checked={col.visible}
                    onChange={() => handleToggleVisible(col.key)}
                    className="h-3.5 w-3.5 accent-[var(--accent)]"
                  />

                  {/* Column name */}
                  <span
                    className={cn(
                      'flex-1 text-[12px] cursor-pointer',
                      col.visible ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)] line-through',
                    )}
                    onClick={() => setExpandedKey(expandedKey === col.key ? null : col.key)}
                  >
                    {col.label}
                  </span>

                  {/* Format badge */}
                  {col.format && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-[var(--radius-sm)] bg-[var(--bg-card-hover)] text-[var(--text-tertiary)] font-mono">
                      {col.format}
                    </span>
                  )}

                  {/* Settings toggle */}
                  <button
                    onClick={() => setExpandedKey(expandedKey === col.key ? null : col.key)}
                    className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] text-[12px] opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ⚙
                  </button>
                </div>

                {/* Expanded settings */}
                {expandedKey === col.key && (
                  <div className="px-6 pb-2 pt-1 grid grid-cols-3 gap-2 text-[11px]">
                    <label className="flex flex-col gap-0.5">
                      <span className="text-[var(--text-tertiary)]">标签</span>
                      <input
                        type="text"
                        value={col.label}
                        onChange={(e) => handleEditField(col.key, 'label', e.target.value)}
                        className="h-6 rounded-[var(--btn-radius)] border border-[var(--border-input)] bg-[var(--bg-input)] px-2 text-[var(--text-primary)] outline-none"
                      />
                    </label>
                    <label className="flex flex-col gap-0.5">
                      <span className="text-[var(--text-tertiary)]">宽度</span>
                      <input
                        type="number"
                        value={col.width}
                        min={30}
                        max={9999}
                        onChange={(e) => handleEditField(col.key, 'width', Number(e.target.value))}
                        className="h-6 rounded-[var(--btn-radius)] border border-[var(--border-input)] bg-[var(--bg-input)] px-2 text-[var(--text-primary)] outline-none"
                      />
                    </label>
                    <label className="flex flex-col gap-0.5">
                      <span className="text-[var(--text-tertiary)]">对齐</span>
                      <select
                        value={col.align}
                        onChange={(e) => handleEditField(col.key, 'align', e.target.value)}
                        className="h-6 rounded-[var(--btn-radius)] border border-[var(--border-input)] bg-[var(--bg-input)] px-2 text-[var(--text-primary)] outline-none"
                      >
                        <option value="left">左</option>
                        <option value="right">右</option>
                        <option value="center">中</option>
                      </select>
                    </label>
                    <label className="flex flex-col gap-0.5">
                      <span className="text-[var(--text-tertiary)]">固定</span>
                      <select
                        value={col.fixed ? col.fixed : 'false'}
                        onChange={(e) =>
                          handleEditField(
                            col.key,
                            'fixed',
                            e.target.value === 'false' ? false : e.target.value,
                          )
                        }
                        className="h-6 rounded-[var(--btn-radius)] border border-[var(--border-input)] bg-[var(--bg-input)] px-2 text-[var(--text-primary)] outline-none"
                      >
                        <option value="false">无</option>
                        <option value="left">左侧</option>
                        <option value="right">右侧</option>
                      </select>
                    </label>
                    <label className="flex flex-col gap-0.5">
                      <span className="text-[var(--text-tertiary)]">格式</span>
                      <select
                        value={col.format}
                        onChange={(e) => handleEditField(col.key, 'format', e.target.value)}
                        className="h-6 rounded-[var(--btn-radius)] border border-[var(--border-input)] bg-[var(--bg-input)] px-2 text-[var(--text-primary)] outline-none"
                      >
                        <option value="">无</option>
                        {formatOptions.map((f) => (
                          <option key={f} value={f}>{f}</option>
                        ))}
                      </select>
                    </label>
                    <div className="flex items-end">
                      <button
                        onClick={() => handleRemoveColumn(col.key)}
                        className="h-6 rounded-[var(--btn-radius)] border border-[var(--error)] px-2 text-[11px] text-[var(--error)] hover:bg-[var(--error)] hover:text-white transition-colors"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--border-sub)]">
          <button
            onClick={handleAddColumn}
            className="h-7 rounded-[var(--btn-radius)] border border-[var(--border-input)] px-3 text-[11px] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-colors"
          >
            + 添加自定义列
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => exportConfigJSON(editColumns)}
              className="h-7 rounded-[var(--btn-radius)] border border-[var(--border-input)] px-3 text-[11px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              导出 JSON
            </button>
            <button
              onClick={handleCancel}
              className="h-7 rounded-[var(--btn-radius)] border border-[var(--border-input)] px-4 text-[11px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleConfirm}
              className="h-7 rounded-[var(--btn-radius)] bg-[var(--accent)] px-4 text-[11px] text-white hover:opacity-90 transition-opacity"
            >
              确定
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
