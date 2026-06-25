import { cn } from '../../lib/utils';

export interface OrderStatusTagProps {
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  className?: string;
}

const statusConfig = {
  pending: {
    label: '待处理',
    bg: 'rgba(251, 188, 4, 0.1)',
    text: '#fbbc04',
  },
  processing: {
    label: '处理中',
    bg: 'rgba(74, 108, 247, 0.1)',
    text: '#4a6cf7',
  },
  completed: {
    label: '已完成',
    bg: 'rgba(52, 168, 83, 0.1)',
    text: '#34a853',
  },
  failed: {
    label: '失败',
    bg: 'rgba(234, 67, 53, 0.1)',
    text: '#ea4335',
  },
  cancelled: {
    label: '已取消',
    bg: 'rgba(158, 158, 158, 0.1)',
    text: '#9e9e9e',
  },
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
