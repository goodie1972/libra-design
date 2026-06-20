# @libra-design/react

> 64 个 React 金融组件 — 涵盖 K 线图/深度图/订单簿/自选股/热力图等 22 个金融专有组件

Libra Design 的 React 组件库，面向金融数据展示和交易界面设计。A 股惯例红涨绿跌，暗色优先，数据密度优先。

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
