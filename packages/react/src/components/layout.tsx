import { cn } from '../lib/utils';

export interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface LayoutHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface LayoutSiderProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface LayoutContentProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface LayoutFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Layout({ className, ...props }: LayoutProps) {
  return (
    <div
      className={cn('flex min-h-screen', className)}
      {...props}
    />
  );
}

export function LayoutHeader({ className, ...props }: LayoutHeaderProps) {
  return (
    <header
      className={cn(
        'fixed top-0 w-full z-50 bg-[var(--bg-root)]/80 backdrop-blur',
        className,
      )}
      {...props}
    />
  );
}

export function LayoutSider({ className, ...props }: LayoutSiderProps) {
  return (
    <aside
      className={cn('w-60 bg-[var(--bg-sidebar)]', className)}
      {...props}
    />
  );
}

export function LayoutContent({ className, ...props }: LayoutContentProps) {
  return (
    <main
      className={cn('flex-1 pt-16', className)}
      {...props}
    />
  );
}

export function LayoutFooter({ className, ...props }: LayoutFooterProps) {
  return (
    <footer
      className={cn('bg-[var(--bg-card)] text-center py-6', className)}
      {...props}
    />
  );
}
