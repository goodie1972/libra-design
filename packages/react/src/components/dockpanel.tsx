import { useState } from 'react';
import { cn } from '../lib/utils';

export interface DockPanelItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface DockPanelProps {
  panels: DockPanelItem[];
  defaultActive?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function DockPanel({
  panels,
  defaultActive,
  className,
}: DockPanelProps) {
  const [activeId, setActiveId] = useState(defaultActive ?? panels[0]?.id ?? '');

  const activePanel = panels.find((p) => p.id === activeId);

  return (
    <div
      className={cn(
        'flex rounded-[var(--card-radius)] border border-[var(--border-main)] bg-[var(--bg-card)] overflow-hidden',
        className,
      )}
    >
      {/* Left tab list */}
      <div className="w-[160px] shrink-0 border-r border-[var(--border-sub)] bg-[var(--bg-input)] py-2">
        {panels.map((panel) => (
          <button
            key={panel.id}
            onClick={() => setActiveId(panel.id)}
            className={cn(
              'w-full text-left px-4 py-2.5 text-[var(--text-sm)] transition-colors',
              'hover:bg-[var(--bg-card-hover)]',
              activeId === panel.id &&
                'text-[var(--accent)] bg-[var(--bg-card)] font-medium border-r-2 border-[var(--accent)]',
              activeId !== panel.id && 'text-[var(--text-secondary)]',
            )}
          >
            {panel.title}
          </button>
        ))}
      </div>

      {/* Right content area */}
      <div className="flex-1 p-4 overflow-auto">
        {activePanel ? (
          activePanel.content
        ) : (
          <div className="text-[var(--text-tertiary)] text-[var(--text-sm)]">
            Select a panel
          </div>
        )}
      </div>
    </div>
  );
}
