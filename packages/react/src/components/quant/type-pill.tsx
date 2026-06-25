import { cn } from '../../lib/utils';

export interface TypePillProps {
  type: 'signal' | 'script' | 'bot';
  className?: string;
}

const typeConfig = {
  signal: {
    label: 'signal',
    bg: 'rgba(74, 108, 247, 0.08)',
    text: '#4a6cf7',
  },
  script: {
    label: 'script',
    bg: 'rgba(124, 58, 237, 0.1)',
    text: '#7c3aed',
  },
  bot: {
    label: 'bot',
    bg: 'rgba(6, 182, 212, 0.12)',
    text: '#06b6d4',
  },
};

export function TypePill({ type, className }: TypePillProps) {
  const config = typeConfig[type];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-[4px] px-2 py-[2px] text-[10px] font-medium leading-[1.3]',
        className,
      )}
      style={{
        backgroundColor: config.bg,
        color: config.text,
      }}
    >
      {config.label}
    </span>
  );
}
