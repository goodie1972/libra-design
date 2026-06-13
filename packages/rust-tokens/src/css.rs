// CSS 生成 — 从设计令牌生成完整的 CSS 自定义属性文件。
//
// 解析 RAW_TOKENS_JSON（由 build.rs 嵌入的原始 JSON），输出格式
// 与 Go 版 GenerateCSS() 一致，共 ~78 个 CSS 变量（语义色 15 +
// 主题色 17 + 字体 12 + 字距 5 + 行高 3 + 间距 8 + 结构 4 +
// 图表 5 + 圆角 5 = 78，不含 section 注释与 blank lines）。

use serde::Deserialize;
use std::collections::HashMap;

// ---- JSON 数据结构 ----

#[derive(Debug, Deserialize)]
pub struct DesignTokens {
    pub version: String,
    pub colors: ColorsSection,
    pub typography: TypographySection,
    pub spacing: HashMap<String, i32>,
    pub radii: HashMap<String, i32>,
    pub component: HashMap<String, String>,
}

#[derive(Debug, Deserialize)]
pub struct ColorsSection {
    pub semantic: HashMap<String, String>,
    pub dark_endpoint: HashMap<String, String>,
    pub light_endpoint: HashMap<String, String>,
    pub chart: HashMap<String, String>,
}

#[derive(Debug, Deserialize)]
pub struct TypographySection {
    pub families: HashMap<String, String>,
    pub sizes: HashMap<String, f64>,
    pub weights: HashMap<String, i32>,
    pub tracking: HashMap<String, f64>,
    pub leading: HashMap<String, f64>,
}

// ---- 有序 key 列表（保持与 Go 版一致的输出顺序） ----

const SIZE_KEYS: &[&str] = &["xs", "sm", "base", "md", "lg", "xl", "2xl", "3xl", "4xl"];
const TRACKING_KEYS: &[&str] = &["display", "title", "subtitle", "body", "label"];
const SPACE_KEYS: &[&str] = &["1", "2", "3", "4", "5", "6", "7", "8"];
const RADIUS_KEYS: &[&str] = &["sm", "md", "lg", "xl", "full", "btn", "card"];

// ---------------------------------------------------------------------------
// CSS 对齐辅助（与 Go 的 calcPad 一致）
// ---------------------------------------------------------------------------

fn calc_pad(name: &str) -> usize {
    let base = name.len() + 2; // "--" prefix
    match base {
        0..=10 => 16,
        11..=14 => 20,
        15..=18 => 24,
        _ => 28,
    }
}

fn write_css_var(buf: &mut String, name: &str, value: &str) {
    if value.is_empty() {
        return;
    }
    let pad = calc_pad(name);
    buf.push_str(&format!("  --{:<pad$} {};\n", format!("{}:", name), value, pad = pad));
}

fn write_css_var_px(buf: &mut String, name: &str, value: f64) {
    if value == 0.0 {
        return;
    }
    let pad = calc_pad(name);
    buf.push_str(&format!(
        "  --{:<pad$} {:.0}px;\n",
        format!("{}:", name),
        value,
        pad = pad
    ));
}

fn write_css_var_px_int(buf: &mut String, name: &str, value: i32) {
    if value == 0 {
        return;
    }
    let pad = calc_pad(name);
    buf.push_str(&format!(
        "  --{:<pad$} {}px;\n",
        format!("{}:", name),
        value,
        pad = pad
    ));
}

fn write_css_var_em(buf: &mut String, name: &str, value: f64) {
    let pad = calc_pad(name);
    buf.push_str(&format!(
        "  --{:<pad$} {:.2}em;\n",
        format!("{}:", name),
        value,
        pad = pad
    ));
}

fn write_css_var_num(buf: &mut String, name: &str, value: i32) {
    if value == 0 {
        return;
    }
    let pad = calc_pad(name);
    buf.push_str(&format!(
        "  --{:<pad$} {};\n",
        format!("{}:", name),
        value,
        pad = pad
    ));
}

fn write_css_var_float(buf: &mut String, name: &str, value: f64) {
    if value == 0.0 {
        return;
    }
    let pad = calc_pad(name);
    buf.push_str(&format!(
        "  --{:<pad$} {:.1};\n",
        format!("{}:", name),
        value,
        pad = pad
    ));
}

// ---------------------------------------------------------------------------
// 主入口
// ---------------------------------------------------------------------------

/// 解析设计令牌 JSON，返回 DesignTokens 实例。
pub fn parse_tokens() -> DesignTokens {
    serde_json::from_str(crate::RAW_TOKENS_JSON)
        .expect("设计令牌 JSON 解析失败，请检查 build.rs 生成的 RAW_TOKENS_JSON")
}

/// 从设计令牌生成完整的 CSS 自定义属性文件。
///
/// 输出共约 78 个 CSS 变量，格式与 Go 版 GenerateCSS() 一致：
///   - 语义色（15 个）
///   - 主题色 — 暗色端点（17 个）
///   - 字体系统（families 3 + sizes 9 + weights 4 + tracking 5 + leading 3）
///   - 间距系统（8 个）
///   - 结构属性（4 个）
///   - 图表专用（5 个）
///   - 圆角体系（去重后 5 个）
pub fn generate_css() -> String {
    let tokens = parse_tokens();
    let mut b = String::new();

    // 头部注释
    b.push_str("/* ============================================================\n");
    b.push_str("   Libra Design Tokens — 由 libra init 生成\n");
    b.push_str(&format!("   版本: {}\n", tokens.version));
    b.push_str("   双主题起始值（暗色端点），由 applyMix() 动态改写\n");
    b.push_str("   ============================================================ */\n\n");
    b.push_str(":root {\n");

    // =======================================================================
    // 1. 语义色
    // =======================================================================
    b.push_str("  /* ========================================\n");
    b.push_str("     1. 语义色（全局常量，不随主题变化）\n");
    b.push_str("     ======================================== */\n\n");
    b.push_str("  /* 涨跌色 — A 股惯例：红涨绿跌 */\n");
    write_css_var(&mut b, "up", tok(&tokens.colors.semantic, "up"));
    write_css_var(&mut b, "down", tok(&tokens.colors.semantic, "down"));
    write_css_var(&mut b, "flat", tok(&tokens.colors.semantic, "flat"));
    b.push_str("\n  /* 涨跌辅助色 */\n");
    write_css_var(&mut b, "up-bg", tok(&tokens.colors.semantic, "up-bg"));
    write_css_var(&mut b, "up-light", tok(&tokens.colors.semantic, "up-light"));
    write_css_var(&mut b, "down-bg", tok(&tokens.colors.semantic, "down-bg"));
    write_css_var(&mut b, "down-light", tok(&tokens.colors.semantic, "down-light"));
    b.push_str("\n  /* K 线均线色 */\n");
    write_css_var(&mut b, "ma5", tok(&tokens.colors.semantic, "ma5"));
    write_css_var(&mut b, "ma10", tok(&tokens.colors.semantic, "ma10"));
    write_css_var(&mut b, "ma20", tok(&tokens.colors.semantic, "ma20"));
    write_css_var(&mut b, "ma60", tok(&tokens.colors.semantic, "ma60"));
    write_css_var(&mut b, "ma120", tok(&tokens.colors.semantic, "ma120"));
    write_css_var(&mut b, "ma250", tok(&tokens.colors.semantic, "ma250"));
    b.push_str("\n  /* 功能色 */\n");
    write_css_var(&mut b, "success", tok(&tokens.colors.semantic, "success"));
    write_css_var(&mut b, "warning", tok(&tokens.colors.semantic, "warning"));
    write_css_var(&mut b, "error", tok(&tokens.colors.semantic, "error"));

    // =======================================================================
    // 2. 主题色（暗色端点）
    // =======================================================================
    b.push_str("\n  /* ========================================\n");
    b.push_str("     2. 主题色（暗色端点 t=0）\n");
    b.push_str("     ======================================== */\n\n");
    b.push_str("  /* 背景系 — 四层表面堆叠体系（参考 Linear） */\n");
    write_css_var(&mut b, "bg-root", tok(&tokens.colors.dark_endpoint, "bg-root"));
    write_css_var(&mut b, "bg-main", tok(&tokens.colors.dark_endpoint, "bg-main"));
    write_css_var(&mut b, "bg-sidebar", tok(&tokens.colors.dark_endpoint, "bg-sidebar"));
    write_css_var(&mut b, "bg-card", tok(&tokens.colors.dark_endpoint, "bg-card"));
    write_css_var(&mut b, "bg-card-hover", tok(&tokens.colors.dark_endpoint, "bg-card-hover"));
    write_css_var(&mut b, "bg-input", tok(&tokens.colors.dark_endpoint, "bg-input"));
    write_css_var(&mut b, "bg-chart", tok(&tokens.colors.dark_endpoint, "bg-chart"));
    write_css_var(&mut b, "bg-sub-panel", tok(&tokens.colors.dark_endpoint, "bg-sub-panel"));
    b.push_str("\n  /* 边框系 */\n");
    write_css_var(&mut b, "border-main", tok(&tokens.colors.dark_endpoint, "border-main"));
    write_css_var(&mut b, "border-sub", tok(&tokens.colors.dark_endpoint, "border-sub"));
    write_css_var(&mut b, "border-input", tok(&tokens.colors.dark_endpoint, "border-input"));
    b.push_str("\n  /* 文字系 */\n");
    write_css_var(&mut b, "text-primary", tok(&tokens.colors.dark_endpoint, "text-primary"));
    write_css_var(&mut b, "text-secondary", tok(&tokens.colors.dark_endpoint, "text-secondary"));
    write_css_var(&mut b, "text-tertiary", tok(&tokens.colors.dark_endpoint, "text-tertiary"));
    b.push_str("\n  /* 交互色 */\n");
    write_css_var(&mut b, "accent", tok(&tokens.colors.dark_endpoint, "accent"));
    write_css_var(&mut b, "accent-hover", tok(&tokens.colors.dark_endpoint, "accent-hover"));

    // =======================================================================
    // 3. 字体系统
    // =======================================================================
    b.push_str("\n  /* ========================================\n");
    b.push_str("     3. 字体系统\n");
    b.push_str("     ======================================== */\n\n");
    write_css_var(&mut b, "font-display", tok(&tokens.typography.families, "display"));
    write_css_var(&mut b, "font-body", tok(&tokens.typography.families, "body"));
    write_css_var(&mut b, "font-mono", tok(&tokens.typography.families, "mono"));
    b.push_str("\n  /* 字号阶梯 */\n");
    for key in SIZE_KEYS {
        if let Some(&v) = tokens.typography.sizes.get(*key) {
            write_css_var_px(&mut b, &format!("text-{}", key), v);
        }
    }
    b.push_str("\n  /* 字重 */\n");
    write_css_var_num(&mut b, "weight-normal", tok_int(&tokens.typography.weights, "normal"));
    write_css_var_num(&mut b, "weight-medium", tok_int(&tokens.typography.weights, "medium"));
    write_css_var_num(&mut b, "weight-semibold", tok_int(&tokens.typography.weights, "semibold"));
    write_css_var_num(&mut b, "weight-bold", tok_int(&tokens.typography.weights, "bold"));
    b.push_str("\n  /* 字距 */\n");
    for key in TRACKING_KEYS {
        if let Some(&v) = tokens.typography.tracking.get(*key) {
            write_css_var_em(&mut b, &format!("tracking-{}", key), v);
        }
    }
    b.push_str("\n  /* 行高 */\n");
    write_css_var_float(&mut b, "leading-tight", tok_f64(&tokens.typography.leading, "tight"));
    write_css_var_float(&mut b, "leading-normal", tok_f64(&tokens.typography.leading, "normal"));
    write_css_var_float(&mut b, "leading-loose", tok_f64(&tokens.typography.leading, "loose"));

    // =======================================================================
    // 4. 间距系统
    // =======================================================================
    b.push_str("\n  /* ========================================\n");
    b.push_str("     4. 间距系统（4px 基数）\n");
    b.push_str("     ======================================== */\n\n");
    for key in SPACE_KEYS {
        if let Some(&v) = tokens.spacing.get(*key) {
            write_css_var_px_int(&mut b, &format!("space-{}", key), v);
        }
    }

    // =======================================================================
    // 5. 结构属性
    // =======================================================================
    b.push_str("\n  /* ========================================\n");
    b.push_str("     5. 结构属性（会被 applyMix 动态改写）\n");
    b.push_str("     ======================================== */\n\n");
    write_css_var_px_int(&mut b, "btn-radius", tok_int(&tokens.radii, "btn"));
    write_css_var_px_int(&mut b, "card-radius", tok_int(&tokens.radii, "card"));
    write_css_var(&mut b, "card-shadow", tok(&tokens.component, "card-shadow"));
    write_css_var(&mut b, "card-border", tok(&tokens.component, "card-border"));

    // =======================================================================
    // 6. 图表专用变量
    // =======================================================================
    b.push_str("\n  /* ========================================\n");
    b.push_str("     6. 图表专用变量\n");
    b.push_str("     ======================================== */\n\n");
    write_css_var(&mut b, "grid-line", tok(&tokens.colors.dark_endpoint, "grid-line"));
    write_css_var(&mut b, "vol-up", tok(&tokens.colors.chart, "vol-up"));
    write_css_var(&mut b, "vol-down", tok(&tokens.colors.chart, "vol-down"));
    write_css_var(&mut b, "hist-up", tok(&tokens.colors.chart, "hist-up"));
    write_css_var(&mut b, "hist-down", tok(&tokens.colors.chart, "hist-down"));

    // =======================================================================
    // 7. 圆角体系
    // =======================================================================
    b.push_str("\n  /* ========================================\n");
    b.push_str("     7. 圆角体系\n");
    b.push_str("     ======================================== */\n\n");
    for key in RADIUS_KEYS {
        if *key == "btn" || *key == "card" {
            continue; // 已在上面的结构属性中输出
        }
        if let Some(&v) = tokens.radii.get(*key) {
            if *key == "full" {
                b.push_str(&format!("  --radius-{}:\t {}px;\n", key, v));
            } else {
                write_css_var_px_int(&mut b, &format!("radius-{}", key), v);
            }
        }
    }

    b.push_str("}\n");
    b
}

// ---- HashMap 取值辅助 ----

fn tok<'a>(map: &'a HashMap<String, String>, key: &str) -> &'a str {
    map.get(key).map(|s| s.as_str()).unwrap_or("")
}

fn tok_int(map: &HashMap<String, i32>, key: &str) -> i32 {
    map.get(key).copied().unwrap_or(0)
}

fn tok_f64(map: &HashMap<String, f64>, key: &str) -> f64 {
    map.get(key).copied().unwrap_or(0.0)
}

// ---- 测试 ----

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_tokens() {
        let tokens = parse_tokens();
        assert_eq!(tokens.version, "1.0");
        assert_eq!(tokens.colors.semantic.get("up").unwrap(), "#ef5350");
        assert_eq!(tokens.colors.dark_endpoint.get("bg-root").unwrap(), "#0c0c0e");
        assert_eq!(tokens.colors.light_endpoint.get("bg-root").unwrap(), "#f5f5f7");
        assert_eq!(tokens.colors.chart.get("vol-up").unwrap(), "rgba(239, 83, 80, 0.55)");
    }

    #[test]
    fn test_generate_css_contains_keywords() {
        let css = generate_css();
        assert!(css.contains(":root"));
        assert!(css.contains("--up:"));
        assert!(css.contains("--down:"));
        assert!(css.contains("--bg-root:"));
        assert!(css.contains("--font-display:"));
        assert!(css.contains("--space-1:"));
        assert!(css.contains("--btn-radius:"));
        assert!(css.contains("Libra Design Tokens"));
        assert!(css.ends_with("}\n"));
    }

    #[test]
    fn test_generate_css_semantic_count() {
        let css = generate_css();
        // 统计 -- 开头的 CSS 变量行数
        let var_count = css.lines()
            .filter(|l| l.trim().starts_with("--") && l.contains(':'))
            .count();
        assert!(var_count >= 75, "expected >= 75 CSS vars, got {}", var_count);
        assert!(var_count <= 82, "expected <= 82 CSS vars, got {}", var_count);
    }

    #[test]
    fn test_calc_pad_values() {
        assert_eq!(calc_pad("up"), 16);
        assert_eq!(calc_pad("bg-card-hover"), 24);
        assert_eq!(calc_pad("weight-semibold"), 24);
    }
}
