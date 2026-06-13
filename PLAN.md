# Libra Design 发展路线图

> "如果我们这套系统去替换 Bloomberg Terminal 的设计，能搞定么？"
> —— 这是终极压力测试，也是 Libra Design 的北极星。

## 战略定位

```
JS/TS 设计系统            Go/Rust 设计系统         金融设计系统
(红海, 50+竞品)          (蓝海, 零竞争)           (无人区)

shadcn/ui ─┐            templUI ─┐               Bloomberg Terminal ─┐
Ant Design ┤ ←Libra→    GoShip.it ┤ ←Libra→      TradingView ────────┤
MUI ───────┘            wailsjs ──┘               Wind ───────────────┘

三轴交叉 = 无人区：Go/Rust 原生 + 金融数据深度 + 设计令牌体系
```

Libra Design 的差异化：**不是另一个 React 组件库，是 Go/Rust 原生的金融设计系统。** 核心资产是色值体系 + 双主题混合引擎 + 金融审美，抽离为语言无关的 JSON，Go/Rust/TS 三语言消费。

---

## 当前状态 (2026-06-13)

```
npm 包: 5 个已发布 (@libra-design/* v0.1.0)
Go 包:  4 个 (go-tokens, go-templ, go-cli, go-mcp)
React:  44 组件 + 101 tests
Go:     10 templ 组件
MCP:    3 tools + 2 resources, e2e 验证通过
主题:   1 套暗色端点 + 1 套亮色端点 (无命名预设)
```

---

## 一、主题系统（对标 Terax，10 套命名主题）

### Phase 4 — 当前阶段

#### 4.1 背景

Terax 有 10 套命名主题（Claude, Nord, Gruvbox, Tokyo Night, Catppuccin, Rose Pine 等），每套有独立的 dark/light variants。Libra Design 目前只有一套暗色端点 + 一套亮色端点，通过 `applyMix(t)` 混合。缺少命名预设，用户无法一键切换到不同风格。

#### 4.2 目标

创建 10 套命名主题，每套 = dark_endpoint + light_endpoint 完整色值对。主题命名采用金融术语体系，区别于 Terax 的颜色名称体系。

#### 4.3 10 套主题详细规格

| # | ID | 名称 | 类型 | 灵感来源 | 主色调 | 关键色 | 场景 |
|---|-----|------|------|---------|--------|--------|------|
| 1 | `terminal` | Terminal | 暗色 | Bloomberg Terminal | `#0c0c0e` 黑底 | accent `#f59e0b` 琥珀 | 主力交易终端 |
| 2 | `ticker` | Ticker | 暗色 | 交易所大屏幕 | `#0a1628` 深蓝 | accent `#3b82f6` 蓝 | 实时行情大屏 |
| 3 | `vault` | Vault | 暗色 | 私人银行金库 | `#18181b` 暖暗 | accent `#d4a853` 金棕 | 资产管理/私行 |
| 4 | `margin` | Margin | 暗色 | 保证金交易 | `#09090b` 极致暗 | accent `#ef4444` 红 | 高风险交易 |
| 5 | `ledger` | Ledger | 亮色 | 账簿/票据 | `#faf9f6` 纸白 | accent `#1e40af` 会计蓝 | 清算/对账/报表 |
| 6 | `prospectus` | Prospectus | 亮色 | 招股书/研报 | `#ffffff` 纯白 | accent `#1a1a2e` 深蓝黑 | 研报/分析报告 |
| 7 | `arbitrage` | Arbitrage | 双色 | 套利策略 | 高对比 | accent `#7c3aed` 紫 | 量化/算法交易 |
| 8 | `circuit` | Circuit | 复古 | 80 年代 CRT | `#0a0a0a` 黑 | accent `#22c55e` 绿 | 复古/极客/调试 |
| 9 | `candlestick` | Candlestick | 图表 | K 线配色 | `#0d0e10` 深灰 | accent `#f8b500` MA5金黄 | 嵌入图表的 mini 主题 |
| 10 | `clearing` | Clearing | 中性 | 清算所 | `#f5f5f5` 灰白 | accent `#52525b` 灰 | B2B/后台管理 |

#### 4.4 交付物

```
tokens/themes/
├── terminal.json         # 每个文件 { id, name, description, dark_endpoint, light_endpoint }
├── ticker.json           # 每套覆盖全部 17 个色值 token
├── vault.json            # (bg-root, bg-main, bg-sidebar, bg-card, bg-card-hover,
├── margin.json           #  bg-input, bg-chart, bg-sub-panel, border-main, border-sub,
├── ledger.json           #  border-input, text-primary, text-secondary, text-tertiary,
├── prospectus.json       #  accent, accent-hover, grid-line)
├── arbitrage.json
├── circuit.json
├── candlestick.json
└── clearing.json

packages/theme/src/
├── themes.ts             # 新: 主题注册表 + applyPreset('terminal')
├── mixer.ts              # 改: applyPreset 支持命名主题

packages/react/src/components/
├── theme-switcher.tsx    # 新: ThemeSwitcher 组件（10 套主题选择器）

packages/go-templ/components/
├── themeswitcher.templ   # 新: Go 版 ThemeSwitcher

packages/go-tokens/
├── tokens.go             # 改: 支持加载 theme JSON
```

#### 4.5 验收标准

```bash
# 1. 10 个 JSON 文件合法
python3 -c "import json; [json.load(open(f'tokens/themes/{t}.json')) for t in ['terminal','ticker','vault','margin','ledger','prospectus','arbitrage','circuit','candlestick','clearing']]"

# 2. 每个文件覆盖全 17 色
python3 -c "
themes = ['terminal','ticker','vault','margin','ledger','prospectus','arbitrage','circuit','candlestick','clearing']
for t in themes:
    d = json.load(open(f'tokens/themes/{t}.json'))
    assert len(d['dark_endpoint']) == 17, f'{t} dark missing'
    assert len(d['light_endpoint']) == 17, f'{t} light missing'
print('ALL OK')
"

# 3. npm test → 全部通过
# 4. go build ./... → 全部通过
# 5. applyPreset('terminal') 返回正确颜色
```

---

## 二、组件覆盖（对标 shadcn/Ant Design）

### 目标矩阵

| 平台 | 当前通用 | 当前金融 | 当前总计 | 目标通用 | 目标金融 | 目标总计 |
|------|---------|---------|---------|---------|---------|---------|
| React | 30 | 14 | **44** | 42 | 22 | **64** |
| Go templ | 10 | 0 | **10** | 32 | 8 | **40** |

### Phase 5 — 表单闭环（Go 优先）

**目标**: Go 10 → 25 组件, React 44 → 47 组件

| # | 组件 | 文件 | React | Go | 验证 |
|---|------|------|-------|-----|------|
| 1 | Label | `label.tsx` / `label.templ` | ❌ 新 | ❌ 新 | 与 Input 搭配渲染 |
| 2 | Select | `select.templ` | ✅ | ❌ 新 | 下拉展开+选中高亮 |
| 3 | Textarea | `textarea.templ` | ✅ | ❌ 新 | 多行+resize |
| 4 | Checkbox | `checkbox.templ` | ✅ | ❌ 新 | 勾选+label |
| 5 | RadioGroup | `radiogroup.templ` | ✅ | ❌ 新 | 单选+active指示 |
| 6 | DropdownMenu | `dropdownmenu.templ` | ✅ | ❌ 新 | 弹出+分隔线+快捷键 |
| 7 | Form | `form.tsx` / `form.templ` | ❌ 新 | ❌ 新 | 容器+error状态汇总 |
| 8 | Layout | `layout.templ` | ❌ 新 | ❌ 新 | 导航+内容+底部 |
| 9 | Watermark | `watermark.tsx` / `watermark.templ` | ❌ 新 | ❌ 新 | 全屏半透明文字 |
| 10 | Tooltip | `tooltip.templ` | ✅ | ❌ 新 | hover弹出 |

### Phase 6 — 反馈+数据展示

**目标**: Go 25 → 35 组件, React 47 → 55 组件

| # | 组件 | React | Go | 对标 |
|---|------|-------|-----|------|
| 1 | Alert | ✅ | ❌ 新 | shadcn |
| 2 | Toast | ✅ | ❌ 新 | shadcn |
| 3 | Progress | ✅ | ❌ 新 | shadcn |
| 4 | Skeleton | ✅ | ❌ 新 | shadcn |
| 5 | Switch | ✅ | ❌ 新 | shadcn |
| 6 | Pagination | ✅ | ❌ 新 | shadcn |
| 7 | Tag | ✅ | ❌ 新 | Ant |
| 8 | Empty | ✅ | ❌ 新 | Ant |
| 9 | Statistic | ✅ | ❌ 新 | Ant |
| 10 | Steps | ❌ 新 | ❌ 新 | Ant |
| 11 | Timeline | ❌ 新 | ❌ 新 | Ant |

### Phase 7 — 金融深度 + Bloomberg 对标

**目标**: Go 35 → 40 组件, React 55 → 64 组件

| # | 组件 | 对标 Bloomberg | 说明 |
|---|------|---------------|------|
| 1 | Calendar | 财报日历 | 月份视图 + 事件标记 |
| 2 | DockPanel | 多面板分割 | 可拖拽分割条 |
| 3 | Command | F1-F12 键盘命令 | 命令面板 ⌘K |
| 4 | Watchlist | 自选股监控 | 实时报价+排序 |
| 5 | MiniChart | 内嵌走势 | sparkline SVG |
| 6 | NewsFeed | 快讯流 | 滚动+分类过滤 |
| 7 | DataCard | 数值摘要 | 大数字+副标题 |
| 8 | Screener | 股票筛选 | 多条件+表格结果 |

### Phase 8 — Rust

**目标**: 从 Go 复制经验到 Rust，快速形成三语言覆盖

| 交付物 | 说明 |
|--------|------|
| `rust-tokens/` crate | build.rs 读 design-tokens.json，生成色值常量 |
| `rust-leptos/` crate | 从 Go templ 移植核心 20 组件 |
| 多语言文档站 | Docusaurus/VitePress，Go/Rust/TS 三 tab 代码示例 |

---

## 三、Bloomberg Terminal 终极对标

### 覆盖矩阵

| 功能域 | Bloomberg 功能 | Libra Design 对应 | 状态 |
|--------|---------------|-------------------|------|
| **配色** | 黑底橙字 | Terminal 主题 | ✅ |
| **涨跌** | 红涨绿跌 | --up / --down 语义色 | ✅ |
| **字体** | 等宽数字 | --font-mono + tabular-nums | ✅ |
| **层级** | 多层面板 | 四层表面堆叠体系 | ✅ |
| **K线** | 蜡烛图+均线+成交量 | KLineChart | ✅ |
| **深度** | 买卖盘口 | DepthChart + OrderBook | ✅ |
| **分时** | 日内走势 | TimeShareChart | ✅ |
| **行情** | 市场概览面板 | MarketBoard | ✅ |
| **自选** | 自选股列表 | StockCard + StockTable | ✅ |
| **订单** | 下单面板 | OrderForm | ✅ |
| **持仓** | 持仓管理 | PositionCard | ✅ |
| **热力** | 板块热力图 | HeatmapSector | ✅ |
| **快讯** | 实时新闻流 | NewsFeed | 🔴 P1 |
| **日历** | 财经日历 | Calendar | 🔴 P1 |
| **多面板** | 分割窗口 | DockPanel | 🔴 P0 |
| **命令** | 功能键操作 | Command (⌘K) | 🔴 P0 |
| **自选** | 实时监控 | Watchlist | 🔴 P0 |
| **图表** | 内嵌 sparkline | MiniChart | 🟡 P1 |
| **筛选** | 股票筛选器 | Screener | 🟢 P2 |
| **水印** | 合规免责 | Watermark | 🟡 P1 |
| **回测** | 策略报告 | BacktestReport | 🟢 P2 |

---

## 四、执行时间线

```
Phase 4 ████████████░░░░░░░░░░  主题系统 (当前)
Phase 5 ░░░░░░░░░░░░░░░░░░░░░░  表单闭环
Phase 6 ░░░░░░░░░░░░░░░░░░░░░░  反馈+展示
Phase 7 ░░░░░░░░░░░░░░░░░░░░░░  金融深度
Phase 8 ░░░░░░░░░░░░░░░░░░░░░░  Rust

交付节奏: 每 Phase 完成后:
  1. npm test (101+ tests)
  2. go build ./... (4 包)
  3. templ generate ./... (0 错误)
  4. MCP e2e (initialize → tools/list → tools/call)
  5. libra init (78 CSS 变量输出)
  6. git commit
```

---

## 五、竞品对标

| 维度 | shadcn/ui | Ant Design | templUI | wailsjs | **Libra Design** |
|------|-----------|------------|---------|---------|-----------------|
| 语言 | TS only | TS only | Go+Templ | Go+JS | **Go+Rust+TS** |
| 组件数 | ~40 | ~60 | ~30 | ~10 (绑定Vue) | 44→64 |
| 设计令牌 | ❌ Tailwind | ✅ JSON | ❌ Tailwind | ❌ NaiveUI | ✅ **自研JSON** |
| 主题 | CSS vars | ConfigProvider | ❌ | ❌ 仅暗/亮 | ✅ **10套命名** |
| 金融组件 | ❌ | ❌ | ❌ | ❌ | ✅ **22 个** |
| MCP Server | ❌ | ❌ | ❌ | ❌ | ✅ **Go 原生** |
| CLI | ✅ | ❌ | ✅ | ❌ | ✅ **Go 二进制** |
| 后端集成 | ❌ | ❌ | ✅ Go | ✅ Go | ✅ **Go 零依赖** |
| 安装体积 | 200MB | 200MB | Go binary | 200MB+ | **~8MB CLI** |

---

## 六、每次交付验证命令

```bash
# 全量构建
npm run build

# React 测试
npm -w packages/react run test

# Go 编译 (4 包)
for pkg in go-tokens go-cli go-templ go-mcp; do
  cd packages/$pkg && go build ./... && cd ../..
done

# templ 生成
cd packages/go-templ && templ generate ./... && cd ../..

# CLI 输出验证
go run ./packages/go-cli/cmd/libra/ init --out /tmp/test.css
grep -c '\-\-' /tmp/test.css  # 应 = 78

# MCP 端到端
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1"}}}' | go run ./packages/go-mcp/main.go 2>/dev/null
```
