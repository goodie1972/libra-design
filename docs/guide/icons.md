# 图标系统

Libra 采用**三叠层图标策略**，通过统一 `<Icon>` 组件对开发者隐藏底层差异。

## 三层结构

| 层级 | 库 | 说明 |
|------|-----|------|
| **T1 主力** | `@tabler/icons-react` | 所有标准 UI 图标。2px 描边，6000+ 图标，风格一致（默认） |
| **T2 辅助** | `@phosphor-icons/react` | 6 种粗细变体，用于视觉层级区分（`weight` 属性触发） |
| **T3 兼容** | `lucide-react` | 生态迁移适配（`source="lucide"` 显式切换） |

## 基本用法

```tsx
import { Icon } from '@libra-design/react'

// 语义名（推荐给 AI 使用）
<Icon name="trend-up" />       // → Tabler IconTrendingUp
<Icon name="search" />
<Icon name="close" />
<Icon name="warning" weight="bold" />  // → Phosphor WarningBold

// PascalCase 名直通
<Icon name="ArrowUp" />
<Icon name="Bell" />
<Icon name="Settings" />

// 切换底层库
<Icon name="Search" source="tabler" />
<Icon name="Search" source="phosphor" />
<Icon name="Search" source="lucide" />

// 尺寸和样式
<Icon name="x" size={16} />
<Icon name="menu" className="text-[var(--text-secondary)]" />
```

## Props

| Prop | 类型 | 默认 | 说明 |
|------|------|------|------|
| `name` | `string` | — | 语义名（`trend-up`）或 PascalCase 名（`ArrowUp`） |
| `source` | `'tabler' \| 'phosphor' \| 'lucide'` | `'tabler'` | 强制指定底层库 |
| `weight` | `'thin' \| 'light' \| 'regular' \| 'bold' \| 'fill' \| 'duotone'` | — | 仅 Phosphor 有效 |
| `size` | `number` | `20` | 图标尺寸（px） |
| `className` | `string` | — | 额外 CSS 类 |
| `aria-hidden` | `boolean` | `true` | 装饰图标默认隐藏 |

## 语义别名表

常用图标已预置映射，无需记忆具体库名：

| 别名 | Tabler 映射 | 说明 |
|------|-------------|------|
| `trend-up` / `trend-down` | `IconTrendingUp` / `IconTrendingDown` | 涨跌趋势 |
| `search` | `IconSearch` | 搜索 |
| `close` | `IconX` | 关闭 |
| `menu` | `IconMenu2` | 菜单 |
| `settings` | `IconSettings` | 设置 |
| `chevron-up/down/left/right` | `IconChevronUp/Down/Left/Right` | 箭头 |
| `arrow-up/down/left/right` | `IconArrowUp/Down/Left/Right` | 方向 |
| `check` / `plus` / `minus` | `IconCheck` / `IconPlus` / `IconMinus` | 操作 |
| `edit` / `trash` / `copy` | `IconEdit` / `IconTrash` / `IconCopy` | 编辑 |
| `download` / `upload` / `refresh` | `IconDownload` / `IconUpload` / `IconRefresh` | 数据 |
| `info` / `warning` / `error` / `success` | `IconInfoCircle` / `IconAlertTriangle` / `IconAlertCircle` / `IconCircleCheck` | 反馈 |
| `loading` | `IconLoader2` | 加载 |
| `filter` / `sort-asc` / `sort-desc` | `IconFilter` / `IconSortAscending` / `IconSortDescending` | 筛选 |
| `eye` / `eye-off` | `IconEye` / `IconEyeOff` | 可见性 |
| `lock` / `unlock` | `IconLock` / `IconLockOpen` | 权限 |
| `user` / `users` | `IconUser` / `IconUsers` | 用户 |
| `calendar` / `clock` / `bell` | `IconCalendar` / `IconClock` / `IconBell` | 时间 |
| `home` / `book` / `star` / `heart` | `IconHome` / `IconBook` / `IconStar` / `IconHeart` | 通用 |
| `candle` / `volume` / `wallet` | `IconCandle` / `IconVolume` / `IconWallet` | 金融 |

未匹配的语义名自动转为 PascalCase（`my-icon` → `MyIcon`）。
未找到的图标渲染为占位符 SVG（圆 + 问号线）。

## AI 使用优化

```tsx
// AI 可以直接用自然语义命名，无需查阅具体库的导出名
<Icon name="trend-up" />     // 趋势上涨
<Icon name="candle" />       // K 线蜡烛
<Icon name="exchange" />     // 交易兑换
<Icon name="fullscreen" />   // 全屏
```

所有语义别名的 TypeScript 类型已完整定义，AI 可通过类型补全自动获取可用名。
