# 字体系统

Libra 的字体方案分为两层：**CSS 变量定义字体栈**（由 `@libra-design/theme` 提供）和 **字体文件加载**（由消费方按需引入）。

## CSS 变量

`@libra-design/theme` 包定义了三个字体 CSS 变量：

```css
:root {
  --font-sans: 'Inter', 'Noto Sans SC', -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', Consolas, monospace;
  --font-kai: 'LXGW WenKai', 'KaiTi', 'STKaiti', serif;
}
```

| 变量 | 用途 | 字体 |
|------|------|------|
| `--font-sans` | UI 正文、标题 | Inter + Noto Sans SC（中文字体 fallback） |
| `--font-mono` | 数字、代码 | JetBrains Mono（含 `tabular-nums`） |
| `--font-kai` | 研报、品牌文案 | LXGW WenKai（霞鹜文楷） |

使用方式：

```css
body {
  font-family: var(--font-sans);
}

.price-value {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
}

.report-title {
  font-family: var(--font-kai);
}
```

## 字体加载

字体文件不在 theme 包中内联（避免 86MB+ 的 CSS），由消费方在应用入口按需引入。

### 安装

依赖已安装在 `@libra-design/theme` 中，安装 theme 包时自动获取：

```bash
npm i @libra-design/theme
# 会自动安装：
#   @fontsource/inter
#   @fontsource/jetbrains-mono
#   @fontsource/lxgw-wenkai
#   @fontsource/noto-sans-sc
```

### 在应用入口引入

```ts
// 应用入口（如 main.tsx）

// --- 西文 ---
import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-500.css'
import '@fontsource/inter/latin-600.css'
import '@fontsource/jetbrains-mono/latin-400.css'

// --- 中文（按需加载） ---
import '@fontsource/noto-sans-sc/chinese-simplified-400.css'
import '@fontsource/noto-sans-sc/chinese-simplified-500.css'

// --- 可选：霞鹜文楷（仅研报/品牌场景）---
// import '@fontsource/lxgw-wenkai/latin-500.css'
```

### 字体选择策略

| 场景 | 字体 | 说明 |
|------|------|------|
| UI 正文 | Inter 400/500 | 清晰、中性、跨平台一致 |
| 标题/按钮 | Inter 600/700 | 紧凑有力 |
| 数字/价格 | JetBrains Mono 400 | 等宽、decimal 对齐 |
| 中文正文 | Noto Sans SC 400/500 | 思源黑体，全字重覆盖 |
| 中文品牌 | LXGW WenKai 500 | 霞鹜文楷，书法风格 |

### 性能建议

- 仅引入实际使用的字重（通常 400 + 500 + 600 足够）
- 中文字体文件较大，建议只加载 `chinese-simplified` 子集
- 霞鹜文楷按需加载（首屏不需要的品牌场景延迟加载）

## 对齐要求

所有数字（价格、涨跌额、成交量）必须使用等宽字体 + `tabular-nums`：

```css
.price-value {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  text-align: right;
}
```

这是非可选的规范。表格中所有数值列必须右对齐 + 等宽字体。
