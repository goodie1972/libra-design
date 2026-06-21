import type { StoryObj } from '@storybook/react';
import {
  KLineChart, DepthChart, TimeShareChart, StockTable,
  MarketBoard, OrderBook, Heatmap,
} from '@libra-design/react';
import type { KLineData, DepthLevel, TimeSharePoint, StockTableRow, BoardLevel, OrderLevel, HeatmapCell } from '@libra-design/react';

// ============================================================
// Financial Charts — Phase 3
// ============================================================

const klineData: KLineData[] = [
  { time: '09:30', open: 1680, high: 1695, low: 1675, close: 1690, volume: 120000 },
  { time: '09:45', open: 1690, high: 1710, low: 1685, close: 1705, volume: 185000 },
  { time: '10:00', open: 1705, high: 1715, low: 1698, close: 1700, volume: 155000 },
  { time: '10:15', open: 1700, high: 1708, low: 1680, close: 1685, volume: 210000 },
  { time: '10:30', open: 1685, high: 1695, low: 1670, close: 1688, volume: 175000 },
  { time: '10:45', open: 1688, high: 1700, low: 1682, close: 1695, volume: 145000 },
  { time: '11:00', open: 1695, high: 1710, low: 1690, close: 1708, volume: 200000 },
  { time: '11:15', open: 1708, high: 1720, low: 1700, close: 1715, volume: 250000 },
  { time: '13:00', open: 1715, high: 1725, low: 1710, close: 1718, volume: 130000 },
  { time: '13:15', open: 1718, high: 1722, low: 1705, close: 1710, volume: 165000 },
  { time: '13:30', open: 1710, high: 1718, low: 1695, close: 1698, volume: 195000 },
  { time: '13:45', open: 1698, high: 1705, low: 1685, close: 1700, volume: 160000 },
  { time: '14:00', open: 1700, high: 1715, low: 1698, close: 1712, volume: 220000 },
  { time: '14:15', open: 1712, high: 1720, low: 1708, close: 1710, volume: 140000 },
  { time: '14:30', open: 1710, high: 1725, low: 1705, close: 1720, volume: 180000 },
];

const depthBids: DepthLevel[] = [
  { price: 1695.00, volume: 500 },
  { price: 1694.50, volume: 800 },
  { price: 1694.00, volume: 1200 },
  { price: 1693.50, volume: 600 },
  { price: 1693.00, volume: 1500 },
  { price: 1692.50, volume: 900 },
  { price: 1692.00, volume: 1100 },
];

const depthAsks: DepthLevel[] = [
  { price: 1695.50, volume: 700 },
  { price: 1696.00, volume: 1000 },
  { price: 1696.50, volume: 450 },
  { price: 1697.00, volume: 1300 },
  { price: 1697.50, volume: 850 },
  { price: 1698.00, volume: 600 },
  { price: 1698.50, volume: 1100 },
];

const timeShareData: TimeSharePoint[] = [
  { time: '09:30', price: 1680, volume: 120000, avgPrice: 1680 },
  { time: '09:35', price: 1685, volume: 95000, avgPrice: 1682 },
  { time: '09:40', price: 1690, volume: 140000, avgPrice: 1685 },
  { time: '09:45', price: 1695, volume: 110000, avgPrice: 1688 },
  { time: '09:50', price: 1688, volume: 130000, avgPrice: 1688 },
  { time: '09:55', price: 1685, volume: 100000, avgPrice: 1687 },
  { time: '10:00', price: 1692, volume: 150000, avgPrice: 1689 },
  { time: '10:05', price: 1698, volume: 125000, avgPrice: 1691 },
  { time: '10:10', price: 1705, volume: 180000, avgPrice: 1694 },
  { time: '10:15', price: 1700, volume: 105000, avgPrice: 1695 },
  { time: '10:20', price: 1710, volume: 200000, avgPrice: 1697 },
  { time: '10:25', price: 1715, volume: 160000, avgPrice: 1700 },
  { time: '10:30', price: 1708, volume: 135000, avgPrice: 1700 },
  { time: '10:35', price: 1712, volume: 170000, avgPrice: 1702 },
  { time: '10:40', price: 1720, volume: 190000, avgPrice: 1704 },
];

const stockData: StockTableRow[] = [
  { code: 'sh600519', name: 'Moutai', price: 1689.50, change: 35.20, changePercent: 2.13, volume: '17.23B', turnover: '28.91B' },
  { code: 'sz000858', name: 'Wuliangye', price: 142.80, change: -1.94, changePercent: -1.34, volume: '4.10B', turnover: '5.85B' },
  { code: 'sh601398', name: 'ICBC', price: 5.89, change: 0.03, changePercent: 0.51, volume: '7.33B', turnover: '4.32B' },
  { code: 'sz300750', name: 'CATL', price: 196.35, change: -5.80, changePercent: -2.87, volume: '10.25B', turnover: '20.13B' },
];

const boardBids: BoardLevel[] = [
  { price: 1689.00, volume: 500, total: 500 },
  { price: 1688.50, volume: 800, total: 1300 },
  { price: 1688.00, volume: 1200, total: 2500 },
  { price: 1687.50, volume: 600, total: 3100 },
  { price: 1687.00, volume: 1500, total: 4600 },
];

const boardAsks: BoardLevel[] = [
  { price: 1689.50, volume: 700, total: 700 },
  { price: 1690.00, volume: 1000, total: 1700 },
  { price: 1690.50, volume: 450, total: 2150 },
  { price: 1691.00, volume: 1300, total: 3450 },
  { price: 1691.50, volume: 850, total: 4300 },
];

const orderBookBids: OrderLevel[] = [
  { price: 1688.50, size: 200, total: 200 },
  { price: 1688.00, size: 500, total: 700 },
  { price: 1687.50, size: 300, total: 1000 },
  { price: 1687.00, size: 800, total: 1800 },
  { price: 1686.50, size: 400, total: 2200 },
];

const orderBookAsks: OrderLevel[] = [
  { price: 1689.50, size: 350, total: 350 },
  { price: 1690.00, size: 600, total: 950 },
  { price: 1690.50, size: 250, total: 1200 },
  { price: 1691.00, size: 700, total: 1900 },
  { price: 1691.50, size: 450, total: 2350 },
];

const heatmapData: HeatmapCell[] = [
  { label: 'Banking', value: 3.21, subtitle: '¥2.1T' },
  { label: 'Tech', value: -1.45, subtitle: '¥1.8T' },
  { label: 'Consumer', value: 0.82, subtitle: '¥950B' },
  { label: 'Energy', value: 4.56, subtitle: '¥780B' },
  { label: 'Healthcare', value: -0.33, subtitle: '¥620B' },
  { label: 'Real Estate', value: -2.87, subtitle: '¥540B' },
  { label: 'Materials', value: 1.15, subtitle: '¥430B' },
  { label: 'Utilities', value: 0.08, subtitle: '¥380B' },
];

export const KLineChartStory: StoryObj = {
  name: 'KLineChart',
  render: () => <KLineChart data={klineData} width={800} height={400} />,
};

export const DepthChartStory: StoryObj = {
  name: 'DepthChart',
  render: () => <DepthChart bids={depthBids} asks={depthAsks} width={500} height={280} />,
};

export const TimeShareChartStory: StoryObj = {
  name: 'TimeShareChart',
  render: () => <TimeShareChart data={timeShareData} width={700} height={320} />,
};

export const StockTableStory: StoryObj = {
  name: 'StockTable',
  render: () => (
    <div style={{ maxWidth: 800 }}>
      <StockTable data={stockData} showExtra />
    </div>
  ),
};

export const MarketBoardStory: StoryObj = {
  name: 'MarketBoard',
  render: () => <MarketBoard bids={boardBids} asks={boardAsks} style={{ maxWidth: 360 }} />,
};

export const OrderBookStory: StoryObj = {
  name: 'OrderBook',
  render: () => <OrderBook bids={orderBookBids} asks={orderBookAsks} maxLevels={5} style={{ maxWidth: 360 }} />,
};

export const HeatmapStory: StoryObj = {
  name: 'Heatmap',
  render: () => <Heatmap data={heatmapData} columns={4} />,
};
