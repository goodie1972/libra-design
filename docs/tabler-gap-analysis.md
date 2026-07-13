# Tabler 对标差距分析

> 对比目标：[Tabler UI v1.4.0](https://docs.tabler.io/ui/components) — 开源 Bootstrap 5 面板组件库（100+ 组件）
>
> 对比基准：Libra React 包 `@libra-design/react`（74 个组件 + 子组件）

---

## 一、组件覆盖总览

### 1.1 Tabler 有 → Libra 无（遗漏项）

| Tabler 组件 | 类别 | 说明 | 替代方案 |
|------------|------|------|---------|
| **Autosize** | Form | textarea 自动增高 | 可用 `textarea` + 第三方，但无官方封装 |
| **Carousel** | Display | 图片/内容轮播 | 完全缺失 |
| **Charts** | Display | ApexCharts 封装（通用折线/柱/饼图） | 我们只有金融图表（K线/深度/分时） |
| **Countup** | Animation | 数字滚动动画 | 完全缺失 |
| **Data Grid** | Layout | 响应式数据网格 | 完全缺失 |
| **Dropzone** | Form | 拖拽文件上传 | 完全缺失 |
| **Inline Player** | Media | 轻量视频播放器 | 完全缺失 |
| **Ribbons** | Decoration | 角标装饰条 | 完全缺失 |
| **Spinners** | Feedback | 加载旋转器 | 完全缺失（只用 `Skeleton`） |
| **Statuses** | Display | 状态指示圆点 | 完全缺失 |
| **Switch Icon** | Action | 图标平滑切换动画 | 我们的 `Toggle` 不同 |
| **Tracking** | Display | 活动跟踪条 | 完全缺失 |
| **Vector Maps** | Data | jsVectorMap 封装 | 完全缺失 |
| **WYSIWYG** | Form | 富文本编辑器 | 完全缺失 |

**小计：14 个 Tabler 组件在 Libra 无对应实现。**

### 1.2 Tabler 无 → Libra 有（超额项）

Libra 的金融/量化组件 Tabler 全部没有：

| 分类 | 组件 | 数量 |
|------|------|------|
| **金融图表** | KLineChart, DepthChart, TimeShareChart | 3 |
| **金融数据** | OrderBook, MarketBoard, StockTable, LiveTicker, Heatmap, HeatmapSector, MarketTable | 7 |
| **金融交易** | OrderForm, PositionCard, Watchlist, DataCard, Screener, StockCard, PriceDisplay, ChangeBadge | 8 |
| **量化分析** | KPICard, WinRateCard, ProfitFactorCard, DrawdownCard, StrategyRankingCard, TypePill, ExchangeTag, OrderStatusTag | 8 |
| **UI 扩展** | DockPanel, Command, Calendar, MiniChart, NewsFeed, ThemeSwitcher, Watermark, Tag | 8 |

**小计：34 个 Libra 组件在 Tabler 无对应实现。**

### 1.3 双方都有（已覆盖）

| 分类 | 组件 |
|------|------|
| **基础** | Button, Badge, Avatar, Icon |
| **导航** | Breadcrumb, DropdownMenu, Tabs, Pagination, Steps |
| **布局** | Card, Divider, Layout (Header/Sider/Content/Footer), Space, Flex |
| **表单** | Input, Select, Textarea, Checkbox, RadioGroup, Switch, Slider, DatePicker, Form |
| **浮层** | Modal, Drawer (≈ Offcanvas), Tooltip, Popover, Collapsible |
| **反馈** | Alert, Toast, Progress, Skeleton (≈ Placeholder) |
| **数据** | Table, Segmented, Timeline, Empty, Accordion |
| **覆盖数** | ~35 组双方均有对应实现 |

---

## 二、深度差距（Tabler 有而我们不足的）

### 2.1 Form 体系

| 维度 | Tabler | Libra |
|------|--------|-------|
| 验证 | `is-invalid` + `invalid-feedback` Bootstrap 标准 | 仅 boolean `hasError`，无消息 |
| Input mask | `imask` 集成 | 无 |
| Color check | 色块选择器 | 无 |
| Image check | 图片选择卡片 | 无 |
| Selectgroup | 按钮组替代下拉 | 无 |
| Fieldset | `<fieldset>` 分组样式 | 无 |
| 提示文本 | `.form-hint` | 无 |
| Label 绑定 | `.form-label` | 有 `Label` 但未绑定验证 |

### 2.2 动效

| 维度 | Tabler | Libra |
|------|--------|-------|
| 数字动画 | Countup.js 集成 | 无 |
| 图标切换 | `.switch-icon` 两态动画 | 有 Toggle 但独立 |
| 加载态 | Spinner (CSS) + Placeholder (skeleton) | 仅 Skeleton |

### 2.3 无障碍

| 维度 | Tabler | Libra |
|------|--------|-------|
| Focus trap | Bootstrap modal 内置 | Modal/Drawer 无 |
| aria 属性 | 随 Bootstrap 标准 | Partial（Button/Modal/Drawer 有基本 aria） |
| Keyboard | Bootstrap 标准 | 零散（Slider/StockCard/NewsFeed） |

### 2.4 插件生态

Tabler 有官方插件：Flags（国旗）、Payments（支付图标）、Social Icons。Libra 无。

---

## 三、差距优先级排序

```
紧急（阻碍用户使用）：
  ├── Spinner ─── 任何 loading 都需要
  ├── Form validation ─── Form 组件无法独立使用
  ├── Focus trap ─── Modal/Drawer a11y 违规
  └── Status dot ─── 金融 UI 高频需求

重要（补齐体验）：
  ├── Countup ─── 数字报价震荡动画
  ├── Image/Color check ─── 交易品种筛选
  ├── Selectgroup ─── 时间周期切换（1m/5m/15m...）
  └── Input mask ─── 金额格式化输入

次要（长尾）：
  ├── Ribbons, Tracking ─── 装饰性
  ├── Carousel, Inline Player ─── 非金融场景
  ├── Vector Maps, WYSIWYG ─── 重依赖第三方
  └── Dropzone ─── 文件上传

超额（Tabler 无）：
  └── 金融/量化 34 组件 ─── 保持优势
```

---

## 四、建议实施顺序

**Phase A**（UX 基础设施，见 `ux-strategy.md` 同步实施）：

| 新增组件 | 依赖 | 估值 |
|---------|------|------|
| `<Spinner>` | CSS only | ~40 行 |
| `<StatusDot>` | CSS only | ~30 行 |
| `<CountUp>` | 无 | ~60 行 |
| `<SelectGroup>` | 无 | ~50 行 |
| `<FormItem>` + `useFormValidation` | `useControllableState` | ~120 行 |
| `<ImageCheck>` / `<ColorCheck>` | 无 | ~50 行 |

**Phase B**（UX hooks 注入后）：

| 新增组件 | 依赖 | 说明 |
|---------|------|------|
| `<Dropzone>` | `useClickOutside` | 拖拽上传 |
| `<InputMask>` | `useControllableState` | 金额/日期输入 |
| `<DataGrid>` | `useBreakpoint` | 响应式网格 |
| `<Ribbon>` | CSS only | 角标装饰 |

**Phase C**（第三方集成）：

| 新增组件 | 依赖 | 说明 |
|---------|------|------|
| Charts（通用） | ApexCharts 或其他 | 通用折线/柱/饼图 |
| Vector Maps | jsVectorMap | 地理数据 |
| WYSIWYG | Tiptap/Quill | 富文本 |
| Carousel | 轻量 | 图片轮播 |

---

## 五、结论

- **数量**：Tabler ~38 UI 组件 + Form 工具，Libra 74+ 组件（含 34 金融/量化）
- **遗漏 14 个**，其中紧急 4 个（Spinner、StatusDot、Form validation、Focus trap）
- **Tabler 是通用面板**，Libra 专注金融场景，重叠 ~35 组，超额 34 组
- **14 个遗漏中的优先级**：Phase A 完成 6 个轻量组件 + 验证系统，其余 Phase B/C
