# Libra — Icon / Font / UX 配套方案

> 不是设计系统，是审美宣言。
> 三步走：先选准，再包裹，后统一。

---

## 一、图标方案：三叠层策略

**核心理念**：不重复造轮子，但也不随大流。三层图标库各司其职，通过统一 `<Icon>` 组件对 AI 和开发者隐藏底层差异。

### T1：主力层 — Tabler Icons

| 项目 | 说明 |
|------|------|
| 包名 | `@tabler/icons-react` |
| 数量 | 6000+，2px 描边，风格一致 |
| 协议 | MIT |
| 职责 | **所有标准 UI 图标**：导航、操作按钮、菜单、工具栏、表单、通用 |
| 理由 | 描边风格最契合 Libra 的「减法美学」，2px 在金融密集 UI 中比 1.5px（Lucide）更清晰 |
| 安装 | `npm i @tabler/icons-react`（已装） |

### T2：辅助层 — Phosphor Icons

| 项目 | 说明 |
|------|------|
| 包名 | `@phosphor-icons/react` |
| 数量 | 1500+ × 6 种粗细 ≈ 9000 变体 |
| 协议 | MIT |
| 职责 | **视觉层级区分**：强调用 Bold/Fill，装饰用 Thin/Light，常规用 Regular |
| 场景 | 活跃选项卡（Fill）、价格涨跌强调（Bold）、次要信息图标（Light） |
| 安装 | `npm i @phosphor-icons/react`（已装） |

### T3：兼容层 — Lucide

| 项目 | 说明 |
|------|------|
| 包名 | `lucide-react` |
| 数量 | 1700+，1.5px 描边 |
| 协议 | ISC |
| 职责 | **生态兼容**：当用户从 shadcn/ui 或其他 Lucide 项目迁移时，直接可用 |
| 原则 | 不主动推广，但提供适配。通过 `source="lucide"` 显式切换 |
| 安装 | `npm i lucide-react`（已装） |

### 统一包装器：`<Icon>` 组件

**文件**：`packages/react/src/components/icon.tsx`

```tsx
import { Icon } from '@libra-design/react';

<Icon name="trend-up" />              // T1 Tabler IconTrendingUp
<Icon name="search" />                // T1 Tabler IconSearch
<Icon name="x" />                     // T1 Tabler IconX
<Icon name="warning" weight="bold" /> // T2 Phosphor WarningBold
<Icon name="search" source="lucide" /> // T3 Lucide Search
```

**AI 使用优化**：
- 60+ 语义别名注册表（`trend-up` / `search` / `close` / `menu` → 自动映射）
- PascalCase 名直接透传：`<Icon name="ArrowUp" />` → Tabler IconArrowUp
- JSDoc 完备，TypeScript 可自动补全
- `require()` fallback 到 Phosphor/Lucide（运行时按需加载，不增大主包）
- 未找到的图标显示占位符 SVG（圆 + 问号线）

---

## 二、字体方案：西文精确 + 中文特色

### 策略：theme 包提供 CSS 变量，字体加载由消费方按需引入

**字体依赖已安装**（在 `@libra-design/theme` 的 dependencies 中）：
```
@fontsource/inter         → Inter 西文无衬线
@fontsource/jetbrains-mono → JetBrains Mono 等宽数字
@fontsource/lxgw-wenkai   → 霞鹜文楷 书法楷体
@fontsource/noto-sans-sc  → Noto Sans SC 思源黑体
```

### CSS 变量定义

**文件**：`packages/theme/src/fonts.css`（已集成到 `@libra-design/theme` 包）

```css
:root {
  --font-sans: 'Inter', 'Noto Sans SC', -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', Consolas, monospace;
  --font-kai: 'LXGW WenKai', 'KaiTi', 'STKaiti', serif;
}
```

### 消费方加载字体

在应用入口导入需要的字体 CSS：

```ts
// 按需加载，只 import 实际使用的
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource/jetbrains-mono/latin-400.css';
import '@fontsource/noto-sans-sc/chinese-simplified-400.css';
// 可选：霞鹜文楷（仅在研报/品牌场景使用）
import '@fontsource/lxgw-wenkai/latin-500.css';
```

### 字体选择逻辑

```
西文:       Inter → 主力 UI
数字:       JetBrains Mono → 强制 tabular-nums
中文正文:   Noto Sans SC → 清晰易读
中文品牌:   LXGW WenKai → 审美宣言（可选加载）
```

---

## 三、UX 规范（后续讨论）

| 方向 | 建议 |
|------|------|
| 状态机 | `useAsync` hook 封装 loading/empty/error/data 四态 |
| 键盘导航 | `useKeyboardNav` hook + focus ring 全局样式 |
| 响应式 | 基于 DESIGN.md 的 4 断点实现 `useBreakpoint` |
| 动效 | 在 `packages/react/src/lib/motion.ts` 定义缓动曲线 token |

---

## 实施记录

| 步骤 | 状态 | 文件 |
|------|------|------|
| 安装图标依赖 | ✅ | `@tabler/icons-react` `@phosphor-icons/react` `lucide-react` |
| 安装字体依赖 | ✅ | `@fontsource/*` 4 个包 |
| 创建 `<Icon>` 组件 | ✅ | `packages/react/src/components/icon.tsx` |
| 导出 Icon | ✅ | `packages/react/src/index.ts` |
| 创建 fonts.css | ✅ | `packages/theme/src/fonts.css`（仅 CSS 变量，字体按需加载） |
| 集成 fonts.css | ✅ | `packages/theme/src/index.ts` |
| 构建验证 | ✅ | theme 0.24 kB CSS, react 177 kB JS |
