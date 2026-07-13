import { cn } from '../../lib/utils';

export interface OrderStatusTagProps {
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  className?: string;
}

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  pending:    { label: '待处理', bg: 'var(--status-pending-bg)',    text: 'var(--warning)' },
  processing: { label: '处理中', bg: 'var(--status-processing-bg)', text: 'var(--accent)' },
  completed:  { label: '已完成', bg: 'var(--status-completed-bg)',  text: 'var(--success)' },
  failed:     { label: '失败',   bg: 'var(--status-failed-bg)',     text: 'var(--error)' },
  cancelled:  { label: '已取消', bg: 'var(--status-cancelled-bg)',  text: 'var(--flat)' },
};

export function OrderStatusTag({ status, className }: OrderStatusTagProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-[4px] px-2 py-[2px] text-[11px] font-medium leading-[1.3]',
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
