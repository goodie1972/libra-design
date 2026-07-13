# Mix Engine

主题混合引擎在暗色和亮色端点之间进行 gamma 感知的插值。

## 核心概念

- **暗色锚点 (t=0)**: `#0c0c0e` 暖深炭色
- **亮色锚点 (t=1)**: `#f5f5f7` 暖白色
- **默认状态**: 70% 混合 ("Soft" 模式)
- **插值曲线**: 
  - 背景色: gamma 感知 lerp（平方根加权）
  - 文字色: 线性 RGB lerp + 五次方缓动曲线
  - 边框色: gamma 感知 lerp + 二次方缓动曲线

## 使用

### TypeScript

```ts
import { applyMix } from '@libra-design/theme/mixer'

applyMix(0)   // 纯暗色
applyMix(0.7) // Soft 模式（默认）
applyMix(1)   // 纯亮色
```

### Rust

```rust
use libra_tokens::lerp;

let blended = lerp::lerp_color("#0c0c0e", "#f5f5f7", 0.7);
assert_eq!(blended, "#...");
```
