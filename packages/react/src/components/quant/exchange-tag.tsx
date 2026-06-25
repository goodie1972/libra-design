import { cn } from '../../lib/utils';

export interface ExchangeTagProps {
  exchange: 'binance' | 'okx' | 'bitget' | 'bybit';
  className?: string;
}

const exchangeConfig = {
  binance: {
    label: 'Binance',
    bg: 'rgba(240, 185, 11, 0.1)',
    text: '#f0b90b',
  },
  okx: {
    label: 'OKX',
    bg: 'rgba(131, 106, 238, 0.1)',
    text: '#836aee',
  },
  bitget: {
    label: 'Bitget',
    bg: 'rgba(0, 212, 255, 0.1)',
    text: '#00d4ff',
  },
  bybit: {
    label: 'Bybit',
    bg: 'rgba(255, 165, 0, 0.1)',
    text: '#ffa500',
  },
};

export function ExchangeTag({ exchange, className }: ExchangeTagProps) {
  const config = exchangeConfig[exchange];

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
