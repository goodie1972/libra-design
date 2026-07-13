import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KPICard } from '../kpi-card';
import { WinRateCard } from '../win-rate-card';
import { ProfitFactorCard } from '../profit-factor-card';
import { DrawdownCard } from '../drawdown-card';
import { StrategyRankingCard } from '../strategy-ranking-card';
import { TypePill } from '../type-pill';
import { ExchangeTag } from '../exchange-tag';
import { OrderStatusTag } from '../order-status-tag';

describe('TypePill', () => {
  it('renders signal type', () => {
    render(<TypePill type="signal" />);
    expect(screen.getByText('signal')).toBeInTheDocument();
  });
  it('renders script type', () => {
    render(<TypePill type="script" />);
    expect(screen.getByText('script')).toBeInTheDocument();
  });
  it('renders bot type', () => {
    render(<TypePill type="bot" />);
    expect(screen.getByText('bot')).toBeInTheDocument();
  });
  it('applies custom className', () => {
    const { container } = render(<TypePill type="signal" className="my-pill" />);
    expect(container.firstChild).toHaveClass('my-pill');
  });
});

describe('ExchangeTag', () => {
  it('renders binance', () => {
    render(<ExchangeTag exchange="binance" />);
    expect(screen.getByText('Binance')).toBeInTheDocument();
  });
  it('renders okx', () => {
    render(<ExchangeTag exchange="okx" />);
    expect(screen.getByText('OKX')).toBeInTheDocument();
  });
  it('renders bitget', () => {
    render(<ExchangeTag exchange="bitget" />);
    expect(screen.getByText('Bitget')).toBeInTheDocument();
  });
  it('renders bybit', () => {
    render(<ExchangeTag exchange="bybit" />);
    expect(screen.getByText('Bybit')).toBeInTheDocument();
  });
  it('applies custom className', () => {
    const { container } = render(<ExchangeTag exchange="binance" className="my-tag" />);
    expect(container.firstChild).toHaveClass('my-tag');
  });
});

describe('OrderStatusTag', () => {
  it('renders pending', () => {
    render(<OrderStatusTag status="pending" />);
    expect(screen.getByText('待处理')).toBeInTheDocument();
  });
  it('renders processing', () => {
    render(<OrderStatusTag status="processing" />);
    expect(screen.getByText('处理中')).toBeInTheDocument();
  });
  it('renders completed', () => {
    render(<OrderStatusTag status="completed" />);
    expect(screen.getByText('已完成')).toBeInTheDocument();
  });
  it('renders failed', () => {
    render(<OrderStatusTag status="failed" />);
    expect(screen.getByText('失败')).toBeInTheDocument();
  });
  it('renders cancelled', () => {
    render(<OrderStatusTag status="cancelled" />);
    expect(screen.getByText('已取消')).toBeInTheDocument();
  });
  it('applies custom className', () => {
    const { container } = render(<OrderStatusTag status="completed" className="my-tag" />);
    expect(container.firstChild).toHaveClass('my-tag');
  });
});

describe('KPICard', () => {
  it('renders label and value', () => {
    render(<KPICard label="总收益" value={1234} />);
    expect(screen.getByText('总收益')).toBeInTheDocument();
    expect(screen.getByText('1,234')).toBeInTheDocument();
  });
  it('renders string value', () => {
    render(<KPICard label="胜率" value="75.5%" />);
    expect(screen.getByText('75.5%')).toBeInTheDocument();
  });
  it('renders unit', () => {
    render(<KPICard label="收益" value={500} unit="USD" />);
    expect(screen.getByText('USD')).toBeInTheDocument();
  });
  it('renders icon', () => {
    render(<KPICard label="收益" value={100} icon="📈" />);
    expect(screen.getByText('📈')).toBeInTheDocument();
  });
  it('renders subValue and subLabel', () => {
    render(<KPICard label="收益" value={100} subValue="+5.2%" subLabel="较昨日" />);
    expect(screen.getByText('+5.2%')).toBeInTheDocument();
    expect(screen.getByText('较昨日')).toBeInTheDocument();
  });
  it('applies up trend color to subValue', () => {
    render(<KPICard label="收益" value={100} trend="up" subValue="+5.0%" subLabel="change" />);
    const el = screen.getByText('+5.0%');
    expect(el.className).toContain('text-[var(--up)]');
  });
  it('applies down trend color to subValue', () => {
    render(<KPICard label="收益" value={100} trend="down" subValue="-3.0%" subLabel="change" />);
    const el = screen.getByText('-3.0%');
    expect(el.className).toContain('text-[var(--down)]');
  });
  it('applies custom className', () => {
    const { container } = render(<KPICard label="收益" value={100} className="my-card" />);
    expect(container.firstChild).toHaveClass('my-card');
  });
});

describe('WinRateCard', () => {
  it('renders win rate percentage', () => {
    render(<WinRateCard winRate={65.5} winCount={131} lossCount={69} />);
    expect(screen.getByText('65.5%')).toBeInTheDocument();
  });
  it('renders win and loss counts', () => {
    render(<WinRateCard winRate={60} winCount={120} lossCount={80} />);
    expect(screen.getByText('120')).toBeInTheDocument();
    expect(screen.getByText('80')).toBeInTheDocument();
  });
  it('renders Chinese labels', () => {
    render(<WinRateCard winRate={50} winCount={1} lossCount={1} />);
    expect(screen.getByText('盈')).toBeInTheDocument();
    expect(screen.getByText('亏')).toBeInTheDocument();
  });
  it('renders SVG circle', () => {
    const { container } = render(<WinRateCard winRate={75} winCount={3} lossCount={1} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelectorAll('circle').length).toBe(2);
  });
  it('applies custom className', () => {
    const { container } = render(<WinRateCard winRate={50} winCount={1} lossCount={1} className="my-card" />);
    expect(container.firstChild).toHaveClass('my-card');
  });
});

describe('ProfitFactorCard', () => {
  it('renders profit factor', () => {
    render(<ProfitFactorCard profitFactor={2.5} grossProfit={50000} grossLoss={20000} />);
    expect(screen.getByText('2.50')).toBeInTheDocument();
  });
  it('renders gross profit and loss', () => {
    render(<ProfitFactorCard profitFactor={1.8} grossProfit={90000} grossLoss={50000} />);
    expect(screen.getByText('+$90,000')).toBeInTheDocument();
    expect(screen.getByText('-$50,000')).toBeInTheDocument();
  });
  it('shows good label for high profit factor', () => {
    render(<ProfitFactorCard profitFactor={2.0} grossProfit={1000} grossLoss={500} />);
    expect(screen.getByText('优秀')).toBeInTheDocument();
  });
  it('shows average label for moderate profit factor', () => {
    render(<ProfitFactorCard profitFactor={1.2} grossProfit={600} grossLoss={500} />);
    expect(screen.getByText('一般')).toBeInTheDocument();
  });
  it('shows poor label for low profit factor', () => {
    render(<ProfitFactorCard profitFactor={0.5} grossProfit={200} grossLoss={400} />);
    expect(screen.getByText('较差')).toBeInTheDocument();
  });
  it('applies custom className', () => {
    const { container } = render(<ProfitFactorCard profitFactor={1.5} grossProfit={100} grossLoss={50} className="my-card" />);
    expect(container.firstChild).toHaveClass('my-card');
  });
});

describe('DrawdownCard', () => {
  it('renders max drawdown', () => {
    render(<DrawdownCard maxDrawdown={15.5} />);
    expect(screen.getByText('15.50%')).toBeInTheDocument();
  });
  it('renders current drawdown', () => {
    render(<DrawdownCard maxDrawdown={20} currentDrawdown={8} />);
    expect(screen.getByText('当前回撤')).toBeInTheDocument();
    expect(screen.getByText('8.00%')).toBeInTheDocument();
  });
  it('renders recovery days', () => {
    render(<DrawdownCard maxDrawdown={25} recoveryDays={45} />);
    expect(screen.getByText('恢复天数')).toBeInTheDocument();
    expect(screen.getByText('45 天')).toBeInTheDocument();
  });
  it('shows high severity label', () => {
    render(<DrawdownCard maxDrawdown={25} />);
    expect(screen.getByText('高风险')).toBeInTheDocument();
  });
  it('shows medium severity label', () => {
    render(<DrawdownCard maxDrawdown={15} />);
    expect(screen.getByText('中风险')).toBeInTheDocument();
  });
  it('shows low severity label', () => {
    render(<DrawdownCard maxDrawdown={5} />);
    expect(screen.getByText('低风险')).toBeInTheDocument();
  });
  it('renders progress bar', () => {
    const { container } = render(<DrawdownCard maxDrawdown={50} />);
    const bar = container.querySelector('.h-full.rounded-full');
    expect(bar).toBeInTheDocument();
    expect(bar).toHaveAttribute('style', expect.stringContaining('width'));
  });
  it('applies custom className', () => {
    const { container } = render(<DrawdownCard maxDrawdown={10} className="my-card" />);
    expect(container.firstChild).toHaveClass('my-card');
  });
});

describe('StrategyRankingCard', () => {
  const baseProps = {
    rank: 1,
    name: '趋势跟踪',
    type: 'signal' as const,
    pnl: 15000,
    pnlPercent: 25.5,
    totalTrades: 120,
  };
  it('renders rank and name', () => {
    render(<StrategyRankingCard {...baseProps} />);
    expect(screen.getByText('趋势跟踪')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });
  it('renders PnL', () => {
    render(<StrategyRankingCard {...baseProps} />);
    expect(screen.getByText('+$15,000')).toBeInTheDocument();
  });
  it('renders PnL percent', () => {
    render(<StrategyRankingCard {...baseProps} />);
    expect(screen.getByText('(+25.5%)')).toBeInTheDocument();
  });
  it('renders total trades', () => {
    render(<StrategyRankingCard {...baseProps} />);
    expect(screen.getByText('120')).toBeInTheDocument();
  });
  it('renders negative PnL', () => {
    render(<StrategyRankingCard {...baseProps} pnl={-5000} pnlPercent={-8.3} />);
    expect(screen.getByText((t) => t.includes('$') && t.includes('5,000'))).toBeInTheDocument();
    expect(screen.getByText((t) => t.includes('8.3'))).toBeInTheDocument();
  });
  it('renders profit factor when provided', () => {
    render(<StrategyRankingCard {...baseProps} profitFactor={2.1} />);
    expect(screen.getByText('2.10')).toBeInTheDocument();
  });
  it('renders top rank with accent style', () => {
    const { container } = render(<StrategyRankingCard {...baseProps} rank={1} />);
    const rankEl = container.querySelector('.w-6');
    expect(rankEl?.className).toContain('bg-[var(--accent)]');
  });
  it('applies custom className', () => {
    const { container } = render(<StrategyRankingCard {...baseProps} className="my-card" />);
    expect(container.firstChild).toHaveClass('my-card');
  });
});
