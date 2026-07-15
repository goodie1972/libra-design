import { useState } from 'react';
import { useTheme } from './theme-provider';
import {
  Button, Card, CardHeader, CardTitle, CardContent,
  Badge, Input, ChangeBadge, PriceDisplay, StockCard,
  Select, Tabs, Tag, Modal, Tooltip, Switch,
  Table, TableHeader, TableHead, TableRow, TableCell,
  StockTable, ConfigurableGrid, ColumnPicker, COLUMN_PRESETS,
  TimeShareChart, KLineChart,
} from '@libra-design/react';
import type { Tab, StockTableRow, ColumnDef, TimeSharePoint, KLineData } from '@libra-design/react';

// ============================================================
// 示例数据
// ============================================================
const marketData: StockTableRow[] = [
  { code: 'sh600519', name: 'Kweichow Moutai', price: 1689.50, change: 35.20, changePercent: 2.13, volume: '17.23B', open: 1650.00, high: 1700.00, low: 1645.00, turnover: '289.5亿' },
  { code: 'sz000858', name: 'Wuliangye', price: 142.80, change: -1.94, changePercent: -1.34, volume: '4.10B', open: 145.00, high: 146.50, low: 141.20, turnover: '58.6亿' },
  { code: 'sh601398', name: 'ICBC', price: 5.89, change: 0.03, changePercent: 0.51, volume: '7.33B', open: 5.86, high: 5.92, low: 5.84, turnover: '42.1亿' },
  { code: 'sz300750', name: 'CATL', price: 196.35, change: -5.80, changePercent: -2.87, volume: '10.25B', open: 202.00, high: 203.50, low: 195.00, turnover: '198.3亿' },
];

// ============================================================
// 模拟数据
// ============================================================
function genTimeShareData(): TimeSharePoint[] {
  const data: TimeSharePoint[] = [];
  const basePrice = 1689.50;
  let p = basePrice;
  for (let i = 0; i < 242; i++) {
    const t = `${String(9 + Math.floor((i * 5 + 330) / 60)).padStart(2, '0')}:${String((i * 5 + 330) % 60).padStart(2, '0')}`;
    p += (Math.random() - 0.48) * 3;
    data.push({ time: t, price: p, volume: Math.floor(Math.random() * 5000 + 500), avgPrice: basePrice + (p - basePrice) * 0.7 });
  }
  return data;
}
function genKLineData(): KLineData[] {
  const data: KLineData[] = [];
  let c = 1689.50;
  const d = new Date('2026-04-01');
  for (let i = 0; i < 60; i++) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() === 0) d.setDate(d.getDate() + 1);
    if (d.getDay() === 6) d.setDate(d.getDate() + 2);
    const candle = (Math.random() - 0.45) * 40;
    const o = c;
    c = o + candle;
    const high = Math.max(o, c) + Math.random() * 10;
    const low = Math.min(o, c) - Math.random() * 10;
    data.push({ time: `${d.getMonth() + 1}/${d.getDate()}`, open: o, high, low, close: c, volume: Math.floor(Math.random() * 80000 + 10000) });
  }
  return data;
}

// ============================================================
// App
// ============================================================
export function App() {
  const { mix, setMix } = useTheme();
  const [modalOpen, setModalOpen] = useState(false);
  const [switchOn, setSwitchOn] = useState(false);
  const [tabValue, setTabValue] = useState('1m');
  const [selectValue, setSelectValue] = useState('');
  const [selectedStock, setSelectedStock] = useState<StockTableRow | null>(null);
  const [chartTab, setChartTab] = useState('timeshare');
  const [tsData] = useState(genTimeShareData);
  const [klData] = useState(genKLineData);

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
          Libra 设计系统 React 组件库 — ConfigurableGrid 列编排表格+行情组件，双主题兼容
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

        {/* ============================== 键盘导航 + 多选 ============================== */}
        <Section title="键盘导航 + 多选（ConfigurableGrid 原生）">
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
            设置 <code>navigable</code> 启用键盘导航（↑↓⇱⇲）；<code>selectable</code> 启用多选（Ctrl/Shift+单击、Space 切换、Ctrl+A 全选、复选框模式）。
            可受控或非受控使用。
          </p>
          <ConfigurableGrid
            data={Array.from({ length: 20 }, (_, i) => ({
              code: `sh600${String(i + 1).padStart(3, '0')}`,
              name: `Sample Stock #${i + 1}`,
              price: 50 + Math.random() * 300,
              change: (Math.random() - 0.5) * 30,
              changePercent: (Math.random() - 0.5) * 12,
            }))}
            columns={[
              { key: 'code', label: '代码', width: 100, sortable: true },
              { key: 'name', label: '名称', width: 150, sortable: true },
              { key: 'price', label: '最新价', width: 100, format: 'price', sortable: true, align: 'right' },
              { key: 'change', label: '涨跌额', width: 100, sortable: true, align: 'right',
                render: (r) => <span style={{ color: r.change >= 0 ? 'var(--up)' : 'var(--down)', fontFamily: 'var(--font-mono)' }}>{r.change > 0 ? '+' : ''}{r.change.toFixed(2)}</span> },
              { key: 'changePercent', label: '涨跌幅', width: 100, format: 'changePercent', sortable: true, align: 'right' },
            ]}
            rowKey="code"
            navigable
            selectable={{ showCheckbox: true }}
          />
        </Section>

        {/* ============================== Excel 风格功能 ============================== */}
        <Section title="Excel 风格功能（列组折叠 + 筛选 + 列拖拽 + 条件着色）">
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
            <b>列组折叠</b>：点击分组表头的 ▶/▼ 按钮折叠/展开子列，折叠时只显示指定列。<br />
            <b>表头筛选</b>：点击列名旁的 ◆ 打开筛选输入框。<br />
            <b>列拖拽排序</b>：拖拽未固定的表头重新排列列顺序。<br />
            <b>条件着色</b>：基于值自动标色，如涨跌幅 &gt;5% 红色、小于 -5% 绿色。
          </p>
          <div style={{ maxHeight: 400, overflow: 'auto', border: '1px solid var(--border-main)', borderRadius: 'var(--card-radius)' }}>
            <ConfigurableGrid
              data={Array.from({ length: 30 }, (_, i) => ({
                code: `600${String(i + 1).padStart(3, '0')}`,
                name: `标的 ${i + 1}`,
                price: 50 + Math.random() * 250,
                change: (Math.random() - 0.5) * 30,
                changePercent: (Math.random() - 0.5) * 16,
                volume: Math.floor(Math.random() * 1000000),
                turnover: Math.floor(Math.random() * 50000000),
                high: 0,
                low: 0,
              }))}
              columns={[
                { key: 'code', label: '代码', width: 90, sortable: true, fixed: 'left' },
                { key: 'name', label: '名称', width: 100, sortable: true, fixed: 'left' },
                {
                  key: 'price_group', label: '价格体系', children: [
                    { key: 'price', label: '最新价', width: 100, format: 'price', sortable: true, align: 'right',
                      conditionalColor: [
                        { value: 200, color: 'var(--up)', op: '>' },
                        { value: 100, color: 'var(--text-primary)', op: 'between', max: 200 },
                        { value: 100, color: 'var(--down)', op: '<' },
                      ] },
                    { key: 'change', label: '涨跌额', width: 100, sortable: true, align: 'right',
                      render: (r) => <span style={{ color: r.change >= 0 ? 'var(--up)' : 'var(--down)', fontFamily: 'var(--font-mono)' }}>{r.change > 0 ? '+' : ''}{r.change.toFixed(2)}</span> },
                    { key: 'changePercent', label: '涨跌幅', width: 100, format: 'changePercent', sortable: true, align: 'right',
                      conditionalColor: [
                        { value: 5, color: 'var(--up)', bg: 'rgba(255,80,80,0.08)', op: '>' },
                        { value: -5, color: 'var(--down)', bg: 'rgba(0,200,100,0.08)', op: '<' },
                      ] },
                  ],
                  groupable: { collapsedColumns: ['price', 'changePercent'], defaultCollapsed: true },
                },
                {
                  key: 'volume_group', label: '成交量', children: [
                    { key: 'volume', label: '成交量', width: 110, sortable: true, align: 'right', filterable: true },
                    { key: 'turnover', label: '成交额', width: 120, format: 'number', sortable: true, align: 'right' },
                  ],
                  groupable: { collapsedColumns: ['volume'], defaultCollapsed: false },
                },
                { key: 'high', label: '最高', width: 80, format: 'price', align: 'right' },
                { key: 'low', label: '最低', width: 80, format: 'price', align: 'right' },
              ]}
              rowKey="code"
              navigable
              sortable
            />
          </div>
        </Section>

        {/* ============================== StockTable ============================== */}
        <Section title="StockTable · 可配置行情表（基于 ConfigurableGrid）">
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
            点击标题栏齿轮按钮 ⚙ 打开 ColumnPicker 编辑列（排序/显隐/固定/格式）。修改会自动持久化到 localStorage。
            支持键盘导航（↑↓⇱⇲）和多选（Ctrl/Shift+单击、Space 切换、Ctrl+A 全选）。
          </p>
          <StockTable data={marketData} showExtra columnPicker navigable selectable={{ showCheckbox: true }}
            onRowClick={(row) => setSelectedStock(row)} />
        </Section>

        {/* ============================== ConfigurableGrid ============================== */}
        <Section title="ConfigurableGrid · 通用可配置表格（底层组件）">
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
            ColumnDef 泛型表格，支持排序 + 列固定 + 列宽拖拽 + ColumnPicker 列编辑器。
            StockTable 即基于此组件封装。
          </p>
          <h2 style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 12, letterSpacing: '0.02em' }}>
            COLUMN_PRESETS — 3 套预设方案
          </h2>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
            {COLUMN_PRESETS.map((preset) => (
              <Card key={preset.name} style={{ flex: 1, minWidth: 180 }}>
                <CardHeader><CardTitle>{preset.label}</CardTitle></CardHeader>
                <CardContent>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                    {preset.columns.map((c) => (
                      <div key={c.key as string} style={{ display: 'flex', gap: 8 }}>
                        <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', minWidth: 80 }}>{c.label}</span>
                        <span>{c.fixed ? `[${c.fixed}] ` : ''}{c.format || 'text'}{c.sortable ? ' ↕' : ''}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <h2 style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 12, letterSpacing: '0.02em' }}>
            虚拟滚动演示（50 行数据）
          </h2>
          <div style={{ maxHeight: 300, overflow: 'auto', border: '1px solid var(--border-main)', borderRadius: 'var(--card-radius)' }}>
            <ConfigurableGrid
              data={Array.from({ length: 50 }, (_, i) => ({
                code: `stock_${i + 1}`,
                name: `Stock #${i + 1}`,
                price: 100 + Math.random() * 200,
                change: (Math.random() - 0.5) * 20,
                changePercent: (Math.random() - 0.5) * 10,
              }))}
              columns={[
                { key: 'code', label: '代码', width: 100, sortable: true },
                { key: 'name', label: '名称', width: 150, sortable: true },
                { key: 'price', label: '价格', width: 100, format: 'price', sortable: true, align: 'right' },
                { key: 'change', label: '涨跌额', width: 100, sortable: true, align: 'right',
                  render: (r) => <span style={{ color: r.change >= 0 ? 'var(--up)' : 'var(--down)', fontFamily: 'var(--font-mono)' }}>{r.change > 0 ? '+' : ''}{r.change.toFixed(2)}</span> },
                { key: 'changePercent', label: '涨跌幅', width: 100, format: 'changePercent', sortable: true, align: 'right' },
              ]}
              rowKey="code"
              virtualized={{ rowHeight: 48 }}
            />
          </div>
        </Section>
      </div>

      {/* Stock Detail Modal */}
      <Modal open={!!selectedStock} onClose={() => setSelectedStock(null)}
        title={`${selectedStock?.name} (${selectedStock?.code})`}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'baseline', marginBottom: 16 }}>
          <PriceDisplay value={selectedStock?.price ?? 0}
            change={selectedStock?.change ?? 0}
            changePercent={selectedStock?.changePercent ?? 0} />
        </div>
        <Tabs
          tabs={[
            { value: 'timeshare', label: '分时' },
            { value: 'kline', label: 'K线' },
          ]}
          value={chartTab}
          onChange={setChartTab}
        />
        <div style={{ marginTop: 12 }}>
          {chartTab === 'timeshare'
            ? <TimeShareChart data={tsData} width={580} height={300} />
            : <KLineChart data={klData} width={580} height={360} />}
        </div>
      </Modal>

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
