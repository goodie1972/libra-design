# API 参考

## 设计令牌

### Go

- `tokens.ColorUp` — `"#ef5350"`
- `tokens.ColorDown` — `"#26a69a"`
- `tokens.ColorBgRoot` — `"#0c0c0e"`
- `tokens.DarkEndpoint` — 暗色端点 Colors 结构
- `tokens.LightEndpoint` — 亮色端点 Colors 结构
- `tokens.ListThemes()` — 主题 ID 列表
- `tokens.GetTheme(id)` — 单个主题
- `tokens.AllThemes()` — 全部主题

### Rust

- `libra_tokens::colors::semantic::UP` — 色值常量
- `libra_tokens::colors::dark::BG_ROOT` — 暗色端点
- `libra_tokens::colors::light::BG_ROOT` — 亮色端点
- `libra_tokens::themes::list_themes()` — 主题 ID 列表
- `libra_tokens::themes::get_theme(id)` — 单个主题
- `libra_tokens::themes::all_themes()` — 全部主题
- `libra_tokens::lerp::lerp_color(h1, h2, t)` — 颜色插值
- `libra_tokens::css::generate_css()` — CSS 变量生成

### TypeScript

#### 令牌

```ts
import '@libra-design/tokens/css'  // CSS 变量
```

#### 主题 (`@libra-design/theme`)

| 函数 | 说明 |
|------|------|
| `applyTheme(id)` | 切换主题色板 |
| `getTheme(id)` | 获取单个主题 |
| `listThemes()` | 列出所有主题 ID |
| `applyMix(t)` | 调整亮暗混合比例 (0-1) |
| `applyPreset(name)` | 切换到预设模式 (dark/light/soft) |
| `getThemeColor(key)` | 获取当前主题的色值 |

**CSS 变量**（自动注入）：

| 变量 | 值 |
|------|-----|
| `--font-sans` | `'Inter', 'Noto Sans SC', ...` |
| `--font-mono` | `'JetBrains Mono', ...` |
| `--font-kai` | `'LXGW WenKai', ...` |

#### 图标 (`@libra-design/react`)

```tsx
import { Icon } from '@libra-design/react'
```

| Prop | 类型 | 默认 | 说明 |
|------|------|------|------|
| `name` | `string` | — | 语义名或 PascalCase 名 |
| `source` | `'tabler' \| 'phosphor' \| 'lucide'` | `'tabler'` | 底层库 |
| `weight` | `'thin' \| 'light' \| 'regular' \| 'bold' \| 'fill' \| 'duotone'` | — | Phosphor 变体 |
| `size` | `number` | `20` | 图标尺寸 |
| `className` | `string` | — | 额外 CSS 类 |

#### React 组件 (`@libra-design/react`)

完整组件列表见 [组件概览](/components/)。
