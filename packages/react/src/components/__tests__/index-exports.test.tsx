import { describe, it, expect } from 'bun:test';
import { ConfigurableGrid, ColumnPicker, FORMAT_PRESETS, getFormatPreset, COLUMN_PRESETS } from '../../index';
import type { ColumnDef, ConfigurableGridProps, ColumnPickerProps, ColumnPreset, ColumnFormat, FormatPresetKey } from '../../index';

describe('Phase 1 exports', () => {
  it('exports ConfigurableGrid as function', () => {
    expect(ConfigurableGrid).toBeDefined();
    expect(typeof ConfigurableGrid).toBe('function');
  });

  it('exports ColumnPicker as function', () => {
    expect(ColumnPicker).toBeDefined();
    expect(typeof ColumnPicker).toBe('function');
  });

  it('exports FORMAT_PRESETS with expected keys', () => {
    expect(FORMAT_PRESETS).toBeDefined();
    expect(FORMAT_PRESETS.number).toBeDefined();
    expect(FORMAT_PRESETS.percent).toBeDefined();
    expect(FORMAT_PRESETS.price).toBeDefined();
    expect(FORMAT_PRESETS.volume).toBeDefined();
    expect(FORMAT_PRESETS.text).toBeDefined();
    expect(FORMAT_PRESETS.date).toBeDefined();
  });

  it('exports COLUMN_PRESETS as array with expected entries', () => {
    expect(COLUMN_PRESETS).toBeDefined();
    expect(Array.isArray(COLUMN_PRESETS)).toBe(true);
    const names = COLUMN_PRESETS.map(p => p.name);
    expect(names).toContain('common');
    expect(names).toContain('full');
    expect(names).toContain('compact');
  });

  it('exports getFormatPreset function', () => {
    expect(getFormatPreset).toBeDefined();
    expect(typeof getFormatPreset).toBe('function');
  });
});
