# go-tokens — Libra Go 原生色值引擎

> Go 开发者零 npm 依赖使用 Libra 设计令牌。无需 `npm install`，无需 Node 运行时。

## 为什么不用 npm 版本？

JS/TS 设计系统 50+ 竞品。Go 原生设计令牌——**零**。

`go-tokens` 让 Go 后端开发者直接在代码里 import 色值常量、做颜色插值、生成 CSS 文件。不需要引入整个 Node 生态。

## 安装

```bash
go get github.com/libra/go-tokens
```

## API

```go
import "github.com/libra/go-tokens"

// 语义色常量
tokens.ColorUp      // "#ef5350" — 涨/阳线/正值
tokens.ColorDown    // "#26a69a" — 跌/阴线/负值
tokens.ColorMA5     // "#f8b500" — 5 日均线
tokens.ColorSuccess // "#34a853" — 成功
tokens.ColorError   // "#ea4335" — 错误

// 暗色端点
tokens.DarkBgRoot      // "#0c0c0e"
tokens.DarkTextPrimary  // "#e8e8ed"
tokens.DarkAccent       // "#4a6cf7"

// 亮色端点
tokens.LightBgRoot      // "#f5f5f7"
tokens.LightTextPrimary  // "#0d0d12"
tokens.LightAccent       // "#533afd"

// 颜色运算
mid := tokens.LerpColor("#0c0c0e", "#ffffff", 0.5)  // → "#858586"
ratio := tokens.LerpLinear(0, 100, 0.35)              // → 35.0
px := tokens.RoundToSpacing(13.7)                      // → 12（对齐到 4px 倍数）

// CSS 生成
css := tokens.GenerateCSS()
os.WriteFile("tokens.css", []byte(css), 0644)
// 输出 78 个 CSS 自定义属性，与 @libra-design/tokens 完全一致
```

## 设计令牌

底层 `design-tokens.json` 是语言无关的单一事实源。Go 包将其嵌入二进制（`//go:embed`），编译后无需额外文件。

```
design-tokens.json (语言无关)
    ├── go-tokens   ← 你在这里
    ├── rust-tokens (Phase C)
    └── @libra-design/tokens (npm)
```

## 与 npm 版本的对应关系

| npm | Go |
|-----|-----|
| `import '@libra-design/tokens/css'` | `tokens.GenerateCSS()` |
| `SEMANTIC_COLORS.up` | `tokens.ColorUp` |
| `DARK_ENDPOINT['bg-card']` | `tokens.DarkBgCard` |
| `applyMix(t)` 主题混合 | `tokens.LerpColor(dark, light, t)` |

## 许可

MIT
