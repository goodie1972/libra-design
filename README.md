# Libra Design

> **极致审美的设计语言，专为Go/Rust量身定制。** 多语言金融设计系统——一份令牌，全语言消费。
>
> JS/TS 设计系统是红海（50+ 竞品），Go/Rust 领域目前是**零**。Libra 从这里打进去。

**Libra** 是一套面向金融数据的多语言设计系统：**Go 原生色值引擎 + Rust 原生组件（开发中）+ React 组件库 + MCP AI 集成**。核心资产不是 React 组件——是**色值体系 + 双主题混合引擎 + 金融审美**，抽离为语言无关的 JSON，从 Go 单点突破。

```
设计令牌 JSON（语言无关）
    ├── Go  track  → go-tokens / go-templ / go-cli / go-mcp
    ├── Rust track → rust-tokens / rust-leptos（Phase C）
    └── TS  track  → @libra-design/tokens / theme / react / cli
```

## 为什么选 Go/Rust 原生？

| 维度 | npm 生态 | Libra Go/Rust |
|------|----------|---------------|
| **语言绑定** | 仅 JS/TS | Go · Rust · TS 三语言 |
| **安装方式** | `npm install`（200MB node_modules） | `go get` 零依赖 / `cargo add` |
| **CLI 体积** | Node 运行时 + node_modules | 单二进制 ~8MB，无外部依赖 |
| **颜色计算** | JS 单线程 | Go/Rust 原生性能，批量插值零开销 |
| **MCP Server** | npm 包 + npx 启动 | Go 单二进制，10ms 冷启动 |
| **后端集成** | 需要 Node 桥接 | Go 服务直接 import，同进程零开销 |
| **AI Agent 消费** | 需安装 npm 工具链 | MCP Server 单文件部署 |

**核心理念**：Go/Rust 开发者不应该为了用一套设计令牌而引入整个 Node 生态。Libra 让你在 `main.go` 或 `lib.rs` 里直接 `import` 色值常量，不需要 `npm install`。

---

## 包矩阵

| 包 | 语言 | 功能 | 安装 |
|---|------|------|------|
| `@libra-design/tokens` | TS | CSS 变量 + 类型定义 | `npm i @libra-design/tokens` |
| `@libra-design/theme` | TS | 双主题混合引擎 | `npm i @libra-design/theme` |
| `@libra-design/react` | TS | 40+ React 金融组件 | `npm i @libra-design/react` |
| `@libra-design/cli` | TS | `libra init/add` 命令 | `npx @libra-design/cli init` |
| `@libra-design/mcp-server` | TS | MCP Server for AI | `npx @libra-design/mcp-server` |
| `go-tokens` | **Go** | 色值常量 + LerpColor + CSS 生成 | `git clone → go build` |
| `go-templ` | **Go** | 40 个金融 templ 组件 | `git clone → go build` |
| `go-cli` | **Go** | 单二进制 `libra init` CLI | `git clone → go build` |
| `go-mcp` | **Go** | MCP Server 单二进制 | `git clone → go build` |
| `rust-tokens` | **Rust** | crate，build.rs 读取 tokens JSON | Phase C |
| `rust-leptos` | **Rust** | 10 个 Leptos 金融组件 | Phase C |

---

## Go 开发者 — 5 秒上手

```bash
# 克隆仓库并在本地构建（单二进制）
git clone https://github.com/goodie1972/libra-design
cd libra-design/packages/go-cli
go build -o libra.exe .
./libra.exe init  # → tokens.css
```

```templ
// Go templ 金融组件
@components.Button("default", "lg", false, nil) { 买入 }
@components.PriceDisplay(128.50, 2.35, "up")
@components.StockCard("600519", "贵州茅台", 1680.00, 2.15, "1.25B")
```

---

## Rust 开发者 — 即将到来

```rust
// Phase C 预览
use libra_tokens::colors::DARK_ENDPOINT;
use libra_tokens::lerp_color;

let bg = lerp_color(&DARK_ENDPOINT.bg_root, &LIGHT_ENDPOINT.bg_root, 0.7);
```

---

## 设计哲学

| 原则 | 含义 |
|------|------|
| **一页一主角** | 每页只有一个视觉重心，K 线页主角是图表 |
| **数据优先** | 装饰服务于数据，不抢戏 |
| **间距即语言** | 4px 为基数，间距大小 = 信息亲密度 |
| **减法制造张力** | 层次靠明度差和间距，不靠颜色多 |

**风格锚定**：Linear（暗色体系）+ Stripe（金融排版）+ Bloomberg Terminal（金融数据基因）

---

## 色彩系统

A 股惯例 — **红涨绿跌**。全界面只有涨（红）和跌（绿）两种有彩色，其余全部中性。

| Token | 色值 | 用途 |
|-------|------|------|
| `--up` | `#ef5350` | 涨/阳线/正值 |
| `--down` | `#26a69a` | 跌/阴线/负值 |
| `--flat` | `#9e9e9e` | 平盘 |

### 双主题混合

通过 gamma-aware 颜色插值，在暗色和亮色端点之间平滑过渡：

```
暗色 (t=0)  ──────── 柔光 (t=0.7) ──────── 亮色 (t=1)
#0d0e10      渐进过渡    #f8f9fb      渐进过渡    #ffffff
```

- **背景色**：gamma-aware 插值（`sqrt` 加权）
- **文字色**：线性 RGB 插值 + 五次方加速曲线
- **边框**：gamma-aware 插值 + 平方加速曲线

---

## 项目结构

```
libra/
├── tokens/                  # design-tokens.json（语言无关，单一事实源）
├── packages/
│   ├── tokens/              # @libra-design/tokens — CSS 变量 + TS 类型
│   ├── theme/               # @libra-design/theme — 双主题混合引擎
│   ├── react/               # @libra-design/react — 40+ React 金融组件
│   ├── cli/                 # @libra-design/cli — TS CLI
│   ├── mcp-server/          # @libra-design/mcp-server — TS MCP Server
│   ├── go-tokens/           # Go 原生色值引擎（零 npm 依赖）
│   ├── go-templ/            # Go templ 金融组件（服务器端渲染）
│   ├── go-cli/              # Go 单二进制 CLI（libra init）
│   └── go-mcp/              # Go 单二进制 MCP Server
└── docs/                    # 设计文档
```

---

## 许可

MIT
