import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Form } from '../form';

describe('Form', () => {
  it('renders as a form element', () => {
    const { container } = render(<Form>Test</Form>);
    expect(container.firstChild?.nodeName).toBe('FORM');
  });

  it('renders children', () => {
    render(<Form>Form content</Form>);
    expect(screen.getByText('Form content')).toBeInTheDocument();
  });

  it('applies vertical layout by default', () => {
    const { container } = render(<Form>Test</Form>);
    const form = container.firstChild as HTMLElement;
    expect(form.className).toContain('flex-col');
  });

  it('applies horizontal layout when layout="horizontal"', () => {
    const { container } = render(<Form layout="horizontal">Test</Form>);
    const form = container.firstChild as HTMLElement;
    expect(form.className).toContain('flex-row');
  });

  it('applies custom className', () => {
    const { container } = render(<Form className="my-form">Test</Form>);
    const form = container.firstChild as HTMLElement;
    expect(form.className).toContain('my-form');
  });

  it('forwards action and method attributes', () => {
    const { container } = render(<Form action="/submit" method="get">Test</Form>);
    const form = container.firstChild as HTMLElement;
    expect(form).toHaveAttribute('action', '/submit');
    expect(form).toHaveAttribute('method', 'get');
  });
});
