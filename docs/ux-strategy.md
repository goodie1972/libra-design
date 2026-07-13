# UX 自建方案

## 现状

64+ 个 React 组件，零共享 hook。当前交互模式完全分散：

| 模式 | 出现位置 | 问题 |
|------|----------|------|
| click-outside | Popover, DropdownMenu × 2 | 三段完全相同的 `useEffect` + `mousedown` 手写 |
| Escape 关闭 | Modal, Drawer × 2 | 同上，模板代码重复 |
| 受控/非受控 | Slider, Popover, Textarea | 各自实现，无统一模式 |
| 动画时长 | 6 个组件 | `0.15s`, `0.2s`, `0.3s`, `0.4s` 硬编码 |
| 键盘导航 | Slider, StockCard, NewsFeed | 各自实现方向键/Enter |
| 加载态 | 无（Skeleton 组件存在但未绑定） | 无 data-fetching 状态模式 |
| 焦点管理 | Modal/Drawer 无 focus trap | a11y 缺失 |
| 响应式 | 0 | 无任何断点 hook |
| Portal | Toast 独用 createPortal | 无处可复用 |
| Form 验证 | Select/Input/Textarea 有 `hasError` 布尔 | 无需校验 hook、无错误消息模式 |

---

## Phase 1：核心 Hooks（5 个）

### `useControllableState`

**问题**：Slider/Popover/Textarea 中各写一份受控判断。

**设计**：

```ts
function useControllableState<T>(props: {
  value?: T;
  defaultValue: T;
  onChange?: (v: T) => void;
}): [T, (v: T) => void]
```

内部维护 internal state，value 传了就走受控，否则走 internal。onChange 始终回调。

**目标文件**：`packages/react/src/lib/hooks/useControllableState.ts`

### `useClickOutside`

**问题**：Popover/DropdownMenu 各写一份 `useEffect` + `mousedown`。

**设计**：

```ts
function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  handler: () => void,
  enabled?: boolean,
): void
```

内部 addEventListener/cleanup 封装。`enabled` 参数控制监听开关。

**目标文件**：`packages/react/src/lib/hooks/useClickOutside.ts`

### `useEscapeKey`

**问题**：Modal/Drawer 各写一份 `useEffect` + `keydown`。

**设计**：

```ts
function useEscapeKey(handler: () => void, enabled?: boolean): void
```

**目标文件**：`packages/react/src/lib/hooks/useEscapeKey.ts`

### `useBreakpoint`

**问题**：无任何响应式能力。

**设计**：

```ts
type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

function useBreakpoint(): { breakpoint: Breakpoint; matches: Record<Breakpoint, boolean> }
```

通过 `window.matchMedia` 监听。断点值与 Tailwind 对齐：

| 断点 | 值 |
|------|-----|
| xs | < 640px |
| sm | ≥ 640px |
| md | ≥ 768px |
| lg | ≥ 1024px |
| xl | ≥ 1280px |
| 2xl | ≥ 1536px |

**目标文件**：`packages/react/src/lib/hooks/useBreakpoint.ts`

### `useFocusTrap`

**问题**：Modal/Drawer 打开后焦点在 body，Tab 可逃逸到背景 — a11y 违规。

**设计**：

```ts
function useFocusTrap(
  ref: RefObject<HTMLElement | null>,
  options?: { initialFocus?: 'auto' | 'first' | HTMLElement; enabled?: boolean },
): void
```

- 初始化时聚焦容器内第一个可聚焦元素或传入的 initialFocus
- Tab 循环：在容器内最后一个与第一个之间循环
- Shift+Tab 反向循环
- 容器卸载/disable 时恢复到触发前焦点位置

**目标文件**：`packages/react/src/lib/hooks/useFocusTrap.ts`

---

## Phase 2：Portal 基础设施

### `<Portal>`

**问题**：Toast 独用 createPortal，其他 overlay 组件（Modal/Drawer/Tooltip/Popover/DropdownMenu）都在原地渲染，z-index 层级难以控制。

**设计**：

```tsx
interface PortalProps {
  to?: HTMLElement | (() => HTMLElement);  // 默认 document.body
  children: React.ReactNode;
}
```

提供一个默认的 `<div id="libra-portal-root" />` 挂到 body 第一个，所有 overlay 默认渲染到这个容器内。

**目标文件**：`packages/react/src/components/portal.tsx`

---

## Phase 3：动效 Token

**问题**：6 处组件硬编码动画时长，无统一覆盖点。

**方案**：不增加新 CSS 变量，改为一个 JavaScript 常量对象，供组件和外部使用：

```ts
export const motion = {
  duration: {
    instant: 0,       // 即时（无动画）
    fast: 100,        // 悬停反馈
    normal: 200,      // 标准 transition
    slow: 300,        // 面板滑入/弹出
    expressive: 500,  // 页面过渡
  },
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',        // ease-out 金融 UI
    emphasize: 'cubic-bezier(0.32, 0.72, 0, 1)',    // 强调弹出
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',     // 弹性
  },
  transition(property: string, duration?: keyof typeof motion.duration, easing?: keyof typeof motion.easing): string {
    return `${property} ${motion.duration[duration ?? 'normal']}ms ${motion.easing[easing ?? 'default']}`;
  },
} as const;
```

**目标文件**：`packages/react/src/lib/motion.ts`

**组件收益**：

| 文件 | 当前 | 改用后 |
|------|------|--------|
| progress.tsx | `0.4s ease` | `motion.transition('stroke-dashoffset', 'slow')` |
| toggle.tsx | `duration-150` | `motion.transition(...)` |
| switch.tsx | `duration-200` | `motion.transition(...)` |
| segmented.tsx | `duration-150` | `motion.transition(...)` |
| slider.tsx | `duration-150` | `motion.transition(...)` |
| drawer.tsx | `duration-300` | `motion.transition('transform', 'slow')` |

---

## Phase 4：表单验证系统

**问题**：目前 Select/Input/Textarea 仅有 `hasError` boolean prop，无验证规则、无错误消息、无 Form.Item 上下文。

### `useFormValidation`

```ts
interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;  // 返回 null=通过，string=错误消息
}

function useFormValidation<T extends Record<string, string>>(
  initial: T,
  rules: Record<keyof T, ValidationRule[]>,
): {
  values: T;
  errors: Partial<Record<keyof T, string | null>>;
  dirty: Partial<Record<keyof T, boolean>>;
  setValue: (field: keyof T, value: string) => void;
  setValues: (values: Partial<T>) => void;
  validate: () => boolean;
  reset: () => void;
  isValid: boolean;
}
```

### `<FormItem>` Wrapper

```tsx
interface FormItemProps {
  label?: string;
  required?: boolean;
  error?: string | null;
  hint?: string;
  children: React.ReactElement<{ hasError?: boolean }>;
}
```

渲染 label + required 星号 + 错误/提示文本。通过 React.cloneElement 注入 `hasError` 给子组件。

**目标文件**：
- `packages/react/src/lib/hooks/useFormValidation.ts`
- `packages/react/src/components/form-item.tsx`（注：独立于现有的 `Form` 组件）

---

## Phase 5：Async 状态机

**问题**：64 组件中很多接受 `data` prop（KLineChart/DepthChart/TimeShareChart/MarketTable/StockTable...），但无统一 loading/empty/error 模式。

### `useAsync`

```ts
interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  empty: boolean;  // data === null || (Array.isArray(data) && data.length === 0)
  execute: (...args: any[]) => Promise<T>;
  reset: () => void;
}

function useAsync<T>(fn: (...args: any[]) => Promise<T>, immediate?: boolean): AsyncState<T>
```

### `<AsyncBoundary>`

```tsx
interface AsyncBoundaryProps<T> {
  state: AsyncState<T>;
  loadingFallback?: React.ReactNode;    // 默认 <Skeleton />
  emptyFallback?: React.ReactNode;      // 默认 <Empty />
  errorFallback?: (error: Error, retry: () => void) => React.ReactNode;
  children: (data: T) => React.ReactNode;  // 渲染函数模式
}
```

**目标文件**：
- `packages/react/src/lib/hooks/useAsync.ts`
- `packages/react/src/components/async-boundary.tsx`

---

## Phase 6：Keyboard 导航系统

**问题**：Command 组件画了箭头提示但无键盘实现；List/Menu/Table 都没有键盘导航。

### `useKeyboardListNav`

```ts
interface KeyboardListNavOptions {
  itemCount: number;
  onSelect?: (index: number) => void;
  loop?: boolean;      // top → bottom 循环
  horizontal?: boolean;  // 左右方向键
  initialIndex?: number;
  enabled?: boolean;
}

function useKeyboardListNav(options: KeyboardListNavOptions): {
  focusedIndex: number;
  setFocusedIndex: (i: number) => void;
}
```

用户监听 `onKeyDown` 后调用内部 handler。适用于 DropdownMenu/Command/Segmented/Tabs/Table rows。

**目标文件**：`packages/react/src/lib/hooks/useKeyboardListNav.ts`

---

## Phase 7：现有组件迁移

将 Phase 1 创建的 hooks 逐个注入现有组件，消除重复代码：

| 组件 | 替换 hook | 预期 Diff |
|------|-----------|-----------|
| Popover | `useClickOutside` + `useControllableState` | -12 行 |
| DropdownMenu | `useClickOutside` + `useKeyboardListNav` | -15 行 |
| Modal | `useEscapeKey` + `useFocusTrap` + `<Portal>` | -10 行 + a11y |
| Drawer | `useEscapeKey` + `useFocusTrap` + `<Portal>` | -10 行 + a11y |
| Slider | `useControllableState` | -5 行 |
| Textarea | `useControllableState` | -5 行 |
| Progress | `motion.transition(...)` | 无行变化 |
| Toggle/Switch | `motion.transition(...)` | 无行变化 |
| Segmented | `motion.transition(...)` | 无行变化 |

---

## 依赖关系

```
Phase 1 (Hooks)
  ├── no deps: useControllableState, useClickOutside, useEscapeKey, useBreakpoint
  └── no deps: useFocusTrap（依赖 RefObject）
Phase 2 (Portal)
  └── no deps
Phase 3 (Motion Token)
  └── no deps
Phase 4 (Form Validation)
  ├── deps: useControllableState
  └── deps: FormItem → 无
Phase 5 (Async State)
  └── no deps
Phase 6 (Keyboard Nav)
  └── no deps (focusedIndex 由消费方绑定 onKeyDown)
Phase 7 (Migration)
  └── deps: Phase 1-3 全部完成
```

---

## 共 7 个 Phase，零外部依赖新增

所有实现只依赖 React 内置 API（`useState`、`useEffect`、`useRef`、`useCallback`、`createPortal`）和已有工具函数（`cn`）。
