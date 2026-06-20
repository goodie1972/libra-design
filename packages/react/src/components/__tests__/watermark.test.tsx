import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Watermark } from '../watermark';

describe('Watermark', () => {
  it('renders default text when no text provided', () => {
    const { container } = render(<Watermark />);
    const spans = container.querySelectorAll('span');
    expect(spans.length).toBeGreaterThan(0);
    expect(spans[0].textContent).toBe('数据仅供参考，投资有风险');
  });

  it('renders custom text', () => {
    const { container } = render(<Watermark text="CONFIDENTIAL" />);
    const spans = container.querySelectorAll('span');
    expect(spans[0].textContent).toBe('CONFIDENTIAL');
  });

  it('renders 9 grid cells (3x3)', () => {
    const { container } = render(<Watermark />);
    const cells = container.querySelectorAll('.grid > div');
    expect(cells.length).toBe(9);
  });

  it('applies custom opacity', () => {
    const { container } = render(<Watermark opacity={0.2} />);
    const spans = container.querySelectorAll('span');
    const textSpan = Array.from(spans).find((s) => s.textContent);
    expect(textSpan?.style.opacity).toBe('0.2');
  });

  it('applies custom color', () => {
    const { container } = render(<Watermark color="#ff0000" />);
    const spans = container.querySelectorAll('span');
    const textSpan = Array.from(spans).find((s) => s.textContent);
    // jsdom normalizes CSS color values to rgb() form.
    expect(textSpan?.style.color).toBe('rgb(255, 0, 0)');
  });

  it('applies rotate transform to cells', () => {
    const { container } = render(<Watermark rotate={-30} />);
    const cells = container.querySelectorAll('.grid > div');
    const transform = (cells[0] as HTMLElement).style.transform;
    expect(transform).toContain('-30deg');
  });

  it('is aria-hidden for accessibility', () => {
    const { container } = render(<Watermark />);
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveAttribute('aria-hidden', 'true');
  });

  it('is pointer-events-none', () => {
    const { container } = render(<Watermark />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain('pointer-events-none');
  });

  it('applies custom className', () => {
    const { container } = render(<Watermark className="my-watermark" />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain('my-watermark');
  });
});
