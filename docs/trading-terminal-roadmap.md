# Libra Trading Terminal — 发展路线图

---

## 战略三问

### 兼容什么

**Shadcn UI / Radix 生态** — 2025-2026 React 组件的事实标准。对齐 API 模式（forwardRef、asChild、className），他们的 Table/Card/Dialog 覆盖通用场景，我们的组件可以和它们混用。

**TradingView Lightweight Charts** — K 线场景的行业标准，用户可能嵌入。我们做轻量 K 线做替代/补充。

**Tailwind CSS + CSS 变量** — 已经是我们基础。

### 辅助什么

| Shadcn 有 | Shadcn 没有（我们做） |
|---|---|
| Table | MarketTable（金融格式化/涨跌色/排序） |
| Card | StockCard, PositionCard, KPICard 等 10+ |
| Dialog | Modal + 交易终端交互模式 |
| — | OrderBook, MarketBoard, Watchlist |
| — | KLine, DepthChart, TimeShareChart |
| — | 量化组件 16 个（WinRateCard, TypePill...） |

### 主推什么

**开源交易终端组件库（Trading Terminal UI Kit）**

35+ 金融组件开箱即用 · A 股专业习惯内置（红涨绿跌/五档/行业板块） · 10 套专业主题预设 · 零外部 chart 依赖基础 K 线 · Go/Rust/TS 全栈 token 同步

---

## 总体规划

## 总体规划 — 实际进展

```
✅ Phase 1: ConfigurableGrid 底座 + ColumnPicker 列编辑器 + ColumnFormats 格式预设
         ↓ 已完成 — 泛型 ColumnDef<T> 表格，列显隐/排序/固定/拖拽宽/格式预设
✅ Phase 2: ConfigurableGrid 功能扩展 — 虚拟滚动/行展开/列分组/列持久化/ColumnPicker 集成
         ↓ 已完成 — configurable-grid.tsx 从 296 行 → 632 行
✅ Phase 3: StockTable 重构（基于 ConfigurableGrid）+ demo 画布
         ↓ 已完成 — StockTable 自动获得全部高级能力，demo 画布展示
⬜ Phase 4: 指标展示体系 (MACD/RSI/MA/Volume) + 键盘导航 + 多选
         ↓ 展示层，不开指标计算引擎
⬜ Phase 5: 配置标准化 + JSON Schema + GitHub 社区化
         ↓ 开放标准，让社区参与
⬜ Phase 6: 画布可视化工具（可选）
         ↓ 拖拽生成看盘界面
```

---

> **实际状态**：Phase 1 ✅ · Phase 2 ✅ · Phase 3 ✅ · 最新代码见 `packages/react/src/components/configurable-grid.tsx`（632 行）

## Phase 1：ConfigurableGrid + ColumnPicker（已完成）

### 目标
从写死列的 `MarketTable` → 列可编排的 `ConfigurableGrid<T>`。

### 交付物

#### 1.0 核心组件：`ConfigurableGrid<T>`

```tsx
interface ColumnDef<T> {
  key: string;
  label: string;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  visible?: boolean;
  fixed?: 'left' | 'right' | false;
  align?: 'left' | 'right' | 'center';
  sortable?: boolean;
  resizable?: boolean;
  render?: (row: T, index: number) => React.ReactNode;
  /** 自定义列头渲染（用于拖拽标记等） */
  renderHeader?: () => React.ReactNode;
}

interface ConfigurableGridProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  onColumnsChange?: (columns: ColumnDef<T>[]) => void;
  rowKey: string | ((row: T) => string);
  onRowClick?: (row: T) => void;
  sortable?: boolean;
  className?: string;
}
```

#### 1.1 编辑器：`ColumnPicker`

弹出面板，支持：
- 已有列的 ✓ 勾选显隐
- 拖拽排序（HTML5 DnD，零外部依赖起步）
- 添加自定义列（填列名 + 数据字段 + 格式预设）
- 实时预览
- 导出为 JSON

#### 1.2 格式预设：`ColumnFormats`

```tsx
const FORMAT_PRESETS = {
  number:       { align: 'right', font: 'mono', /* 千分位, 2 位小数 */ },
  percent:      { align: 'right', font: 'mono', /* +/-% */ },
  price:        { align: 'right', font: 'mono', color: '涨跌色' },
  changePercent:{ align: 'right', render: ChangeBadge },
  volume:       { align: 'right', font: 'mono', /* 万/亿 自动转换 */ },
  text:         { align: 'left' },
  date:         { align: 'center', /* YYYY-MM-DD */ },
}
```

### 涉及文件
- `packages/react/src/components/configurable-grid.tsx`（新增）
- `packages/react/src/components/column-picker.tsx`（新增）
- `packages/react/src/components/column-formats.ts`（新增）
- `packages/react/src/index.ts`（导出更新）

---

## Phase 2：StockList 重构 + 题牛牛整合

### 目标
在 ConfigurableGrid 之上构建开箱即用的金融股票列表。

### 2.0 `StockList` 组件

继承 ConfigurableGrid 所有能力，额外内置：

```tsx
interface StockListProps extends ConfigurableGridProps<StockRow> {
  /** 预设列集：只传 key 数组就自动配置 */
  presetColumns?: (keyof typeof PRESET_COLUMNS)[];
  /** 分组模式：行业/板块/概念/无 */
  groupBy?: 'industry' | 'sector' | 'concept' | null;
  /** 自选股 ID 集合 */
  watchlistIds?: Set<string>;
  /** 切换自选 */
  onToggleWatchlist?: (id: string) => void;
}
```

#### 2.1 预设列集

```tsx
const STOCK_COLUMNS = {
  code:           { label: '代码', width: 90,  ... },
  name:           { label: '名称', width: 120, ... },
  price:          { label: '最新价', width: 100, format: 'price' },
  change:         { label: '涨跌额', width: 90,  format: 'price' },
  changePercent:  { label: '涨跌幅', width: 90,  format: 'changePercent' },
  volume:         { label: '成交量', width: 100, format: 'volume' },
  turnover:       { label: '成交额', width: 100, format: 'volume' },
  amplitude:      { label: '振幅',  width: 80,  format: 'percent' },
  high:           { label: '最高',  width: 90,  format: 'price' },
  low:            { label: '最低',  width: 90,  format: 'price' },
  open:           { label: '开盘',  width: 90,  format: 'price' },
  volumeRatio:    { label: '量比',  width: 70,  format: 'number' },
  turnoverRate:   { label: '换手率', width: 70, format: 'percent' },
  pe:             { label: 'PE',    width: 80,  format: 'number' },
  pb:             { label: 'PB',    width: 80,  format: 'number' },
  marketCap:      { label: '总市值', width: 100, format: 'volume' },
  circulatedCap:  { label: '流通市值',width: 100, format: 'volume' },
  // 题牛牛特殊列
  ma5:            { label: 'MA5',   width: 90,  format: 'price', color: 'var(--ma5)' },
  ma10:           { label: 'MA10',  width: 90,  format: 'price', color: 'var(--ma10)' },
  ma20:           { label: 'MA20',  width: 90,  format: 'price', color: 'var(--ma20)' },
  ma60:           { label: 'MA60',  width: 90,  format: 'price', color: 'var(--ma60)' },
  bias6:          { label: 'BIAS6', width: 80,  format: 'percent' },
  amplitude:      { label: '振幅',  width: 80,  format: 'percent' },
}
```

用户使用：

```tsx
// 最简：指定预设列
<StockList data={stocks} presetColumns={['code','name','price','changePercent','volume']} />

// 自定义：预设 + 追加自定义列
<StockList data={stocks} presetColumns={['code','name','price']}>
  <CustomColumn key="myIndicator" label="我的指标" format="percent" />
</StockList>

// 完全自定义：全部手动指定
<StockList data={stocks} columns={customColumns} />
```

### 2.2 题牛牛数据对接 (composable)

```tsx
// hooks/useTiniuStockList.ts
function useTiniuStockList(): {
  data: StockRow[];
  columns: ColumnDef<StockRow>[];
  loading: boolean;
  error?: Error;
  refresh: () => void;
}
```

用户一行代码接入真实行情：

```tsx
function MyWatchlist() {
  const { data, columns, loading } = useTiniuStockList();
  return <StockList data={data} columns={columns} loading={loading} />;
}
```

---

## Phase 3：指标展示体系

### 目标
专业级指标视觉组件，不开指标计算引擎，用户只需传入数值。

### 3.0 `IndicatorPanel`

```tsx
interface IndicatorConfig {
  key: string;
  label: string;
  type: 'macd' | 'rsi' | 'kdj' | 'volume' | 'ma' | 'custom';
  /** MACD 参数 */
  params?: Record<string, number>;
  /** 是否在 chart 下方显示 */
  pane?: 'main' | 'sub';
  height?: number;
}

// 用法
<KLineChart data={klineData}>
  <IndicatorPanel config={[
    { key: 'volume', type: 'volume', pane: 'sub', height: 60 },
    { key: 'macd', type: 'macd', pane: 'sub', height: 100 },
  ]} />
</KLineChart>
```

### 3.1 内置指标组件

| 组件 | 渲染 | 说明 |
|---|---|---|
| `MACDPanel` | 柱状图 + 金叉死叉标记 | 数据格式: `{dif, dea, macd}[]` |
| `RSIPanel` | 折线 + 超买70/超卖30区 | 数据格式: `number[]` |
| `KDJPanel` | 三线交叉 | 数据格式: `{k, d, j}[]` |
| `VolumePanel` | 成交量柱 + 涨跌色 | 数据格式: `{volume, change}[]` |
| `MAPanel` | K 线叠加 MA 线 | 是 KLineChart 的内置装饰，非独立面板 |

---

## Phase 4：配置标准化 + 开放生态

### 4.0 JSON Schema 标准

定义 `StockListConfig`、`DashboardConfig` 等配置格式的 JSON Schema，让组件消费配置、导出配置。

```json
{
  "$schema": "https://libra.design/schemas/stocklist.json",
  "columns": [
    { "key": "code", "visible": true, "width": 90, "order": 0 },
    { "key": "price", "visible": true, "width": 100, "order": 2 },
    { "key": "myIndicator", "visible": true, "width": 80, "label": "我的指标", "format": "percent" }
  ],
  "groupBy": "industry",
  "sortBy": "changePercent",
  "sortDir": "desc"
}
```

### 4.1 GitHub 社区化

| 文件 | 用途 |
|---|---|
| `CONTRIBUTING.md` | 贡献指南、PR 流程 |
| `STOCK_COLUMNS.md` | 预设列目录，社区可提交新列预设 |
| `INTEGRATION.md` | 集成指南（Storybook / Retool / 自定义） |
| `examples/` | 完整示例项目 |
| GitHub Issues 模板 | Feature request / New column preset / Bug report |

### 4.2 NPM 发布策略

```
@libra-design/react          ← 核心包（持续更新）
@libra-design/stock-presets  ← 股市预设列（可由社区维护）
@libra-design/indicators     ← 指标面板（独立包，可 tree-shake）
@libra-design/config-schema  ← JSON Schema 定义
```

---

## Phase 5：可视化工具（未来）

### 目标
拖拽生成看盘界面的画布程序。

### 思路
- 不自己造轮子，先用 **Storybook Controls + 自定义 addon** 做配置界面
- 后续考虑 **React Studio** 插件 或 自建轻量画布
- 开放配置格式，让 Retool / Plasmic 可以接入

---

## 版本里程碑

| 版本 | 内容 | 目标时间 |
|---|---|---|
| v0.2.0 | Phase 1: ConfigurableGrid + ColumnPicker | 当前 sprint |
| v0.3.0 | Phase 2: StockList + 题牛牛整合 | Phase 1 后 |
| v0.4.0 | Phase 3: 指标展示体系 | Phase 2 后 |
| v0.5.0 | Phase 4: JSON Schema + 社区文档 | Phase 3 后 |
| v1.0.0 | 以上全部稳定 + Storybook 示例完整 | — |

---

## 核心原则

1. **不开指标计算引擎** — 展示层只消费数据，用户自选来源
2. **可组合 > 大而全** — hooks + 组件两层，用户可以只用一个 hook
3. **配置与代码等价** — JSON Schema 和 JSX 两种用法都支持
4. **预设 + 扩展** — 常用列我们预制，特色列用户自己加
5. **零外部拖拽依赖起步** — HTML5 DnD，后续可按需升级 dnd-kit
