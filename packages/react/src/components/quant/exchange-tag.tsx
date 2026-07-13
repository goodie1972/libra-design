import { cn } from '../../lib/utils';

export interface ExchangeTagProps {
  exchange: 'binance' | 'okx' | 'bitget' | 'bybit';
  className?: string;
}

const exchangeConfig: Record<string, { label: string; bg: string; text: string }> = {
  binance: { label: 'Binance', bg: 'var(--exchange-binance-bg)', text: 'var(--exchange-binance)' },
  okx:     { label: 'OKX',     bg: 'var(--exchange-okx-bg)',     text: 'var(--exchange-okx)' },
  bitget:  { label: 'Bitget',  bg: 'var(--exchange-bitget-bg)',  text: 'var(--exchange-bitget)' },
  bybit:   { label: 'Bybit',   bg: 'var(--exchange-bybit-bg)',   text: 'var(--exchange-bybit)' },
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
