import { useState, useMemo } from 'react';
import { cn } from '../lib/utils';

export interface OrderData {
  type: 'buy' | 'sell';
  symbol: string;
  price: number;
  quantity: number;
  orderType: 'limit' | 'market';
}

export interface OrderFormProps {
  type: 'buy' | 'sell';
  symbol: string;
  price?: number;
  onSubmit: (order: OrderData) => void;
  className?: string;
}

export function OrderForm({ type, symbol, price, onSubmit, className }: OrderFormProps) {
  const [orderType, setOrderType] = useState<'limit' | 'market'>('limit');
  const [inputPrice, setInputPrice] = useState<string>(price?.toString() ?? '');
  const [quantity, setQuantity] = useState<string>('');

  const isBuy = type === 'buy';
  const accentColor = isBuy ? 'var(--up)' : 'var(--down)';
  const totalAmount = useMemo(() => {
    const p = orderType === 'market' ? (price ?? 0) : parseFloat(inputPrice) || 0;
    const q = parseFloat(quantity) || 0;
    return p * q;
  }, [orderType, price, inputPrice, quantity]);

  const handleSubmit = () => {
    const p = orderType === 'market' ? (price ?? 0) : parseFloat(inputPrice) || 0;
    const q = parseFloat(quantity) || 0;
    if (q <= 0) return;
    if (orderType === 'limit' && p <= 0) return;

    onSubmit({
      type,
      symbol,
      price: p,
      quantity: q,
      orderType,
    });
  };

  return (
    <div className={cn('p-4 rounded-[var(--card-radius)] bg-[var(--bg-card)] border border-[var(--border-main)]', className)}>
      {/* 标题 */}
      <div
        className="text-[15px] font-semibold mb-3"
        style={{ color: accentColor }}
      >
        {isBuy ? '买入' : '卖出'} {symbol}
      </div>

      {/* 订单类型切换 */}
      <div className="flex mb-3 rounded-[var(--btn-radius)] bg-[var(--bg-sub-panel)] p-0.5">
        <button
          type="button"
          className={cn(
            'flex-1 h-8 rounded-[var(--btn-radius)] text-[13px] font-medium transition-all duration-200',
            orderType === 'limit'
              ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
          )}
          onClick={() => setOrderType('limit')}
        >
          限价单
        </button>
        <button
          type="button"
          className={cn(
            'flex-1 h-8 rounded-[var(--btn-radius)] text-[13px] font-medium transition-all duration-200',
            orderType === 'market'
              ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
          )}
          onClick={() => setOrderType('market')}
        >
          市价单
        </button>
      </div>

      {/* 价格输入框 */}
      <div className="mb-3">
        <label className="block text-[12px] text-[var(--text-secondary)] mb-1.5">
          价格
        </label>
        {orderType === 'market' ? (
          <div className="h-9 px-3 flex items-center rounded-[var(--btn-radius)] bg-[var(--bg-input)] border border-[var(--border-input)] text-[var(--text-secondary)] text-[13px]">
            市价
          </div>
        ) : (
          <input
            type="number"
            step="any"
            value={inputPrice}
            onChange={(e) => setInputPrice(e.target.value)}
            placeholder="输入价格"
            className="w-full h-9 px-3 rounded-[var(--btn-radius)] bg-[var(--bg-input)] border border-[var(--border-input)] text-[var(--text-primary)] text-[13px] font-[var(--font-mono)] tabular-nums outline-none transition-colors duration-200 focus:border-[var(--accent)] placeholder:text-[var(--text-tertiary)]"
          />
        )}
      </div>

      {/* 数量输入框 */}
      <div className="mb-3">
        <label className="block text-[12px] text-[var(--text-secondary)] mb-1.5">
          数量
        </label>
        <input
          type="number"
          step="any"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="输入数量"
          className="w-full h-9 px-3 rounded-[var(--btn-radius)] bg-[var(--bg-input)] border border-[var(--border-input)] text-[var(--text-primary)] text-[13px] font-[var(--font-mono)] tabular-nums outline-none transition-colors duration-200 focus:border-[var(--accent)] placeholder:text-[var(--text-tertiary)]"
        />
      </div>

      {/* 总金额 */}
      <div className="mb-4 p-3 rounded-[var(--btn-radius)] bg-[var(--bg-sub-panel)]">
        <div className="text-[12px] text-[var(--text-secondary)] mb-1">总金额</div>
        <div className="text-[16px] font-[var(--font-mono)] tabular-nums text-[var(--text-primary)] font-medium">
          {totalAmount.toFixed(2)}
        </div>
      </div>

      {/* 提交按钮 */}
      <button
        type="button"
        className="w-full h-10 rounded-[var(--btn-radius)] text-white text-[14px] font-medium transition-all duration-200 hover:opacity-90 active:opacity-80"
        style={{ backgroundColor: accentColor }}
        onClick={handleSubmit}
      >
        {isBuy ? '买入' : '卖出'} {symbol}
      </button>
    </div>
  );
}
