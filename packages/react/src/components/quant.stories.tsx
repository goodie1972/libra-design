import type { StoryObj } from '@storybook/react';
import {
  KPICard,
  WinRateCard,
  ProfitFactorCard,
  DrawdownCard,
  StrategyRankingCard,
  TypePill,
  ExchangeTag,
  OrderStatusTag,
} from '@libra-design/react';

export const KPICardStory: StoryObj = {
  name: 'KPICard',
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, maxWidth: 900 }}>
      <KPICard
        icon="💰"
        label="总权益"
        value={12500.00}
        unit="$"
        trend="up"
        subValue="+$234"
        subLabel="(+3.2%)"
      />
      <KPICard
        icon="📈"
        label="今日盈亏"
        value={1567.89}
        unit="$"
        trend="up"
        subValue="+12.5%"
      />
      <KPICard
        icon="📊"
        label="交易笔数"
        value={156}
        trend="flat"
        subValue="今日 23 笔"
      />
    </div>
  ),
};

export const WinRateCardStory: StoryObj = {
  name: 'WinRateCard',
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      <WinRateCard winRate={73.5} winCount={156} lossCount={62} />
      <WinRateCard winRate={58.2} winCount={89} lossCount={64} />
      <WinRateCard winRate={45.8} winCount={45} lossCount={53} />
    </div>
  ),
};

export const ProfitFactorCardStory: StoryObj = {
  name: 'ProfitFactorCard',
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      <ProfitFactorCard profitFactor={2.15} grossProfit={15678} grossLoss={7289} />
      <ProfitFactorCard profitFactor={1.32} grossProfit={8920} grossLoss={6756} />
      <ProfitFactorCard profitFactor={0.85} grossProfit={4567} grossLoss={5372} />
    </div>
  ),
};

export const DrawdownCardStory: StoryObj = {
  name: 'DrawdownCard',
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      <DrawdownCard maxDrawdown={-8.5} currentDrawdown={-3.2} recoveryDays={12} />
      <DrawdownCard maxDrawdown={-15.7} currentDrawdown={-8.9} recoveryDays={28} />
      <DrawdownCard maxDrawdown={-25.3} currentDrawdown={-18.6} recoveryDays={45} />
    </div>
  ),
};

export const StrategyRankingCardStory: StoryObj = {
  name: 'StrategyRankingCard',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400 }}>
      <StrategyRankingCard
        rank={1}
        name="RSI-Overlay"
        type="signal"
        pnl={1234}
        pnlPercent={15.6}
        totalTrades={156}
        profitFactor={2.1}
        maxPnL={1500}
      />
      <StrategyRankingCard
        rank={2}
        name="MACD-Bot"
        type="bot"
        pnl={987}
        pnlPercent={12.3}
        totalTrades={89}
        profitFactor={1.8}
        maxPnL={1500}
      />
      <StrategyRankingCard
        rank={3}
        name="Grid-Script"
        type="script"
        pnl={-456}
        pnlPercent={-5.7}
        totalTrades={234}
        profitFactor={0.92}
        maxPnL={1500}
      />
    </div>
  ),
};

export const TypePillStory: StoryObj = {
  name: 'TypePill',
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <TypePill type="signal" />
      <TypePill type="script" />
      <TypePill type="bot" />
    </div>
  ),
};

export const ExchangeTagStory: StoryObj = {
  name: 'ExchangeTag',
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <ExchangeTag exchange="binance" />
      <ExchangeTag exchange="okx" />
      <ExchangeTag exchange="bitget" />
      <ExchangeTag exchange="bybit" />
    </div>
  ),
};

export const OrderStatusTagStory: StoryObj = {
  name: 'OrderStatusTag',
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <OrderStatusTag status="pending" />
      <OrderStatusTag status="processing" />
      <OrderStatusTag status="completed" />
      <OrderStatusTag status="failed" />
      <OrderStatusTag status="cancelled" />
    </div>
  ),
};

export const AllQuantComponentsStory: StoryObj = {
  name: 'All Quant Components',
  render: () => (
    <div style={{ padding: 24, background: 'var(--bg-root)', minHeight: '100vh' }}>
      <h2 style={{ color: 'var(--text-primary)', marginBottom: 24 }}>Phase 10 - Quant Components</h2>
      
      <h3 style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>KPICard</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        <KPICard icon="💰" label="总权益" value={12500} unit="$" trend="up" subValue="+$234" />
        <KPICard icon="📈" label="今日盈亏" value={1567} unit="$" trend="up" />
        <KPICard icon="📊" label="交易笔数" value={156} />
      </div>

      <h3 style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>WinRateCard</h3>
      <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
        <WinRateCard winRate={73.5} winCount={156} lossCount={62} />
        <WinRateCard winRate={58.2} winCount={89} lossCount={64} />
      </div>

      <h3 style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>ProfitFactorCard</h3>
      <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
        <ProfitFactorCard profitFactor={2.15} grossProfit={15678} grossLoss={7289} />
        <ProfitFactorCard profitFactor={1.32} grossProfit={8920} grossLoss={6756} />
      </div>

      <h3 style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>DrawdownCard</h3>
      <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
        <DrawdownCard maxDrawdown={-8.5} currentDrawdown={-3.2} recoveryDays={12} />
        <DrawdownCard maxDrawdown={-15.7} currentDrawdown={-8.9} recoveryDays={28} />
      </div>

      <h3 style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>StrategyRankingCard</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400, marginBottom: 32 }}>
        <StrategyRankingCard rank={1} name="RSI-Overlay" type="signal" pnl={1234} pnlPercent={15.6} totalTrades={156} profitFactor={2.1} maxPnL={1500} />
        <StrategyRankingCard rank={2} name="MACD-Bot" type="bot" pnl={987} pnlPercent={12.3} totalTrades={89} profitFactor={1.8} maxPnL={1500} />
      </div>

      <h3 style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>Tags & Pills</h3>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <TypePill type="signal" />
        <TypePill type="script" />
        <TypePill type="bot" />
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <ExchangeTag exchange="binance" />
        <ExchangeTag exchange="okx" />
        <ExchangeTag exchange="bitget" />
        <ExchangeTag exchange="bybit" />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <OrderStatusTag status="pending" />
        <OrderStatusTag status="processing" />
        <OrderStatusTag status="completed" />
        <OrderStatusTag status="failed" />
        <OrderStatusTag status="cancelled" />
      </div>
    </div>
  ),
};
