# Libra Design Skill

> 当你需要生成符合 Libra 设计系统的 UI 代码时使用此 Skill。
> Use this skill when generating UI code that should follow the Libra Design System.

## Design Philosophy

Libra is an **extreme aesthetics** design language. Not a UI kit — an aesthetic manifesto.

- **Dark-first**: Default state is 70% blend ("Soft" mode), fully dark at 0%, fully light at 100%
- **Chromatic restraint**: Only red (`#ef5350`) and green (`#26a69a`) — everything else neutral
- **Depth by luminance**: Four surface tiers (root → card → hover → elevated), no shadows in dark mode
- **4px rhythm**: All spacing from `--space-1`(4px) to `--space-8`(64px), nothing in between

## Quick Reference

### Color tokens

```css
/* Semantic — only chromatic colors in the system */
--up:   #ef5350;  /* Red: gain/up/bullish */
--down: #26a69a;  /* Green: loss/down/bearish */
--flat: #9e9e9e;

/* Dark endpoint (t=0) */
--bg-root:       #0c0c0e;
--bg-card:       #121214;
--bg-card-hover: #18181b;
--border-main:   #1e1e22;
--text-primary:  #e8e8ed;
--text-secondary:#9a9aa0;
--text-tertiary: #63636a;
--accent:        #4a6cf7;

/* Light endpoint (t=1) */
/* bg-root: #f5f5f7, bg-card: #ffffff, text-primary: #0d0d12, accent: #533afd */
```

### Theme engine

```typescript
import { applyMix, applyPreset } from '@libra-design/theme';
applyPreset('dark');   // t=0
applyPreset('soft');   // t=0.7 (default)
applyPreset('light');  // t=1
applyMix(0.35);        // custom blend
```

### Typography

```css
--font-body: 'Inter', -apple-system, 'PingFang SC', sans-serif;
--font-mono: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', monospace;

/* Size: xs(10) sm(12) base(13) md(14) lg(16) xl(20) 2xl(24) 3xl(32) 4xl(40) */
```

**Cardinal rule**: All numeric values MUST use `--font-mono` + `tabular-nums`.

### Spacing

```css
--space-1: 4px;  --space-2: 8px;  --space-3: 12px; --space-4: 16px;
--space-5: 24px; --space-6: 32px; --space-7: 48px; --space-8: 64px;
```

### Buttons

```css
.btn-primary  { background: var(--accent); color: #fff; }
.btn-secondary { border: 1px solid var(--border-main); color: var(--text-primary); }
.btn-ghost    { background: transparent; color: var(--text-secondary); }
.btn-danger   { background: var(--error); color: #fff; }
/* Radius: var(--btn-radius) — transitions 8px→20px with theme */
```

### Tables

- Headers: 10px uppercase, `--text-tertiary`, `letter-spacing: 0.05em`
- Cells: 13px, `--text-primary`
- Numeric columns: right-aligned, mono font, tabular-nums
- Change columns: `--up` / `--down` colored with +/- prefix

## DOs and DON'Ts

### ✅ DO
- Use CSS custom properties for all colors, never hardcode hex
- All numbers in JetBrains Mono with tabular-nums
- 4px spacing scale only
- Surface hierarchy instead of box-shadow in dark mode

### ❌ DON'T
- Pure black `#000000`
- More than two filled buttons per page
- Decorative gradients in data/chart areas
- Center-aligned numeric columns
- Third chromatic color beyond red/green
