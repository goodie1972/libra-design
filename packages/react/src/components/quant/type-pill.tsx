import { cn } from '../../lib/utils';

export interface TypePillProps {
  type: 'signal' | 'script' | 'bot';
  className?: string;
}

const typeConfig: Record<string, { label: string; bg: string; text: string }> = {
  signal: { label: 'signal', bg: 'var(--type-signal-bg)', text: 'var(--type-signal)' },
  script: { label: 'script', bg: 'var(--type-script-bg)', text: 'var(--type-script)' },
  bot:    { label: 'bot',    bg: 'var(--type-bot-bg)',    text: 'var(--type-bot)' },
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
