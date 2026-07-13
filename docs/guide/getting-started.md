# 快速开始

## 选择你的语言

### Go

```go
package main

import (
    "github.com/goodie1972/go-tokens"
    "github.com/goodie1972/go-templ/components"
)

func main() {
    // 使用色值常量
    bg := tokens.ColorBgRoot // #0c0c0e

    // 使用组件
    btn := components.Button("default", "lg", false, nil)
}
```

### Rust

```rust
use libra_tokens::{colors::dark, themes, css};

fn main() {
    // 色值常量
    let bg = dark::BG_ROOT;

    // 编译时嵌入的主题
    let all = themes::all_themes();
    println!("共 {} 套主题", all.len());

    // 生成 CSS
    let css_str = css::generate_css();
    println!("{}", css_str);
}
```

### TypeScript

```ts
import { applyTheme, getTheme, listThemes } from '@libra-design/theme'
import { applyMix } from '@libra-design/theme/mixer'

// 切换主题
applyTheme('ticker')

// 调整亮暗混合
applyMix(0.7) // 70% 暗色
```
