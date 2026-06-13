---
name: libra-design
description: 生成符合 Libra 设计系统的 UI 代码时使用此 Skill。Use this skill when generating UI code that should follow the Libra Design System. Triggers on: 'libra设计', 'Libra组件', '金融数据UI', 'libra theme', 'libra tokens', 'financial data design'.
---

# Libra Design System Skill

> 面向金融数据的自研设计语言。暗色为骨，留白为肉，数据为主角。
> A dark-first design system for financial data visualization.

## Design Philosophy

| Principle | Meaning |
|-----------|---------|
| **One Sovereign Per View** | Every page has exactly one visual anchor. K-line page → chart is sovereign. |
| **Details Are Dogma** | 1px misalignment is a crack in faith. |
| **Space Is Breath** | 4px baseline ensures rhythmic whitespace. |
| **Restraint Is Power** | 90% neutral + 10% accent = 100% clarity. |

**Aesthetic anchors**: Linear's dark restraint + Stripe's typographic precision + Japanese 减法 aesthetics.

## Quick Reference

### Color tokens

```css
/* Semantic — the ONLY two chromatic colors */
--up:   #ef5350;
--down: #26a69a;
--flat: #9e9e9e;

/* MA line colors */
--ma5: #f8b500; --ma10: #4a6cf7; --ma20: #9c27b0; --ma60: #009688;

/* Dark endpoint (t=0) */
--bg-root:       #0c0c0e;
--bg-card:       #121214;
--bg-card-hover: #18181b;
--bg-input:      #18181b;
--border-main:   #1e1e22;
--border-sub:    #161618;
--text-primary:  #e8e8ed;
--text-secondary:#9a9aa0;
--text-tertiary: #63636a;
--accent:        #4a6cf7;

/* Light endpoint (t=1) — used by theme engine interpolation */
/* bg-root: #f5f5f7, bg-card: #ffffff, text-primary: #0d0d12, text-secondary: #555566, accent: #533afd */
```

### Theme engine

```typescript
import { applyMix, applyPreset } from '@libra-design/theme';
applyPreset('dark');   // t=0 — pure dark
applyPreset('soft');   // t=0.7 — default, comfortable day/night
applyPreset('light');  // t=1 — pure light
applyMix(0.35);        // custom blend
```

The engine interpolates between dark/light endpoints using gamma-aware color interpolation (backgrounds) and linear RGB interpolation (text).

### Typography

```css
--font-body: 'Inter', -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif;
--font-mono: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', monospace;

/* Size scale: xs(10) sm(12) base(13) md(14) lg(16) xl(20) 2xl(24) 3xl(32) 4xl(40) */
```

**CARDINAL RULE**: All numeric values MUST use `--font-mono` + `font-variant-numeric: tabular-nums`. This is not optional.

### Spacing

`--space-1(4px) --space-2(8px) --space-3(12px) --space-4(16px) --space-5(24px) --space-6(32px) --space-7(48px) --space-8(64px)`

Only these 8 values. Nothing in between.

### Components

**Button** — 4 variants: `default`(accent bg), `secondary`(outlined), `ghost`(transparent), `danger`(error bg). Radius `var(--btn-radius)`. Sizes: default(36px), sm(32px), lg(40px), icon(32px).

**Card** — bg `var(--bg-card)`, border `var(--border-main)`, radius `var(--card-radius)`. Hover shifts bg to `--bg-card-hover` and border to `--accent`. Light mode: no border.

**Table** — Headers: 10px/500/uppercase `--text-secondary`, letter-spacing 0.03em. Rows: 36-40px, hover bg `--bg-card-hover`. Numeric columns: right-aligned, mono font, tabular-nums. Change columns: colored with direction.

**Badge** — Variants: `up`, `down`, `flat`, `success`, `warning`, `error`, `default`. Each uses its corresponding semantic color.

**PriceDisplay** — Mono font + tabular-nums + directional arrow + change/changePercent. Up = `--up`(red), Down = `--down`(green).

**ChangeBadge** — Rounded pill showing percentage change. Colored by direction.

**Input** — bg `--bg-input`, border `--border-input`, 6px radius. Focus border `--accent`. Supports `hasError` variant, `prefix`, `suffix`.

### Usage

```bash
# Install
npm install @libra-design/tokens @libra-design/react

# Import tokens at entry point
import '@libra-design/tokens/css';

# Use components
import { Button, Card, PriceDisplay } from '@libra-design/react';
```

### CLI (shadcn-style)

```bash
npx @libra-design/cli init          # copy tokens.css to project
npx @libra-design/cli add button    # copy component source
```

### MCP Server (AI integration)

Add to `~/.claude/settings.json`:
```json
{
  "mcpServers": {
    "libra": { "command": "npx", "args": ["@libra-design/mcp-server"] }
  }
}
```

## DOs and DON'Ts

### ✅ DO
- Use CSS custom properties for ALL colors — never hardcode hex
- All numeric values in JetBrains Mono with tabular-nums
- Only the 4px spacing scale (8 values)
- Surface hierarchy instead of box-shadow in dark mode
- Red for up/gain, green for down/loss (A-share convention)

### ❌ DON'T
- Pure black `#000000` — closest is `#0c0c0e`
- More than two filled buttons per page
- Decorative gradients or glows in data/chart areas
- Center-aligned numeric columns (right-align only)
- Third chromatic color beyond red/green
- Hardcode theme values — always use CSS custom properties
- Emoji as primary identifiers in data
