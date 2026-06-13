import { cn } from '../lib/utils';

export interface PaginationProps {
  current: number;
  total: number;
  pageSize?: number;
  onChange: (page: number) => void;
  className?: string;
}

export function Pagination({ current, total, pageSize = 20, onChange, className }: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  const pages: (number | 'ellipsis')[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= current - 1 && i <= current + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== 'ellipsis') {
      pages.push('ellipsis');
    }
  }

  const btn = (page: number, label?: React.ReactNode) => (
    <button
      key={page}
      onClick={() => onChange(page)}
      disabled={page === current}
      className={cn(
        'min-w-[30px] h-[30px] rounded-[6px] text-[12px] font-medium transition-all duration-150',
        page === current
          ? 'bg-[var(--accent)] text-white cursor-default'
          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]',
      )}
    >
      {label ?? page}
    </button>
  );

  return (
    <nav className={cn('flex items-center gap-1', className)} aria-label="Pagination">
      <button
        onClick={() => onChange(current - 1)}
        disabled={current <= 1}
        className="min-w-[30px] h-[30px] rounded-[6px] text-[12px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Previous"
      >
        &lsaquo;
      </button>
      {pages.map((p, i) =>
        p === 'ellipsis' ? (
          <span key={`e${i}`} className="px-1 text-[var(--text-tertiary)] select-none">&hellip;</span>
        ) : (
          btn(p)
        ),
      )}
      <button
        onClick={() => onChange(current + 1)}
        disabled={current >= totalPages}
        className="min-w-[30px] h-[30px] rounded-[6px] text-[12px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Next"
      >
        &rsaquo;
      </button>
    </nav>
  );
}
