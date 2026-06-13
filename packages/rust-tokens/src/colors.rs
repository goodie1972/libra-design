// 色值常量 — 手动移植自 go-tokens/tokens.go，与 design-tokens.json 一致。
//
// 组织方式：
//   1. 语义色（涨跌、均线、功能色）— 全局固定，不随主题变化
//   2. 暗色端点（17 个）
//   3. 亮色端点（17 个）
//   4. 图表专用色

// ---- 1. 语义色 ----

/// 涨色（A 股惯例：红涨）
pub const COLOR_UP: &str = "#ef5350";
/// 跌色（A 股惯例：绿跌）
pub const COLOR_DOWN: &str = "#26a69a";
/// 平盘
pub const COLOR_FLAT: &str = "#9e9e9e";

/// 涨色背景
pub const COLOR_UP_BG: &str = "rgba(239, 83, 80, 0.08)";
/// 涨色亮
pub const COLOR_UP_LIGHT: &str = "#ff8a80";
/// 跌色背景
pub const COLOR_DOWN_BG: &str = "rgba(38, 166, 154, 0.08)";
/// 跌色亮
pub const COLOR_DOWN_LIGHT: &str = "#64d8cb";

/// K 线均线色 — MA5
pub const COLOR_MA5: &str = "#f8b500";
/// K 线均线色 — MA10
pub const COLOR_MA10: &str = "#4a6cf7";
/// K 线均线色 — MA20
pub const COLOR_MA20: &str = "#9c27b0";
/// K 线均线色 — MA60
pub const COLOR_MA60: &str = "#009688";
/// K 线均线色 — MA120
pub const COLOR_MA120: &str = "#ff7043";
/// K 线均线色 — MA250
pub const COLOR_MA250: &str = "#78909c";

/// 功能色 — 成功
pub const COLOR_SUCCESS: &str = "#34a853";
/// 功能色 — 警告
pub const COLOR_WARNING: &str = "#fbbc04";
/// 功能色 — 错误
pub const COLOR_ERROR: &str = "#ea4335";

// ---- 2. 暗色端点 ----

/// 暗色模式 — 四层表面体系

pub mod dark {
    /// 最底层背景
    pub const BG_ROOT: &str = "#0c0c0e";
    /// 主区域背景
    pub const BG_MAIN: &str = "#0c0c0e";
    /// 侧栏背景
    pub const BG_SIDEBAR: &str = "#0c0c0e";
    /// 卡片背景
    pub const BG_CARD: &str = "#121214";
    /// 卡片悬停背景
    pub const BG_CARD_HOVER: &str = "#18181b";
    /// 输入框背景
    pub const BG_INPUT: &str = "#18181b";
    /// 图表背景
    pub const BG_CHART: &str = "#0c0c0e";
    /// 子面板背景
    pub const BG_SUB_PANEL: &str = "#121214";

    /// 主要边框
    pub const BORDER_MAIN: &str = "#1e1e22";
    /// 次要边框
    pub const BORDER_SUB: &str = "#161618";
    /// 输入框边框
    pub const BORDER_INPUT: &str = "#1e1e22";

    /// 主要文字
    pub const TEXT_PRIMARY: &str = "#e8e8ed";
    /// 次要文字
    pub const TEXT_SECONDARY: &str = "#9a9aa0";
    /// 第三级文字
    pub const TEXT_TERTIARY: &str = "#63636a";

    /// 强调色
    pub const ACCENT: &str = "#4a6cf7";
    /// 强调色悬停
    pub const ACCENT_HOVER: &str = "#5d7cf9";

    /// 网格线
    pub const GRID_LINE: &str = "#18191c";
}

// ---- 3. 亮色端点 ----

pub mod light {
    /// 最底层背景
    pub const BG_ROOT: &str = "#f5f5f7";
    /// 主区域背景
    pub const BG_MAIN: &str = "#f5f5f7";
    /// 侧栏背景
    pub const BG_SIDEBAR: &str = "#f5f5f7";
    /// 卡片背景
    pub const BG_CARD: &str = "#ffffff";
    /// 卡片悬停背景
    pub const BG_CARD_HOVER: &str = "#f0f0f2";
    /// 输入框背景
    pub const BG_INPUT: &str = "#eaeaee";
    /// 图表背景
    pub const BG_CHART: &str = "#f5f5f7";
    /// 子面板背景
    pub const BG_SUB_PANEL: &str = "#ffffff";

    /// 主要边框
    pub const BORDER_MAIN: &str = "#d4d4d8";
    /// 次要边框
    pub const BORDER_SUB: &str = "#e8e8ec";
    /// 输入框边框
    pub const BORDER_INPUT: &str = "#d4d4d8";

    /// 主要文字
    pub const TEXT_PRIMARY: &str = "#0d0d12";
    /// 次要文字
    pub const TEXT_SECONDARY: &str = "#555566";
    /// 第三级文字
    pub const TEXT_TERTIARY: &str = "#8e8e98";

    /// 强调色
    pub const ACCENT: &str = "#533afd";
    /// 强调色悬停
    pub const ACCENT_HOVER: &str = "#4527e0";

    /// 网格线
    pub const GRID_LINE: &str = "#e8ecf0";
}

// ---- 4. 图表专用色 ----

pub mod chart {
    /// 暗色网格线
    pub const GRID_LINE_DARK: &str = "#18191c";
    /// 亮色网格线
    pub const GRID_LINE_LIGHT: &str = "#e8ecf0";
    /// 成交量涨色
    pub const VOL_UP: &str = "rgba(239, 83, 80, 0.55)";
    /// 成交量跌色
    pub const VOL_DOWN: &str = "rgba(38, 166, 154, 0.55)";
    /// 资金流向柱涨色
    pub const HIST_UP: &str = "rgba(239, 83, 80, 0.7)";
    /// 资金流向柱跌色
    pub const HIST_DOWN: &str = "rgba(38, 166, 154, 0.7)";
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_semantic_colors() {
        assert_eq!(COLOR_UP, "#ef5350");
        assert_eq!(COLOR_DOWN, "#26a69a");
        assert_eq!(COLOR_FLAT, "#9e9e9e");
    }

    #[test]
    fn test_dark_colors() {
        assert_eq!(dark::BG_ROOT, "#0c0c0e");
        assert_eq!(dark::TEXT_PRIMARY, "#e8e8ed");
        assert_eq!(dark::GRID_LINE, "#18191c");
    }

    #[test]
    fn test_light_colors() {
        assert_eq!(light::BG_CARD, "#ffffff");
        assert_eq!(light::ACCENT, "#533afd");
    }

    #[test]
    fn test_chart_colors() {
        assert!(chart::VOL_UP.contains("rgba"));
        assert!(chart::VOL_DOWN.contains("rgba"));
    }
}
