import { cn } from '../lib/utils';

export interface BreadcrumbItem {
  label: React.ReactNode;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
}

export function Breadcrumb({ items, separator = '/', className }: BreadcrumbProps) {
  return (
    <nav className={cn('flex items-center gap-1.5 text-[12px] text-[var(--text-tertiary)]', className)} aria-label="Breadcrumb">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-[var(--text-tertiary)] select-none">{separator}</span>}
          {item.href ? (
            <a href={item.href} className="hover:text-[var(--accent)] transition-colors">
              {item.label}
            </a>
          ) : (
            <span className={cn(i === items.length - 1 ? 'text-[var(--text-primary)]' : '')}>
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
