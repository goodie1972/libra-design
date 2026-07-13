# 组件概览

Libra Design 提供三种语言绑定的组件库：

| 语言 | 包名 | 组件数 | 框架 |
|------|------|--------|------|
| Go | go-templ | 40+ | templ |
| Rust | rust-leptos | 20+ | Leptos |
| TypeScript | @libra-design/react | 64+ | React |

## 跨语言示例

### Button

::: code-group

```go [Go]
components.Button("default", "lg", false, nil)
```

```rust [Rust]
button::Button(button::Variant::Default, "点击", move |_| {})
```

```tsx [React]
<Button variant="default">点击</Button>
```

:::

### PriceDisplay

::: code-group

```go [Go]
components.PriceDisplay(1689.50, 2.15, "up")
```

```rust [Rust]
pricedisplay::PriceDisplay(1689.50, 2.15, true)
```

```tsx [React]
<PriceDisplay value={1689.50} change={2.15} />
```

:::
