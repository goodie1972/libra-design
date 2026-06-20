import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Label } from '../label';

describe('Label', () => {
  it('renders children text', () => {
    render(<Label>Username</Label>);
    expect(screen.getByText('Username')).toBeInTheDocument();
  });

  it('shows required asterisk when required=true', () => {
    render(<Label required>Email</Label>);
    const asterisk = document.querySelector('.ml-0\\.5');
    expect(asterisk).toBeInTheDocument();
    expect(asterisk?.textContent).toBe('*');
  });

  it('does not show asterisk when required=false', () => {
    const { container } = render(<Label required={false}>Name</Label>);
    const asterisk = container.querySelector('.ml-0\\.5');
    expect(asterisk).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Label className="my-label">Test</Label>);
    expect(container.firstChild).toHaveClass('my-label');
  });

  it('renders as a label element', () => {
    render(<Label>Test</Label>);
    expect(screen.getByText('Test').tagName).toBe('LABEL');
  });

  it('forwards htmlFor attribute', () => {
    render(<Label htmlFor="input-id">Field</Label>);
    expect(screen.getByText('Field')).toHaveAttribute('for', 'input-id');
  });
});
