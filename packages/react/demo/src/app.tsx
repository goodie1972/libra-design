import { useState } from 'react';
import { useTheme } from './theme-provider';
import {
  Button, Card, CardHeader, CardTitle, CardContent,
  Badge, Input, ChangeBadge, PriceDisplay, StockCard,
  Select, Tabs, Tag, Modal, Tooltip, Switch,
  Table, TableHeader, TableHead, TableRow, TableCell,
  MarketTable,
} from '@libra-design/react';
import type { Tab, MarketRow, MarketColumn } from '@libra-design/react';

// ============================================================
// 示例数据
// ============================================================
const marketData: MarketRow[] = [
  { code: 'sh600519', name: 'Kweichow Moutai', price: 1689.50, change: 35.20, changePercent: 2.13, volume: '17.23B' },
  { code: 'sz000858', name: 'Wuliangye', price: 142.80, change: -1.94, changePercent: -1.34, volume: '4.10B' },
  { code: 'sh601398', name: 'ICBC', price: 5.89, change: 0.03, changePercent: 0.51, volume: '7.33B' },
  { code: 'sz300750', name: 'CATL', price: 196.35, change: -5.80, changePercent: -2.87, volume: '10.25B' },
];

const columns: MarketColumn<MarketRow>[] = [
  { key: 'code', label: 'Code', sortable: true },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'price', label: 'Price', align: 'right', sortable: true,
    render: (r) => <span style={{ fontVariantNumeric: 'tabular-nums' }}>{r.price.toFixed(2)}</span> },
  { key: 'change', label: 'Change', align: 'right', sortable: true,
    render: (r) => <span style={{ color: r.change >= 0 ? 'var(--up)' : 'var(--down)', fontVariantNumeric: 'tabular-nums' }}>{r.change > 0 ? '+' : ''}{r.change.toFixed(2)}</span> },
  { key: 'changePercent', label: '%', align: 'right', sortable: true,
    render: (r) => <ChangeBadge value={r.changePercent} size="sm" /> },
  { key: 'volume', label: 'Volume', align: 'right' },
];

// ============================================================
// App
// ============================================================
export function App() {
  const { mix, setMix } = useTheme();
  const [modalOpen, setModalOpen] = useState(false);
  const [switchOn, setSwitchOn] = useState(false);
  const [tabValue, setTabValue] = useState('1m');
  const [selectValue, setSelectValue] = useState('');

  return (
    <div style={{ background: 'var(--bg-root)', color: 'var(--text-primary)', minHeight: '100vh', fontFamily: 'var(--font-body)', transition: 'background 0.6s, color 0.6s' }}>
      {/* Top Bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 28px', background: 'rgba(12,12,14,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-main)' }}>
        <div style={{ fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} />
          @libra-design/react
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 11, color: 'var(--text-tertiary)', letterSpacing: '0.02em', textTransform: 'uppercase' }}>Theme Mix</span>
          <input type="range" min="0" max="1" step="0.01" value={mix}
            onChange={(e) => setMix(parseFloat(e.target.value))}
            style={{ width: 140, height: 3, borderRadius: 2, accentColor: 'var(--accent)', cursor: 'pointer' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)', minWidth: 40, textAlign: 'right' }}>{Math.round(mix * 100)}%</span>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '80px 32px 40px' }}>
        {/* Header */}
        <h1 style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 8 }}>
          @libra-design/react
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 40, lineHeight: 1.7, fontWeight: 300 }}>
          Libra 设计系统 React 组件库 — 15 个组件，双主题兼容
        </p>

        {/* ============================== P0 ============================== */}
        <Section title="P0 · 基础组件">
          <h2 style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 12, letterSpacing: '0.02em' }}>Button</h2>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
            <Button variant="default">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="secondary" size="sm">Small</Button>
            <Button variant="default" size="lg">Large</Button>
          </div>

          <h2 style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 12, letterSpacing: '0.02em' }}>Card</h2>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 28 }}>
            <Card style={{ minWidth: 200, flex: 1 }}>
              <CardHeader><CardTitle>SSE Index</CardTitle></CardHeader>
              <CardContent>
                <PriceDisplay value={3382.45} change={41.23} changePercent={1.23} />
              </CardContent>
            </Card>
            <Card style={{ minWidth: 200, flex: 1 }}>
              <CardHeader><CardTitle>SZSE Index</CardTitle></CardHeader>
              <CardContent>
                <PriceDisplay value={10876.32} change={-48.90} changePercent={-0.45} />
              </CardContent>
            </Card>
          </div>

          <h2 style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 12, letterSpacing: '0.02em' }}>Table</h2>
          <div style={{ marginBottom: 28 }}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead style={{ textAlign: 'right' }}>Price</TableHead>
                  <TableHead style={{ textAlign: 'right' }}>Change</TableHead>
                </TableRow>
              </TableHeader>
              <tbody>
                {marketData.slice(0, 2).map((r, i) => (
                  <TableRow key={i}>
                    <TableCell style={{ fontFamily: 'var(--font-mono)' }}>{r.code}</TableCell>
                    <TableCell>{r.name}</TableCell>
                    <TableCell style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>{r.price.toFixed(2)}</TableCell>
                    <TableCell style={{ textAlign: 'right', color: r.change >= 0 ? 'var(--up)' : 'var(--down)', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>{r.change > 0 ? '+' : ''}{r.change.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </div>
        </Section>

        {/* ============================== P1 ============================== */}
        <Section title="P1 · 语义组件">
          <h2 style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 12, letterSpacing: '0.02em' }}>Badge</h2>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
            <Badge variant="up">+2.13%</Badge>
            <Badge variant="down">-1.34%</Badge>
            <Badge variant="flat">0.00%</Badge>
            <Badge variant="success">Connected</Badge>
            <Badge variant="warning">Delayed</Badge>
            <Badge variant="error">Failed</Badge>
          </div>

          <h2 style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 12, letterSpacing: '0.02em' }}>ChangeBadge</h2>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28, alignItems: 'center' }}>
            <ChangeBadge value={2.13} />
            <ChangeBadge value={-1.34} />
            <ChangeBadge value={0.00} />
            <ChangeBadge value={5.67} size="sm" />
            <ChangeBadge value={-3.21} size="sm" />
          </div>

          <h2 style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 12, letterSpacing: '0.02em' }}>PriceDisplay</h2>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 28, alignItems: 'baseline' }}>
            <PriceDisplay value={3382.45} change={41.23} changePercent={1.23} />
            <PriceDisplay value={10876.32} change={-48.90} changePercent={-0.45} />
            <PriceDisplay value={5000.00} change={0} />
          </div>

          <h2 style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 12, letterSpacing: '0.02em' }}>Input</h2>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28 }}>
            <Input placeholder="Search stocks..." style={{ width: 240 }} />
            <Input placeholder="With error" hasError style={{ width: 240 }} />
            <Input prefix="$" placeholder="Amount" style={{ width: 180 }} />
          </div>
        </Section>

        {/* ============================== P2 ============================== */}
        <Section title="P2 · 业务组件">
          <h2 style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 12, letterSpacing: '0.02em' }}>StockCard</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
            <StockCard code="sh600519" name="Kweichow Moutai" price={1689.50} change={35.20} changePercent={2.13} volume="17.23B" />
            <StockCard code="sz000858" name="Wuliangye" price={142.80} change={-1.94} changePercent={-1.34} volume="4.10B" />
            <StockCard code="sh601398" name="ICBC" price={5.89} change={0.03} changePercent={0.51} volume="7.33B" />
          </div>

          <h2 style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 12, letterSpacing: '0.02em' }}>Select &amp; Tabs &amp; Tag</h2>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 28, alignItems: 'center' }}>
            <Select
              options={[
                { value: '1d', label: '1 Day' },
                { value: '1w', label: '1 Week' },
                { value: '1m', label: '1 Month' },
                { value: '1y', label: '1 Year' },
              ]}
              placeholder="Select period..."
              value={selectValue}
              onChange={(e) => setSelectValue(e.target.value)}
              style={{ width: 160 }}
            />
            <Tabs
              tabs={[
                { value: '1m', label: '1M' },
                { value: '5m', label: '5M' },
                { value: '15m', label: '15M' },
                { value: '1h', label: '1H' },
              ]}
              value={tabValue}
              onChange={setTabValue}
            />
            <Tag variant="up">Bullish</Tag>
            <Tag variant="down">Bearish</Tag>
            <Tag variant="accent">Signal</Tag>
            <Tag onRemove={() => {}}>Dismiss</Tag>
          </div>
        </Section>

        {/* ============================== P3 ============================== */}
        <Section title="P3 · 交互组件">
          <h2 style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 12, letterSpacing: '0.02em' }}>Switch &amp; Tooltip &amp; Modal</h2>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 28, alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Switch checked={switchOn} onChange={setSwitchOn} />
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{switchOn ? 'On' : 'Off'}</span>
            </div>
            <Tooltip content="Real-time price data">
              <span style={{ fontSize: 13, borderBottom: '1px dashed var(--border-main)', cursor: 'help' }}>Hover me</span>
            </Tooltip>
            <Button variant="secondary" size="sm" onClick={() => setModalOpen(true)}>Open Modal</Button>
          </div>
        </Section>

        {/* ============================== MarketTable ============================== */}
        <Section title="MarketTable · 可排序行情表">
          <MarketTable data={marketData} columns={columns} />
        </Section>
      </div>

      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Trade Confirmation">
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>
          Confirm buying 100 shares of Kweichow Moutai at ¥1,689.50?
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="default" onClick={() => setModalOpen(false)}>Confirm</Button>
        </div>
      </Modal>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: '24px 0', borderBottom: '1px solid var(--border-sub)' }}>
      <h2 style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 20 }}>{title}</h2>
      {children}
    </div>
  );
}
