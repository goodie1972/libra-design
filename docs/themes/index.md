# Theme Registry

Libra Design 内置 **10 套命名金融主题**，每套包含 17 个暗色端点 + 17 个亮色端点色值。

## 主题列表

| ID | 名称 | 风格 |
|----|------|------|
| terminal | Terminal | Bloomberg Terminal 黑底琥珀 |
| ticker | Ticker | 交易所大屏深蓝亮白 |
| vault | Vault | 私人银行暖暗金棕 |
| margin | Margin | 保证金交易极致暗红 |
| ledger | Ledger | 账簿报表暖纸白蓝 |
| prospectus | Prospectus | 招股书纯白深蓝 |
| arbitrage | Arbitrage | 量化套利高对比赛紫 |
| circuit | Circuit | 80 年代 CRT 绿字黑底 |
| candlestick | Candlestick | K 线图表深灰金黄 |
| clearing | Clearing | 清算所 B2B 灰白专业 |

## 使用方法

### Go

```go
theme, err := tokens.GetTheme("terminal")
if err == nil {
    fmt.Println(theme.Dark.BgRoot) // #0c0c0e
}

all := tokens.AllThemes() // 全部 10 套
```

### Rust

```rust
use libra_tokens::themes;

// 编译时嵌入，零文件 I/O
let theme = themes::get_theme("ticker").unwrap();
println!("{}", theme.dark.bg_root); // #0a1628

let ids = themes::list_themes(); // ["arbitrage", "candlestick", ...]
```

### TypeScript

```ts
import { applyTheme, getTheme, listThemes } from '@libra-design/theme'

applyTheme('candlestick')

const theme = getTheme('circuit')
console.log(theme.dark.accent) // #22c55e
```
