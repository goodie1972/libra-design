import type { StoryObj } from '@storybook/react';
import {
  Calendar, DockPanel, Command, Watchlist,
  MiniChart, NewsFeed, DataCard, Screener,
} from '@libra-design/react';
import type { CalendarEvent, WatchlistItem, NewsItem, DataField, ScreenField } from '@libra-design/react';
import { useState } from 'react';

// ============================================================
// Financial Phase 7 — Bloomberg Depth
// ============================================================

const calendarEvents: CalendarEvent[] = [
  { day: 5, text: 'Moutai Q2 Earnings', type: 'earnings' },
  { day: 12, text: 'CATL Dividend Ex-Date', type: 'dividend' },
  { day: 18, text: 'Fed Rate Decision', type: 'other' },
  { day: 22, text: 'Wuliangye Q2 Earnings', type: 'earnings' },
  { day: 28, text: 'ICBC Dividend Pay', type: 'dividend' },
];

export const CalendarStory: StoryObj = {
  name: 'Calendar',
  render: () => (
    <div style={{ maxWidth: 380 }}>
      <Calendar year={2026} month={6} events={calendarEvents} />
    </div>
  ),
};

export const DockPanelStory: StoryObj = {
  name: 'DockPanel',
  render: () => (
    <DockPanel
      defaultActive="order"
      panels={[
        {
          id: 'order',
          title: 'Order',
          content: (
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Place Order</div>
              <div>Symbol: <span style={{ fontFamily: 'var(--font-mono)' }}>600519</span></div>
              <div>Price: <span style={{ fontFamily: 'var(--font-mono)' }}>¥1,689.50</span></div>
              <div>Quantity: <span style={{ fontFamily: 'var(--font-mono)' }}>100</span></div>
            </div>
          ),
        },
        {
          id: 'positions',
          title: 'Positions',
          content: (
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Current Positions</div>
              <div>600519 Moutai — <span style={{ color: 'var(--up)' }}>+2.13%</span></div>
              <div>300750 CATL — <span style={{ color: 'var(--down)' }}>-1.34%</span></div>
            </div>
          ),
        },
        {
          id: 'history',
          title: 'History',
          content: (
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Order History</div>
              <div>Buy 100 × 600519 @ ¥1,650.00 — Filled</div>
              <div>Sell 50 × 300750 @ ¥198.00 — Filled</div>
            </div>
          ),
        },
      ]}
      style={{ width: 520, height: 280 }}
    />
  ),
};

export const CommandStory: StoryObj = {
  name: 'Command',
  render: () => (
    <Command
      items={[
        { key: 'F1', label: 'Help Center', shortcut: 'F1' },
        { key: 'F2', label: 'New Order', shortcut: 'F2' },
        { key: 'F3', label: 'Watchlist', shortcut: 'F3' },
        { key: 'F4', label: 'Position View', shortcut: 'F4' },
        { key: 'F5', label: 'Market Depth', shortcut: 'F5' },
        { key: '⌘K', label: 'Search Symbol', shortcut: '⌘K' },
        { key: '⌘B', label: 'Toggle Sidebar', shortcut: '⌘B' },
      ]}
      style={{ maxWidth: 400 }}
    />
  ),
};

const watchlistItems: WatchlistItem[] = [
  { symbol: '600519', name: 'Moutai', price: 1689.50, change: 35.20, changePercent: 2.13 },
  { symbol: '300750', name: 'CATL', price: 196.35, change: -5.80, changePercent: -2.87 },
  { symbol: '601398', name: 'ICBC', price: 5.89, change: 0.03, changePercent: 0.51 },
  { symbol: '000858', name: 'Wuliangye', price: 142.80, change: -1.94, changePercent: -1.34 },
  { symbol: '600036', name: 'CMB', price: 35.60, change: 0.42, changePercent: 1.19 },
];

export const WatchlistStory: StoryObj = {
  name: 'Watchlist',
  render: () => <Watchlist items={watchlistItems} style={{ maxWidth: 400 }} />,
};

const upData = [100, 102, 101, 105, 108, 106, 110, 112, 109, 113, 115, 118];
const downData = [120, 118, 115, 117, 112, 110, 108, 106, 109, 105, 103, 100];

export const MiniChartStory: StoryObj = {
  name: 'MiniChart',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <MiniChart data={upData} width={120} height={32} />
        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Moutai <span style={{ color: 'var(--up)', fontFamily: 'var(--font-mono)' }}>+2.13%</span></span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <MiniChart data={downData} width={120} height={32} />
        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>CATL <span style={{ color: 'var(--down)', fontFamily: 'var(--font-mono)' }}>-2.87%</span></span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <MiniChart data={upData} trend="up" width={80} height={24} />
        <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Compact size</span>
      </div>
    </div>
  ),
};

const newsItems: NewsItem[] = [
  { title: 'Moutai reports Q2 revenue ¥35.2B, beating estimates by 8%', source: 'Reuters', time: '2 min ago' },
  { title: 'CATL announces new battery technology partnership with BMW', source: 'Bloomberg', time: '15 min ago', url: 'https://example.com' },
  { title: 'PBOC maintains key lending rate at 3.45% in June meeting', source: 'Xinhua', time: '1 hr ago' },
  { title: 'ICBC overweight rating maintained by Goldman Sachs, target ¥6.50', source: 'CNBC', time: '2 hr ago' },
  { title: 'Shenzhen Stock Exchange to extend trading hours pilot program', source: 'SCMP', time: '3 hr ago' },
];

export const NewsFeedStory: StoryObj = {
  name: 'NewsFeed',
  render: () => <NewsFeed items={newsItems} style={{ maxWidth: 480 }} />,
};

const dataCardFields: DataField[] = [
  { label: 'Market Cap', value: '¥2.13T' },
  { label: 'P/E Ratio', value: '28.5' },
  { label: '52W High', value: '¥1,890.00', trend: 'up' },
  { label: '52W Low', value: '¥1,420.00', trend: 'down' },
  { label: 'Volume', value: '17.23B' },
  { label: 'Avg Volume', value: '12.80B' },
];

export const DataCardStory: StoryObj = {
  name: 'DataCard',
  render: () => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      <DataCard title="600519 Moutai" fields={dataCardFields} style={{ width: 260 }} />
      <DataCard
        title="300750 CATL"
        fields={[
          { label: 'Market Cap', value: '¥856B' },
          { label: 'P/E Ratio', value: '22.1' },
          { label: 'Beta', value: '1.35' },
          { label: 'Dividend Yield', value: '0.82%' },
        ]}
        style={{ width: 260 }}
      />
    </div>
  ),
};

const screenerFields: ScreenField[] = [
  { label: 'Market Cap', value: '> ¥10B' },
  { label: 'P/E Ratio', value: '< 30' },
  { label: 'Change %', value: '> 0%' },
  { label: 'Volume', value: '> 5B' },
  { label: 'Sector', value: 'Banking' },
  { label: '52W Range', value: 'Above Mid' },
];

export const ScreenerStory: StoryObj = {
  name: 'Screener',
  render: () => <Screener fields={screenerFields} style={{ maxWidth: 360 }} />,
};
