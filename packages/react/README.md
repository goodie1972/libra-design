# @libra-design/react

> 金融交易终端组件库 — 在 React 中构建专业级行情/交易界面，开箱即用

跳过图表引擎搭建和交易 UI 样板代码。64 个组件覆盖 K 线、深度图、订单簿、行情表格、筛选器、分时图、热力图等全场景 — 从数据展示到交易交互，一行代码接入。

```bash
npm install @libra-design/react
```

[📖 组件清单](#组件清单64-个) · [🚀 Demo](https://your-demo-url) · [📚 Storybook](https://your-storybook-url) · [⭐ GitHub](https://github.com/your-repo)

---

## 为什么用 Libra？

| 场景 | 传统方式 | Libra |
|------|----------|-------|
| **K 线图** | 集成 echarts/highcharts，配数据转换 + 均线计算 + 成交量柱 + tooltip | `<KLineChart data={ohlcv} />` |
| **行情表格** | antd Table + 自定义排序/列固定/虚拟滚动/格式/多选/筛选/拖拽 | `<StockTable data={stocks} />` |
| **分时图** | d3/svg 手绘坐标轴、网格线、成交量、均价线 | `<TimeShareChart data={ticks} />` |
| **深度图** | canvas 手动计算买卖盘口聚合 | `<DepthChart data={levels} />` |
| **主题** | 自行设计 token 系统 + CSS 变量 + 暗色/亮色切换 | 内置 10 套金融主题 + mix 滑块 |
| **行点击弹窗** | 手动 useState + Modal + Tabs 拼装 | `<StockTable onRowClick={...} />` → Modal |

## 适合谁用？

- **量化/交易团队** — 快速搭建投研看板、监控面板、回测结果页
- **金融 SaaS 产品** — 嵌入行情展示、订单管理、账户概览
- **个人投资者/极客** — 自建交易工具、数据聚合仪表盘

## 特性一览

- 🎯 **64 个组件** — 22 个金融专有组件（K线/分时/深度/订单簿/热力图/行情表/筛选器等）
- 🎨 **红涨绿跌** — A 股惯例，暗色优先，数据密度优化
- 🔄 **10 套主题** — terminal / ticker / vault / margin / ledger 等命名主题 + 亮暗 mix 滑块
- 📊 **ConfigurableGrid** — 排序/固定/宽拖拽/虚拟滚动/行展开/列分组/键盘导航/多选/筛选/拖拽/条件着色
- 🧩 **TypeScript** — 完整类型导出，泛型 ColumnDef\<T\>
- 🌙 **暗色优先** — 全组件 dark mode 开箱即用
- ⚡ **零依赖侵入** — 纯 CSS 变量主题，不与 antd/arco 等设计体系冲突

## 安装

```bash
npm install @libra-design/react
```

配合设计令牌和主题引擎一起使用：

```bash
npm install @libra-design/tokens @libra-design/theme
```

## 快速上手

```tsx
import { KLineChart, OrderBook, Badge, Button } from '@libra-design/react';
import '@libra-design/tokens/css';

function App() {
  return (
    <>
      <Badge variant="up">+2.13%</Badge>
      <Button variant="default">买入</Button>
      <KLineChart data={ohlcvData} width={800} height={400} />
    </>
  );
}
```

## 行点击弹出详情（分时/K 线）

```tsx
import { useState } from 'react';
import { StockTable, Modal, Tabs, TimeShareChart, KLineChart } from '@libra-design/react';
import type { StockTableRow } from '@libra-design/react';

function App() {
  const [stock, setStock] = useState<StockTableRow | null>(null);
  return (
    <>
      <StockTable data={data} onRowClick={(row) => setStock(row)} />
      <Modal open={!!stock} onClose={() => setStock(null)}
        title={`${stock?.name} (${stock?.code})`}>
        <Tabs
          tabs={[
            { value: 'timeshare', label: '分时',
              content: <TimeShareChart data={...} width={580} height={300} /> },
            { value: 'kline', label: 'K线',
              content: <KLineChart data={...} width={580} height={360} /> },
          ]}
        />
      </Modal>
    </>
  );
}
```

## 主题切换

```tsx
import { ThemeSwitcher } from '@libra-design/react';

// 10 套命名金融主题：terminal / ticker / vault / margin / ledger /
// prospectus / arbitrage / circuit / candlestick / clearing
<ThemeSwitcher
  themeId="terminal"
  preset="dark"
  onThemeChange={(id) => console.log('theme:', id)}
  onPresetChange={(p) => console.log('preset:', p)}
/>
```

也可通过 `@libra-design/theme` 的 `applyPreset('terminal')` / `applyMix(t)` API 编程控制。

## 组件清单（64 个）

### 基础 (11)

| 组件 | 说明 |
|------|------|
| `Button` | 按钮 — default/secondary/ghost/danger 变体，sm/lg/icon 尺寸 |
| `Card` / `CardHeader` / `CardTitle` / `CardContent` | 卡片容器 |
| `Badge` | 状态标签 — up/down/flat/success/warning/error |
| `Tag` | 标签 — 支持 onRemove |
| `Input` | 输入框 — prefix/hasError |
| `Textarea` | 多行文本 — showCount/maxLength/hasError |
| `Checkbox` | 多选框组 |
| `RadioGroup` | 单选框组 — default/button 变体 |
| `Slider` | 滑块 |
| `Switch` | 开关 |
| `Select` | 下拉选择 |

### 交易终端 (5)

| 组件 | 说明 |
|------|------|
| `ConfigurableGrid` | 通用可配置表格 — 泛型 ColumnDef<T>、排序、列宽拖拽、sticky 列固定、CSS 变量主题。**Phase 2 扩展：** 虚拟滚动（1 万+行）、行展开（▸/▾ 箭头 + renderDetail 详情行，受控+非受控）、列分组（ColumnDef.children 递归 + colSpan/rowSpan 多级表头）、列状态 localStorage 自动持久化、columnPicker prop 一键齿轮按钮集成。**Phase 4 扩展：** 键盘导航（ArrowUp/Down/Home/End 焦点移动 + ScrollIntoView + Escape 取消焦点）、多选（Ctrl+Click/Shift+Click/Space 切换 + Ctrl+A 全选）、selectedKeys 受控 + showCheckbox 复选框列 + 表头全选、列组折叠（ColumnGroupable + collapsedGroups Set + ▶/▼ 切换）、表头筛选（filterable 标记 + filterValues state）、列拖拽排序（HTML5 DnD）、条件着色（ColumnConditionalColor 阈值匹配 + 自动 color/bg） |
| `ColumnPicker` | 列编辑器弹层 — HTML5 DnD 拖拽排序、行内编辑（标签/宽度/对齐/固定/格式）、3 套预设方案、导出 JSON、自定义列添加 |
| `ColumnFormats` / `FORMAT_PRESETS` | 7 种格式预设 — number/percent/price/changePercent/volume/text/date，含 format 和 render 函数 |
| `COLUMN_PRESETS` | 3 组列预设（常用/完整/简洁）— 内置典型行情的列定义模板 |
| `StockTable` | 行情表格组件，基于 ConfigurableGrid 封装。自动应用价格/涨跌幅/成交量等格式预设，支持列固定/排序/虚拟滚动/行展开。开箱即用：`<StockTable data={data} showExtra columnPicker />` |

### 金融展示 (12)

| 组件 | 说明 |
|------|------|
| `PriceDisplay` | 价格展示 — 含涨跌额/涨跌幅/箭头 |
| `ChangeBadge` | 涨跌标签 |
| `StockCard` | 股票卡片 — 代码/名称/价格/涨跌/成交量 |
| `Statistic` | 数值统计 — 前缀/后缀/精度/趋势 |
| `MarketTable` | 行情表格 — 排序/自定义列/对齐 |
| `KLineChart` | K 线图 — OHLCV + MA5/10/20/60 均线 |
| `DepthChart` | 深度图 — 买卖盘口 |
| `TimeShareChart` | 分时图 — 日内走势 |
| `StockTable` | 股票列表表格 |
| `MarketBoard` | 市场概览板 — 三档行情 |
| `OrderBook` | 订单簿 — 买卖挂单 |
| `Heatmap` | 热力图 |

### 金融深度 (8)

| 组件 | 说明 |
|------|------|
| `OrderForm` | 下单面板 — 价格/数量/方向 |
| `PositionCard` | 持仓卡片 |
| `LiveTicker` | 实时行情滚动 |
| `HeatmapSector` | 板块热力图 |
| `Watchlist` | 自选股监控列表 |
| `MiniChart` | 内嵌迷你走势图 |
| `NewsFeed` | 快讯流 |
| `Screener` | 股票筛选器 |

### 导航 (5)

| 组件 | 说明 |
|------|------|
| `Breadcrumb` | 面包屑导航 |
| `Pagination` | 分页 |
| `DropdownMenu` | 下拉菜单 — 分隔线/快捷键 |
| `Tabs` | 标签页 |
| `Accordion` | 手风琴折叠面板 |

### 反馈 (5)

| 组件 | 说明 |
|------|------|
| `Alert` | 警告提示 — info/success/warning/error |
| `Modal` | 模态对话框 — sm/md/lg |
| `Tooltip` | 文字提示 — top/bottom |
| `Progress` | 进度条 — 线性/圆形 |
| `Skeleton` / `SkeletonCard` | 骨架屏 |

### 数据展示 (3)

| 组件 | 说明 |
|------|------|
| `Avatar` | 头像 — fallback/图片 |
| `Empty` | 空状态 |
| `DataCard` | 数据摘要卡片 |

### 布局 (4)

| 组件 | 说明 |
|------|------|
| `Table` / `TableHeader` / `TableHead` / `TableRow` / `TableCell` | 表格 |
| `Divider` | 分割线 — horizontal/vertical/label |
| `Space` | 间距容器 |
| `Flex` | 弹性布局 — direction/gap/justify/align/wrap |

### 表单 (2)

| 组件 | 说明 |
|------|------|
| `Label` | 表单标签 |
| `Form` | 表单容器 — vertical/horizontal 布局 |

### 反馈 & 流程 (2)

| 组件 | 说明 |
|------|------|
| `Steps` | 步骤条 |
| `Timeline` | 时间线 |

### 金融日历 & 交互 (2)

| 组件 | 说明 |
|------|------|
| `Calendar` | 财报日历 — 月份视图 + earnings/dividend 事件标记 |
| `DockPanel` | 可拖拽分割面板 |

### 命令 & 覆盖层 (10)

| 组件 | 说明 |
|------|------|
| `Command` | 命令面板（⌘K 风格） |
| `Popover` | 气泡弹出 |
| `Drawer` | 抽屉 |
| `Collapsible` | 折叠容器 |
| `Toggle` | 切换按钮 |
| `Segmented` | 分段控制器 |
| `DatePicker` | 日期选择器 |
| `ThemeSwitcher` | 主题切换器 — 10 套命名主题 + 亮暗预设 + mix 滑块 |
| `Watermark` | 全屏水印 — 合规免责 |
| `Toast` / `Toaster` | 轻提示 — success/error/info/loading |

## 开发

```bash
# 构建
npm run build

# 开发（watch）
npm run dev

# 测试（133 用例）
npm test

# Storybook 开发
npm run storybook

# 构建 Storybook 静态站
npm run build-storybook

# 生成 API 文档
npm run docs:api
```

## TypeScript

所有组件均以 TypeScript 编写，导出类型定义（`declaration: true`）。`Props` 接口与组件同名导出：

```tsx
import type { KLineChartProps, KLineData, OrderBookProps, OrderLevel } from '@libra-design/react';
```

## 相关包

| 包 | 说明 |
|---|------|
| `@libra-design/tokens` | CSS 变量 + TypeScript 类型 |
| `@libra-design/theme` | 双主题混合引擎 + 10 套命名主题 |
| `@libra-design/cli` | `libra init / add` CLI |
| `@libra-design/mcp-server` | MCP Server for AI Agent |

## 许可

MIT
