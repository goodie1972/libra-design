import { cn } from '../lib/utils';

export interface CommandItem {
  key: string;
  label: string;
  shortcut?: string;
}

export interface CommandProps {
  items: CommandItem[];
  className?: string;
  style?: React.CSSProperties;
}

export function Command({ items, className }: CommandProps) {
  return (
    <div
      className={cn(
        'rounded-[var(--card-radius)] border border-[var(--border-main)] bg-[var(--bg-card)] overflow-hidden',
        className,
      )}
    >
      {/* Search-like header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border-sub)]">
        <span className="text-[var(--text-tertiary)] text-[var(--text-base)]">&#8981;</span>
        <span className="text-[var(--text-tertiary)] text-[var(--text-sm)]">Type a command or search...</span>
      </div>

      {/* Items */}
      <div className="py-2">
        {items.map((item) => (
          <div
            key={item.key}
            className={cn(
              'flex items-center justify-between px-4 py-2.5 transition-colors',
              'hover:bg-[var(--bg-card-hover)] cursor-pointer',
            )}
          >
            <div className="flex items-center gap-3">
              <kbd className="inline-flex items-center justify-center w-6 h-6 rounded bg-[var(--bg-input)] text-[10px] font-medium text-[var(--text-tertiary)] uppercase border border-[var(--border-sub)]">
                {item.key}
              </kbd>
              <span className="text-[var(--text-sm)] text-[var(--text-primary)]">
                {item.label}
              </span>
            </div>
            {item.shortcut && (
              <span className="text-[11px] text-[var(--text-tertiary)] font-[var(--font-mono)]">
                {item.shortcut}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Footer hint */}
      <div className="px-4 py-2.5 border-t border-[var(--border-sub)] text-[10px] text-[var(--text-tertiary)] tracking-[0.03em]">
        <span className="font-[var(--font-mono)]">&#8593;&#8595;</span> Navigate &middot; <span className="font-[var(--font-mono)]">&#8999;</span> Open
      </div>
    </div>
  );
}
