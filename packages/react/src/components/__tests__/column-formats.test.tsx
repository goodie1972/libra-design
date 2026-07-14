import { describe, it, expect } from 'bun:test';
import { FORMAT_PRESETS, getFormatPreset } from '../column-formats';

describe('ColumnFormats', () => {
  describe('number', () => {
    const fmt = FORMAT_PRESETS.number.format!;

    it('formats with thousand separator and 2 decimals', () => {
      expect(fmt(1234.56)).toBe('1,234.56');
    });

    it('formats zero', () => {
      expect(fmt(0)).toBe('0.00');
    });

    it('formats negative numbers', () => {
      expect(fmt(-999.5)).toBe('-999.50');
    });

    it('returns "-" for NaN', () => {
      expect(fmt(NaN)).toBe('-');
    });
  });

  describe('percent', () => {
    const fmt = FORMAT_PRESETS.percent.format!;

    it('formats positive with + prefix and % suffix', () => {
      expect(fmt(3.25)).toBe('+3.25%');
    });

    it('formats negative with - prefix and % suffix', () => {
      expect(fmt(-1.5)).toBe('-1.50%');
    });

    it('formats zero', () => {
      expect(fmt(0)).toBe('+0.00%');
    });

    it('returns "-%" for NaN', () => {
      expect(fmt(NaN)).toBe('-%');
    });
  });

  describe('volume', () => {
    const fmt = FORMAT_PRESETS.volume.format!;

    it('formats >= 1e8 as 亿', () => {
      expect(fmt(123456789)).toBe('1.23亿');
    });

    it('formats >= 1e4 as 万', () => {
      expect(fmt(56789)).toBe('5.68万');
    });

    it('keeps small numbers as-is', () => {
      expect(fmt(123)).toBe('123');
    });

    it('handles zero', () => {
      expect(fmt(0)).toBe('0');
    });

    it('returns "-" for NaN', () => {
      expect(fmt(NaN)).toBe('-');
    });
  });

  describe('text', () => {
    const fmt = FORMAT_PRESETS.text.format!;

    it('converts numbers to string', () => {
      expect(fmt(42)).toBe('42');
    });

    it('returns "-" for null', () => {
      expect(fmt(null)).toBe('-');
    });

    it('returns "-" for undefined', () => {
      expect(fmt(undefined)).toBe('-');
    });

    it('preserves string values', () => {
      expect(fmt('hello')).toBe('hello');
    });
  });

  describe('date', () => {
    const fmt = FORMAT_PRESETS.date.format!;

    it('formats Date object', () => {
      const d = new Date('2024-03-15T12:00:00Z');
      expect(fmt(d)).toBe('2024-03-15');
    });

    it('formats ISO string', () => {
      expect(fmt('2024-03-15T12:00:00Z')).toBe('2024-03-15');
    });

    it('truncates already-formatted date string', () => {
      expect(fmt('2024-03-15')).toBe('2024-03-15');
    });

    it('returns "-" for empty input', () => {
      expect(fmt(null)).toBe('-');
      expect(fmt(undefined)).toBe('-');
    });
  });

  describe('getFormatPreset', () => {
    it('returns preset for valid key', () => {
      const preset = getFormatPreset('number');
      expect(preset).toBeDefined();
      expect(preset!.align).toBe('right');
    });

    it('returns undefined for invalid key', () => {
      expect(getFormatPreset('nonexistent')).toBeUndefined();
    });
  });
});
