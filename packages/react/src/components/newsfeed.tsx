import { cn } from '../lib/utils';

export interface NewsItem {
  title: string;
  source: string;
  time: string;
  url?: string;
}

export interface NewsFeedProps {
  items: NewsItem[];
  className?: string;
  style?: React.CSSProperties;
}

export function NewsFeed({ items, className }: NewsFeedProps) {
  return (
    <div
      className={cn(
        'rounded-[var(--card-radius)] border border-[var(--border-main)] bg-[var(--bg-card)] overflow-hidden divide-y divide-[var(--border-sub)]',
        className,
      )}
    >
      {items.length === 0 && (
        <div className="p-6 text-center text-[var(--text-tertiary)] text-[var(--text-sm)]">
          No news available
        </div>
      )}
      {items.map((item, idx) => (
        <div
          key={idx}
          className={cn(
            'p-4 transition-colors',
            'hover:bg-[var(--bg-card-hover)]',
            item.url && 'cursor-pointer',
          )}
          {...(item.url ? { onClick: () => window.open(item.url, '_blank', 'noopener noreferrer'), role: 'link', tabIndex: 0, onKeyDown: (e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') window.open(item.url!, '_blank', 'noopener noreferrer'); } } : {})}
        >
          {/* Title */}
          <div className="text-[var(--text-sm)] text-[var(--text-primary)] font-medium leading-snug mb-1.5 line-clamp-2">
            {item.title}
          </div>

          {/* Meta */}
          <div className="flex items-center gap-2 text-[11px] text-[var(--text-tertiary)]">
            <span className="font-medium text-[var(--text-secondary)]">
              {item.source}
            </span>
            <span className="text-[var(--border-sub)]">&middot;</span>
            <span>{item.time}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
