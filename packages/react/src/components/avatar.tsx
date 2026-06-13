import { cn } from '../lib/utils';

export interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = { sm: 'w-6 h-6 text-[10px]', md: 'w-8 h-8 text-[12px]', lg: 'w-10 h-10 text-[14px]' };

export function Avatar({ src, alt, fallback, size = 'md', className }: AvatarProps) {
  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-full bg-[var(--bg-card-hover)] text-[var(--text-secondary)] font-medium overflow-hidden shrink-0',
        sizeMap[size],
        className,
      )}
    >
      {src ? (
        <img src={src} alt={alt ?? ''} className="h-full w-full object-cover" />
      ) : (
        <span>{fallback ?? alt?.[0] ?? '?'}</span>
      )}
    </div>
  );
}
