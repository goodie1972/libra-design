import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Layout, LayoutHeader, LayoutSider, LayoutContent, LayoutFooter } from '../layout';

describe('Layout', () => {
  it('renders as a div with flex layout', () => {
    const { container } = render(<Layout>Test</Layout>);
    const el = container.firstChild as HTMLElement;
    expect(el.nodeName).toBe('DIV');
    expect(el.className).toContain('flex');
  });

  it('renders children', () => {
    render(<Layout>Layout content</Layout>);
    expect(screen.getByText('Layout content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Layout className="my-layout">Test</Layout>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('my-layout');
  });
});

describe('LayoutHeader', () => {
  it('renders as a header element', () => {
    const { container } = render(<LayoutHeader>Header</LayoutHeader>);
    expect(container.firstChild?.nodeName).toBe('HEADER');
  });

  it('has fixed positioning classes', () => {
    const { container } = render(<LayoutHeader>Header</LayoutHeader>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('fixed');
    expect(el.className).toContain('z-50');
  });
});

describe('LayoutSider', () => {
  it('renders as an aside element', () => {
    const { container } = render(<LayoutSider>Sidebar</LayoutSider>);
    expect(container.firstChild?.nodeName).toBe('ASIDE');
  });

  it('has sidebar width', () => {
    const { container } = render(<LayoutSider>Sidebar</LayoutSider>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('w-60');
  });
});

describe('LayoutContent', () => {
  it('renders as a main element', () => {
    const { container } = render(<LayoutContent>Content</LayoutContent>);
    expect(container.firstChild?.nodeName).toBe('MAIN');
  });

  it('has flex-1 class', () => {
    const { container } = render(<LayoutContent>Content</LayoutContent>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('flex-1');
  });
});

describe('LayoutFooter', () => {
  it('renders as a footer element', () => {
    const { container } = render(<LayoutFooter>Footer</LayoutFooter>);
    expect(container.firstChild?.nodeName).toBe('FOOTER');
  });

  it('has padding', () => {
    const { container } = render(<LayoutFooter>Footer</LayoutFooter>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('py-6');
  });
});
