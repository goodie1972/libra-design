import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  Button, Card, CardHeader, CardTitle, CardContent,
  Badge, Input, Textarea, Checkbox, RadioGroup, Slider, Switch, Select,
  PriceDisplay, ChangeBadge, StockCard, Statistic,
  Breadcrumb, Pagination, DropdownMenu, Tabs, Accordion,
  Alert, Modal, Tooltip, Progress, Skeleton, SkeletonCard,
  Divider, Space, Flex, Table, TableHeader, TableHead, TableRow, TableCell,
  Avatar, Empty, Tag, MarketTable,
} from '@libra-design/react';
import type { MarketRow, MarketColumn, Tab } from '@libra-design/react';

// ============================================================
// P0-Basic
// ============================================================

export const ButtonStory: StoryObj = {
  name: 'Button',
  render: () => (
    <Space>
      <Button variant="default">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
      <Button size="sm">Small</Button>
      <Button disabled>Disabled</Button>
    </Space>
  ),
};

export const CardStory: StoryObj = {
  name: 'Card',
  render: () => (
    <Space>
      <Card style={{ width: 260 }}>
        <CardHeader><CardTitle>SSE Index</CardTitle></CardHeader>
        <CardContent>
          <PriceDisplay value={3382.45} change={41.23} changePercent={1.23} />
        </CardContent>
      </Card>
      <Card style={{ width: 260 }}>
        <CardHeader><CardTitle>SZSE Index</CardTitle></CardHeader>
        <CardContent>
          <PriceDisplay value={10876.32} change={-48.90} changePercent={-0.45} />
        </CardContent>
      </Card>
    </Space>
  ),
};

export const BadgeStory: StoryObj = {
  name: 'Badge',
  render: () => (
    <Flex gap="md" wrap>
      <Badge variant="up">+2.13%</Badge>
      <Badge variant="down">-1.34%</Badge>
      <Badge variant="flat">0.00%</Badge>
      <Badge variant="success">Online</Badge>
      <Badge variant="warning">Delayed</Badge>
      <Badge variant="error">Offline</Badge>
    </Flex>
  ),
};

export const TagStory: StoryObj = {
  name: 'Tag',
  render: () => (
    <Flex gap="md" wrap>
      <Tag variant="up">Bullish</Tag>
      <Tag variant="down">Bearish</Tag>
      <Tag variant="accent">Signal</Tag>
      <Tag onRemove={() => {}}>Dismiss</Tag>
    </Flex>
  ),
};

export const InputStory: StoryObj = {
  name: 'Input',
  render: () => (
    <Flex direction="column" gap="md" style={{ maxWidth: 300 }}>
      <Input placeholder="Search stocks..." />
      <Input placeholder="With error" hasError />
      <Input prefix="$" placeholder="Amount" />
      <Input disabled value="Disabled" />
    </Flex>
  ),
};

export const TextareaStory: StoryObj = {
  name: 'Textarea',
  render: () => (
    <Flex direction="column" gap="md" style={{ maxWidth: 400 }}>
      <Textarea placeholder="Write notes..." />
      <Textarea hasError placeholder="Error state" />
      <Textarea showCount maxLength={200} defaultValue="Hello" />
    </Flex>
  ),
};

export const CheckboxStory: StoryObj = {
  name: 'Checkbox',
  render: () => {
    const [val, setVal] = useState<string[]>(['a']);
    return (
      <Flex direction="column" gap="md">
        <Checkbox
          options={[
            { value: 'a', label: 'Apple' },
            { value: 'b', label: 'Banana' },
            { value: 'c', label: 'Cherry' },
          ]}
          value={val}
          onChange={setVal}
        />
        <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Selected: {val.join(', ') || '(none)'}</div>
      </Flex>
    );
  },
};

export const RadioStory: StoryObj = {
  name: 'RadioGroup',
  render: () => {
    const [val, setVal] = useState('1m');
    return (
      <Flex direction="column" gap="lg">
        <RadioGroup
          options={[{ value: '1m', label: '1 Month' }, { value: '3m', label: '3 Months' }, { value: '1y', label: '1 Year' }]}
          value={val} onChange={setVal}
        />
        <RadioGroup
          options={[{ value: '1m', label: '1M' }, { value: '5m', label: '5M' }, { value: '15m', label: '15M' }]}
          value={val} onChange={setVal} variant="button"
        />
      </Flex>
    );
  },
};

export const SliderStory: StoryObj = {
  name: 'Slider',
  render: () => {
    const [val, setVal] = useState(60);
    return (
      <Flex direction="column" gap="md" style={{ maxWidth: 300 }}>
        <Slider min={0} max={100} value={val} onChange={setVal} />
        <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Value: {val}</div>
      </Flex>
    );
  },
};

export const SwitchStory: StoryObj = {
  name: 'Switch',
  render: () => {
    const [on, setOn] = useState(true);
    return (
      <Flex align="center" gap="md">
        <Switch checked={on} onChange={setOn} />
        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{on ? 'On' : 'Off'}</span>
      </Flex>
    );
  },
};

export const SelectStory: StoryObj = {
  name: 'Select',
  render: () => (
    <Select
      options={[{ value: '1d', label: '1 Day' }, { value: '1w', label: '1 Week' }, { value: '1m', label: '1 Month' }]}
      placeholder="Select period..."
      style={{ width: 200 }}
    />
  ),
};

// ============================================================
// P1-Financial
// ============================================================

export const PriceDisplayStory: StoryObj = {
  name: 'PriceDisplay',
  render: () => (
    <Flex direction="column" gap="lg">
      <PriceDisplay value={3382.45} change={41.23} changePercent={1.23} />
      <PriceDisplay value={10876.32} change={-48.90} changePercent={-0.45} />
      <PriceDisplay value={5000.00} change={0} showArrow={false} precision={0} />
    </Flex>
  ),
};

export const ChangeBadgeStory: StoryObj = {
  name: 'ChangeBadge',
  render: () => (
    <Flex gap="md" wrap align="center">
      <ChangeBadge value={2.13} />
      <ChangeBadge value={-1.34} />
      <ChangeBadge value={0} />
      <ChangeBadge value={5.67} size="sm" />
    </Flex>
  ),
};

export const StockCardStory: StoryObj = {
  name: 'StockCard',
  render: () => (
    <Flex gap="md" wrap>
      <StockCard code="sh600519" name="Moutai" price={1689.50} change={35.20} changePercent={2.13} volume="17.23B" />
      <StockCard code="sz000858" name="Wuliangye" price={142.80} change={-1.94} changePercent={-1.34} volume="4.10B" />
      <StockCard code="sh601398" name="ICBC" price={5.89} change={0.03} changePercent={0.51} volume="7.33B" />
    </Flex>
  ),
};

export const StatisticStory: StoryObj = {
  name: 'Statistic',
  render: () => (
    <Flex gap="xl" wrap>
      <Statistic title="Total Volume" value={3382450000} precision={0} prefix="¥" />
      <Statistic title="Change" value={2.13} precision={2} suffix="%" trend="up" />
      <Statistic title="Decline" value={-1.34} precision={2} suffix="%" trend="down" />
    </Flex>
  ),
};

export const MarketTableStory: StoryObj = {
  name: 'MarketTable',
  render: () => {
    const data: MarketRow[] = [
      { code: 'sh600519', name: 'Moutai', price: 1689.50, change: 35.20, changePercent: 2.13, volume: '17.23B' },
      { code: 'sz000858', name: 'Wuliangye', price: 142.80, change: -1.94, changePercent: -1.34, volume: '4.10B' },
      { code: 'sh601398', name: 'ICBC', price: 5.89, change: 0.03, changePercent: 0.51, volume: '7.33B' },
      { code: 'sz300750', name: 'CATL', price: 196.35, change: -5.80, changePercent: -2.87, volume: '10.25B' },
    ];
    const columns: MarketColumn<MarketRow>[] = [
      { key: 'code', label: 'Code', sortable: true },
      { key: 'name', label: 'Name', sortable: true },
      { key: 'price', label: 'Price', align: 'right', sortable: true,
        render: (r) => <span style={{ fontVariantNumeric: 'tabular-nums' }}>{r.price.toFixed(2)}</span> },
      { key: 'change', label: 'Chg', align: 'right', sortable: true,
        render: (r) => <span style={{ color: r.change >= 0 ? 'var(--up)' : 'var(--down)', fontVariantNumeric: 'tabular-nums' }}>{r.change > 0 ? '+' : ''}{r.change.toFixed(2)}</span> },
      { key: 'changePercent', label: '%', align: 'right', sortable: true,
        render: (r) => <ChangeBadge value={r.changePercent} size="sm" /> },
    ];
    return <MarketTable data={data} columns={columns} />;
  },
};

// ============================================================
// P2-Navigation
// ============================================================

export const BreadcrumbStory: StoryObj = {
  name: 'Breadcrumb',
  render: () => (
    <Flex direction="column" gap="md">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Stocks' }, { label: 'AAPL' }]} />
      <Breadcrumb items={[{ label: 'Dashboard' }, { label: 'Reports' }, { label: 'Q1 2026' }]} separator=">" />
    </Flex>
  ),
};

export const PaginationStory: StoryObj = {
  name: 'Pagination',
  render: () => {
    const [page, setPage] = useState(3);
    return <Pagination current={page} total={200} pageSize={20} onChange={setPage} />;
  },
};

export const DropdownMenuStory: StoryObj = {
  name: 'DropdownMenu',
  render: () => (
    <Flex gap="xl">
      <DropdownMenu
        trigger={<Button variant="secondary">Actions</Button>}
        items={[
          { label: 'View Detail', onClick: () => {} },
          { label: 'Edit', onClick: () => {} },
          { separator: true },
          { label: 'Delete', onClick: () => {} },
        ]}
      />
    </Flex>
  ),
};

export const TabsStory: StoryObj = {
  name: 'Tabs',
  render: () => {
    const [tab, setTab] = useState('1m');
    const tabs: Tab[] = [
      { value: '1m', label: '1M' },
      { value: '5m', label: '5M' },
      { value: '15m', label: '15M' },
      { value: '1h', label: '1H' },
      { value: '1d', label: '1D', disabled: true },
    ];
    return <Tabs tabs={tabs} value={tab} onChange={setTab} />;
  },
};

export const AccordionStory: StoryObj = {
  name: 'Accordion',
  render: () => (
    <Accordion
      items={[
        { value: '1', title: 'Company Overview', content: 'Founded in 2001. Market cap: ¥2.1T. P/E ratio: 28.5.' },
        { value: '2', title: 'Financial Metrics', content: 'Revenue: ¥150B. Net income: ¥45B. EPS: ¥12.80.' },
        { value: '3', title: 'Risk Factors', content: 'Market volatility. Regulatory changes. FX exposure.' },
      ]}
    />
  ),
};

// ============================================================
// P3-Feedback
// ============================================================

export const AlertStory: StoryObj = {
  name: 'Alert',
  render: () => (
    <Flex direction="column" gap="md" style={{ maxWidth: 500 }}>
      <Alert variant="info" title="Info">Market data updates every 15 minutes.</Alert>
      <Alert variant="success" title="Success">Order executed at ¥1,689.50.</Alert>
      <Alert variant="warning" title="Warning">Trading will close in 30 minutes.</Alert>
      <Alert variant="error" title="Error">Failed to fetch market data.</Alert>
      <Alert onClose={() => {}}>Dismissable alert message.</Alert>
    </Flex>
  ),
};

export const ModalStory: StoryObj = {
  name: 'Modal',
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <Modal open={open} onClose={() => setOpen(false)} title="Trade Confirmation" size="sm">
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>Buy 100 shares at ¥1,689.50?</p>
          <Flex justify="end" gap="md">
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => setOpen(false)}>Confirm</Button>
          </Flex>
        </Modal>
      </>
    );
  },
};

export const TooltipStory: StoryObj = {
  name: 'Tooltip',
  render: () => (
    <Flex gap="xl" align="center">
      <Tooltip content="Top tooltip"><span style={{ borderBottom: '1px dashed var(--border-main)', cursor: 'help', fontSize: 13 }}>Hover top</span></Tooltip>
      <Tooltip content="Bottom tooltip" position="bottom"><span style={{ borderBottom: '1px dashed var(--border-main)', cursor: 'help', fontSize: 13 }}>Hover bottom</span></Tooltip>
    </Flex>
  ),
};

export const ProgressStory: StoryObj = {
  name: 'Progress',
  render: () => (
    <Flex direction="column" gap="lg" style={{ maxWidth: 400 }}>
      <Progress value={65} showLabel />
      <Progress value={42} size="sm" />
      <Progress value={90} size="lg" />
      <Flex gap="lg" align="center">
        <Progress value={75} variant="circle" showLabel />
        <Progress value={45} variant="circle" size="sm" />
      </Flex>
    </Flex>
  ),
};

export const SkeletonStory: StoryObj = {
  name: 'Skeleton',
  render: () => (
    <Flex gap="lg">
      <Flex direction="column" gap="md" style={{ width: 200 }}>
        <Skeleton circle width={40} height={40} />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </Flex>
      <SkeletonCard lines={4} />
    </Flex>
  ),
};

// ============================================================
// P4-Layout
// ============================================================

export const TableStory: StoryObj = {
  name: 'Table',
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Code</TableHead>
          <TableHead>Name</TableHead>
          <TableHead style={{ textAlign: 'right' }}>Price</TableHead>
        </TableRow>
      </TableHeader>
      <tbody>
        <TableRow><TableCell style={{ fontFamily: 'var(--font-mono)' }}>sh600519</TableCell><TableCell>Moutai</TableCell><TableCell style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>1,689.50</TableCell></TableRow>
        <TableRow><TableCell style={{ fontFamily: 'var(--font-mono)' }}>sz000858</TableCell><TableCell>Wuliangye</TableCell><TableCell style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>142.80</TableCell></TableRow>
      </tbody>
    </Table>
  ),
};

export const DividerStory: StoryObj = {
  name: 'Divider',
  render: () => (
    <Flex direction="column" gap="md">
      <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Above divider</p>
      <Divider />
      <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Below divider</p>
      <Divider label="OR" />
      <Flex gap="md" style={{ height: 60 }} align="center">
        <span style={{ fontSize: 12 }}>Left</span>
        <Divider orientation="vertical" />
        <span style={{ fontSize: 12 }}>Center</span>
        <Divider orientation="vertical" />
        <span style={{ fontSize: 12 }}>Right</span>
      </Flex>
    </Flex>
  ),
};

export const SpaceStory: StoryObj = {
  name: 'Space',
  render: () => (
    <Flex direction="column" gap="lg">
      <Space size="sm">
        <Button size="sm">A</Button>
        <Button size="sm">B</Button>
        <Button size="sm">C</Button>
      </Space>
      <Space size="lg" wrap>
        <Badge variant="up">Up</Badge>
        <Badge variant="down">Down</Badge>
        <Badge variant="flat">Flat</Badge>
        <Badge variant="success">OK</Badge>
      </Space>
    </Flex>
  ),
};

export const FlexStory: StoryObj = {
  name: 'Flex',
  render: () => (
    <Flex direction="column" gap="lg">
      <Flex justify="between">
        <div style={{ width: 60, height: 30, background: 'var(--bg-card-hover)', borderRadius: 6 }} />
        <div style={{ width: 60, height: 30, background: 'var(--bg-card-hover)', borderRadius: 6 }} />
        <div style={{ width: 60, height: 30, background: 'var(--bg-card-hover)', borderRadius: 6 }} />
      </Flex>
      <Flex justify="center" gap="md">
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--accent)' }} />
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--accent)' }} />
      </Flex>
    </Flex>
  ),
};

// ============================================================
// P5-Data
// ============================================================

export const AvatarStory: StoryObj = {
  name: 'Avatar',
  render: () => (
    <Flex gap="md" align="center">
      <Avatar fallback="U" />
      <Avatar fallback="A" size="sm" />
      <Avatar fallback="B" size="lg" />
      <Avatar src="https://i.pravatar.cc/40?img=1" alt="User" />
    </Flex>
  ),
};

export const EmptyStory: StoryObj = {
  name: 'Empty',
  render: () => (
    <Flex gap="xl" wrap>
      <Empty title="No Results" description="No stocks match your filter criteria." />
      <Empty title="No Data" action={<Button size="sm">Refresh</Button>} />
    </Flex>
  ),
};

// ============================================================
// Meta — required default export
// ============================================================
const meta: Meta = { title: 'Overview/Components', component: () => null };
export default meta;
