// Libra Leptos 组件库 — 20 个核心金融组件
//
// 设计规则（同 Go templ 5 项契约）:
//  1. 所有颜色使用 CSS 自定义属性 var(--xxx)，禁止硬编码 hex
//  2. 数值列使用等宽字体 + tabular-nums
//  3. 涨跌色仅用 var(--up) 红 / var(--down) 绿
//  4. 间距只用 4px 倍数
//  5. 暗色模式靠四层表面堆叠

pub mod button;
pub mod card;
pub mod badge;
pub mod input;
pub mod textarea;
pub mod select;
pub mod checkbox;
pub mod radiogroup;
pub mod tabs;
pub mod modal;
pub mod table;
pub mod tag;
pub mod switch;
pub mod progress;
pub mod skeleton;
pub mod tooltip;
pub mod alert;
pub mod statistic;
pub mod pricedisplay;
pub mod stockcard;

// 重新导出所有组件，方便用户 use libra_leptos::*;
pub use button::Button;
pub use card::{Card, CardContent, CardHeader, CardTitle};
pub use badge::Badge;
pub use input::Input;
pub use textarea::Textarea;
pub use select::Select;
pub use checkbox::Checkbox;
pub use radiogroup::RadioGroup;
pub use tabs::Tabs;
pub use modal::Modal;
pub use table::Table;
pub use tag::Tag;
pub use switch::Switch;
pub use progress::Progress;
pub use skeleton::Skeleton;
pub use tooltip::Tooltip;
pub use alert::Alert;
pub use statistic::Statistic;
pub use pricedisplay::PriceDisplay;
pub use stockcard::StockCard;
