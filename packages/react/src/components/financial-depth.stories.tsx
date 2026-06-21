import type { StoryObj } from '@storybook/react';
import { OrderForm, PositionCard, LiveTicker, HeatmapSector } from '@libra-design/react';
import type { SectorData } from '@libra-design/react';
import { useState } from 'react';

// ============================================================
// Financial Depth — Phase 3 + Phase 7
// ============================================================

export const OrderFormStory: StoryObj = {
  name: 'OrderForm',
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <OrderForm
        type="buy"
        symbol="600519"
        price={1689.50}
        onSubmit={(order) => console.log('Order:', order)}
      />
    </div>
  ),
};

export const SellOrderFormStory: StoryObj = {
  name: 'OrderForm (Sell)',
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <OrderForm
        type="sell"
        symbol="300750"
        price={196.35}
        onSubmit={(order) => console.log('Order:', order)}
      />
    </div>
  ),
};

export const PositionCardStory: StoryObj = {
  name: 'PositionCard',
  render: () => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      <PositionCard symbol="sh600519" name="Moutai" quantity={100} avgCost={1650} currentPrice={1689.50} />
      <PositionCard symbol="sz000858" name="Wuliangye" quantity={200} avgCost={148} currentPrice={142.80} />
      <PositionCard symbol="sz300750" name="CATL" quantity={500} avgCost={190} currentPrice={196.35} />
    </div>
  ),
};

export const LiveTickerStory: StoryObj = {
  name: 'LiveTicker',
  render: () => (
    <div style={{ maxWidth: 800 }}>
      <LiveTicker
        items={[
          { symbol: '600519', name: 'Moutai', price: 1689.50, change: 35.20, changePercent: 2.13 },
          { symbol: '000858', name: 'Wuliangye', price: 142.80, change: -1.94, changePercent: -1.34 },
          { symbol: '300750', name: 'CATL', price: 196.35, change: -5.80, changePercent: -2.87 },
          { symbol: '601398', name: 'ICBC', price: 5.89, change: 0.03, changePercent: 0.51 },
          { symbol: '000001', name: 'PAYC', price: 12.45, change: 0.28, changePercent: 2.30 },
          { symbol: '600036', name: 'CMB', price: 35.60, change: -0.42, changePercent: -1.17 },
        ]}
        speed="normal"
      />
    </div>
  ),
};

const sectorData: SectorData[] = [
  { name: '银行', changePercent: 3.21, volume: 2100000000 },
  { name: '科技', changePercent: -1.45, volume: 1800000000 },
  { name: '消费', changePercent: 0.82, volume: 950000000 },
  { name: '能源', changePercent: 4.56, volume: 780000000 },
  { name: '医药', changePercent: -0.33, volume: 620000000 },
  { name: '地产', changePercent: -2.87, volume: 540000000 },
  { name: '材料', changePercent: 1.15, volume: 430000000 },
  { name: '公用', changePercent: 0.08, volume: 380000000 },
  { name: '金融', changePercent: 2.50, volume: 1500000000 },
  { name: '通信', changePercent: -1.20, volume: 320000000 },
  { name: '工业', changePercent: 1.88, volume: 870000000 },
  { name: '可选', changePercent: 0.45, volume: 560000000 },
];

export const HeatmapSectorStory: StoryObj = {
  name: 'HeatmapSector',
  render: () => <HeatmapSector sectors={sectorData} width={600} height={360} />,
};
