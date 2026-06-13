// Libra Design Tokens — Rust 绑定
//
// 设计令牌从 ../../tokens/design-tokens.json 经 build.rs 自动生成，
// 同时保持与 Go 版 (go-tokens/tokens.go) 的手工常量一致。
//
// 组件契约：
//  1. 所有颜色使用 CSS 自定义属性，禁止硬编码 hex
//  2. 数值列强制等宽字体 + tabular-nums
//  3. 涨跌色仅用 --up(红涨)/--down(绿跌)
//  4. 间距只用 4px 倍数（8 个值）
//  5. 暗色模式不靠 box-shadow，靠四层表面堆叠区分层级

// build.rs 生成的原始 JSON 字符串 (RAW_TOKENS_JSON)
include!("generated.rs");

pub mod colors;
pub mod lerp;
pub mod css;
pub mod themes;

// 重新导出色值常量，方便顶层使用
pub use colors::*;
pub use lerp::*;
pub use css::*;
pub use themes::*;
