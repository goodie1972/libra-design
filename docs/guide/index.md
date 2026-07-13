# 简介

Libra Design 是一个**多语言金融设计系统** — 一份设计令牌，Go / Rust / TypeScript 三语言消费。

## 核心原则

1. **一页一主角** — 每页只有一个视觉锚点
2. **细节即信条** — 1px 偏差即是信仰裂缝
3. **间距即呼吸** — 4px 基线确保节奏性留白
4. **克制即力量** — 90% 中性 + 10% 强调 = 100% 清晰

## 设计哲学

| 锚定 | 来源 |
|------|------|
| 暗色体系 | Linear — 深沉但不压抑 |
| 金融排版 | Stripe — 精确、清晰、可信 |
| 数据基因 | Bloomberg Terminal — 信息密度优先 |

全界面只有涨（红 `#ef5350`）和跌（绿 `#26a69a`）两种有彩色，其余全部中性。

## 语言绑定

### Go

```go
package main

import (
    "fmt"
    "github.com/goodie1972/go-tokens"
)

func main() {
    fmt.Println("Up color:", tokens.ColorUp)   // #ef5350
    fmt.Println("Down color:", tokens.ColorDown) // #26a69a
}
```

### Rust

```rust
use libra_tokens::colors::{self, semantic};
use libra_tokens::themes;

fn main() {
    let up = semantic::UP;
    let theme = themes::get_theme("terminal").unwrap();
    println!("{}", theme.dark.bg_root); // #0c0c0e
}
```

### TypeScript

```ts
import '@libra-design/tokens/css'
import { applyTheme } from '@libra-design/theme'
import { Button } from '@libra-design/react'

applyTheme('terminal')
```

## 完整配套

| 模块 | 说明 | 文档 |
|------|------|------|
| **图标** | 三叠层策略：Tabler / Phosphor / Lucide 统一 `<Icon>` 组件 | [图标指南](/guide/icons) |
| **字体** | Inter + JetBrains Mono + 霞鹜文楷 + Noto Sans SC | [字体指南](/guide/fonts) |
| **主题** | 10 套命名金融主题，gamma-aware 双端混合引擎 | [主题系统](/themes/) |
| **组件** | 64+ React / 40+ Go templ / 20+ Rust leptos 金融组件 | [组件概览](/components/) |
