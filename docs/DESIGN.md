# Libra Design System

> Category: Finance

## Visual Theme & Atmosphere

A dark-first design system built for extreme visual precision. Clean, calm, and data-dense — like a Bloomberg terminal curated by Linear's design team.

- **Dark anchor** (t=0): `#0c0c0e` root background, warm deep charcoal (not pure black)
- **Light anchor** (t=1): `#f5f5f7` root background, warm white
- **Blend engine**: Gamma-aware color interpolation between dark and light endpoints
- **Default state**: 70% blend ("Soft" mode) — comfortable for both day and night
- **Aesthetic pillars**: Linear's dark restraint + Stripe's typographic precision + Japanese 减法 (subtraction) aesthetics
- **Only two chromatic colors exist**: red for up/gain, green for down/loss — everything else is neutral
- **Depth via luminance, not shadows**: Four-tier surface stack (root → card → hover → elevated) distinguished by 2-3% brightness shifts

## Color

### Semantic: Up / Down (only chromatic pair)

| Token | Hex | OKLch | Usage |
|-------|-----|-------|-------|
| `--up` | `#ef5350` | `oklch(60% 0.18 25)` | Up/gain/bullish candle |
| `--down` | `#26a69a` | `oklch(62% 0.12 180)` | Down/loss/bearish candle |
| `--flat` | `#9e9e9e` | `oklch(65% 0.01 0)` | No change/flat |

### MA line colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--ma5` | `#f8b500` | MA5 (golden) |
| `--ma10` | `#4a6cf7` | MA10 (blue) |
| `--ma20` | `#9c27b0` | MA20 (purple) |
| `--ma60` | `#009688` | MA60 (teal) |

### Functional

| Token | Hex | Usage |
|-------|-----|-------|
| `--success` | `#34a853` | Connected/synced |
| `--warning` | `#fbbc04` | Data delay/anomaly |
| `--error` | `#ea4335` | API failure/no data |

### Surface stack (dark anchor t=0)

| Token | Hex | Elevation |
|-------|-----|-----------|
| `--bg-root` | `#0c0c0e` | Canvas — deepest |
| `--bg-card` | `#121214` | Cards, panels |
| `--bg-card-hover` | `#18181b` | Hover, input bg |
| `--border-main` | `#1e1e22` | Default dividers |

### Surface stack (light anchor t=1)

| Token | Hex | Elevation |
|-------|-----|-----------|
| `--bg-root` | `#f5f5f7` | Canvas |
| `--bg-card` | `#ffffff` | Cards |
| `--bg-card-hover` | `#f0f0f2` | Hover |
| `--border-main` | `#d4d4d8` | Dividers |

### Text

| Token | Dark (t=0) | Light (t=1) | Mid-blend behavior |
|-------|-----------|-------------|-------------------|
| `--text-primary` | `#e8e8ed` | `#0d0d12` | Linear RGB lerp + quintic curve |
| `--text-secondary` | `#9a9aa0` | `#6e6e78` | Same, target reached faster |
| `--text-tertiary` | `#63636a` | `#8e8e98` | Same |

### Interactive accent

| Token | Dark | Light | Usage |
|-------|------|-------|-------|
| `--accent` | `#4a6cf7` | `#533afd` | Links, primary buttons |
| `--accent-hover` | `#5d7cf9` | `#4527e0` | Hover state |

## Typography

### Font stack

| Role | Stack |
|------|-------|
| Body/UI | `'Inter', -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif` |
| Display | `'Inter Display', -apple-system, 'SF Pro Display', sans-serif` |
| Numeric/mono | `'JetBrains Mono', 'SF Mono', 'Cascadia Code', monospace` |

### Size scale

| Token | px | Weight | Usage |
|-------|----|--------|-------|
| `--text-xs` | 10 | 400 | Labels, chart ticks |
| `--text-sm` | 12 | 400 | Meta, table headers |
| `--text-base` | 13 | 400 | Body, table cells |
| `--text-md` | 14 | 500 | Card titles, buttons |
| `--text-lg` | 16 | 600 | Section headers |
| `--text-xl` | 20 | 600 | Page headings |
| `--text-2xl` | 24 | 600 | Stock names, hero numbers |
| `--text-3xl` | 32 | 700 | Signal count |
| `--text-4xl` | 40 | 700 | Index quotes |

### Key rule

All numeric values (prices, changes, volumes) must use `font-family: var(--font-mono)` with `font-variant-numeric: tabular-nums` for decimal alignment. This is not optional.

## Spacing & Grid

### Baseline: 4px

| Token | px | Typical usage |
|-------|----|-------------|
| `--space-1` | 4 | Tight elements |
| `--space-2` | 8 | Button inner, icon gaps |
| `--space-3` | 12 | Card padding, table cells |
| `--space-4` | 16 | Between components |
| `--space-5` | 24 | Section separators |
| `--space-6` | 32 | Large segments |
| `--space-7` | 48 | Page top margin |
| `--space-8` | 64 | Hero whitespace |

### Grid

- Card grids: `grid-template-columns: repeat(3, 1fr)` with `gap: 12px`
- Sub-charts: `grid-template-columns: 1fr 1fr` with `gap: 14px`
- Column gap: 12-16px consistently

## Layout & Composition

### Page skeleton

```
┌──────────────────────────────────────────┐
│  Top bar           height: 52px           │
├────────┬─────────────────────────────────┤
│ Side   │  Main content area               │
│ 224px  │  padding: 28px 32px              │
│ fixed  │  gap: 20px                       │
│        │  ┌ K-line hero ────────────┐    │
│        │  │                         │    │
│        │  └─────────────────────────┘    │
│        │  ┌ sub1 ───┐ ┌ sub2 ───┐      │
│        │  └─────────┘ └─────────┘       │
│        │  ┌ card row ┐┌┐┌┐             │
│        │  └──────────┘└┘└┘             │
│        │  ┌ data table ───────────┐    │
│        │  └───────────────────────┘    │
└────────┴─────────────────────────────────┘
```

### Max widths
- Dashboard: 1400px
- K-line analysis: 100% (full-width priority)
- Admin: 1200px

### Responsive behavior

| Breakpoint | Layout change |
|------------|---------------|
| >1400px | Full-width, optional right panel |
| 960-1400px | Standard, right panel→drawer |
| 640-960px | Sidebar→icon mode |
| <640px | Sidebar→bottom nav, K-line→price line |

## Components

### Buttons

| Variant | Background | Border | Text | Radius | Padding |
|---------|-----------|--------|------|--------|---------|
| Primary | `--accent` | none | #fff | `--btn-radius` (8-20px) | 8px 18px |
| Secondary | transparent | `--border-main` 1px | `--text-primary` | `--btn-radius` | 8px 18px |
| Ghost | transparent | none | `--text-secondary` | 6px | 6px 14px |
| Danger | `--error` | none | #fff | `--btn-radius` | 8px 18px |

Radius transitions from 8px (dark) to 20px (light) with theme blend.

### Cards

```css
background: var(--bg-card);
border: 1px solid var(--border-main);
border-radius: var(--card-radius); /* 10-12px */
padding: 22-28px;
/* Dark: no shadow. Light: soft shadow */
```

Hover: `background` shifts to `var(--bg-card-hover)`, `border-color` shifts to `var(--accent)`.

### Tables

- Header `th`: 10px, uppercase, `--text-tertiary`, `letter-spacing: 0.05em`
- Cell `td`: 13px, `--text-primary`
- Row height: 36-40px
- Dividers: `1px solid var(--border-sub)`
- Row hover: `var(--bg-card-hover)`
- **Numeric columns**: right-aligned, `font-family: var(--font-mono)`, `tabular-nums`
- **Change columns**: `--up`/`--down` colored, with +/- prefix

### Inputs

```css
background: var(--bg-input);
border: 1px solid var(--border-main);
border-radius: 6px;
padding: 8px 12px;
font-size: 13px;
color: var(--text-primary);
```
Placeholder: `var(--text-tertiary)`. Focus: `border-color` → `var(--accent)`.

## Motion & Interaction

### Theme transitions
- All background/color variable changes: `transition: background 0.6s ease, color 0.6s ease`
- Border/element transitions: `0.3s-0.4s`

### Micro-interactions
- Button hover: `transform: translateY(-1px)` (subtle lift)
- Card hover: background shift + border accent color
- Table row hover: background shift
- Slider thumb hover: scale 1.15

### Color interpolation
- Background: gamma-aware lerp (`Math.sqrt` weighted) for smooth crossfades
- Text: linear RGB lerp + quintic easing curve (avoids gray zone collision at mid-blend)
- Borders: gamma-aware lerp + quadratic easing curve

## Voice & Brand

### Tagline
Chinese: 不是设计系统，是审美宣言。
English: Not a design system. An aesthetic manifesto.

### Design principles
1. **One Sovereign Per View** — Every page has exactly one visual anchor.
2. **Details Are Dogma** — 1px misalignment is a crack in faith.
3. **Space Is Breath** — 4px baseline ensures rhythmic whitespace.
4. **Restraint Is Power** — 90% neutral + 10% accent = 100% clarity.

### Tone
- Clean, confident, minimal
- No marketing fluff — design tokens speak for themselves
- Financial data context: precise, authoritative, calm

## Anti-patterns

- ❌ Never use pure black `#000000` — closest permitted is `#0c0c0e`
- ❌ Never use more than two filled buttons per page
- ❌ Never use decorative gradients or glows in chart areas
- ❌ Never center-align numeric columns (right-align only)
- ❌ Never draw zero-value flat lines for non-trading periods
- ❌ Never introduce a third chromatic color beyond up (red) and down (green)
- ❌ Never use emoji as primary identifiers in data (OK in navigation labels)
- ❌ Never hardcode theme values — always use CSS custom properties
- ❌ Never mix multiple design system tokens on the same page
