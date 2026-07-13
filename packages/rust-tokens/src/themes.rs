// 主题管理 — 从 build.rs 编译时生成的 EMBEDDED_THEMES 加载。
//
// 主题 JSON 在编译期通过 build.rs 的 include_str! 嵌入二进制，
// 运行时零外部文件依赖。与 Go tokens.ListThemes() 行为一致。

use serde::Deserialize;

// build.rs 生成的编译时嵌入主题数据
include!(concat!(env!("OUT_DIR"), "/themes_generated.rs"));

// ---- 数据结构 ----

/// 主题的暗色/亮色端点 17 色集合。
///
/// JSON 字段使用 kebab-case（bg-root），Rust 映射为 snake_case（bg_root）。
#[derive(Debug, Clone, Deserialize, PartialEq)]
#[serde(rename_all = "kebab-case")]
pub struct Colors {
    pub bg_root: String,
    pub bg_main: String,
    pub bg_sidebar: String,
    pub bg_card: String,
    pub bg_card_hover: String,
    pub bg_input: String,
    pub bg_chart: String,
    pub bg_sub_panel: String,
    pub border_main: String,
    pub border_sub: String,
    pub border_input: String,
    pub text_primary: String,
    pub text_secondary: String,
    pub text_tertiary: String,
    pub accent: String,
    pub accent_hover: String,
    pub grid_line: String,
}

/// 完整主题定义。
#[derive(Debug, Clone, Deserialize, PartialEq)]
pub struct Theme {
    pub id: String,
    pub name: String,
    pub description: String,
    pub dark: Colors,
    pub light: Colors,
}

// ---- 公开 API ----

/// 返回所有可用主题 ID 列表（按字母序）。
pub fn list_themes() -> Vec<String> {
    EMBEDDED_THEMES.iter().map(|(id, _)| id.to_string()).collect()
}

/// 按 ID 获取主题。找不到返回 None。
pub fn get_theme(id: &str) -> Option<Theme> {
    let (_, content) = EMBEDDED_THEMES.iter().find(|(key, _)| *key == id)?;
    serde_json::from_str(content).ok()
}

/// 返回所有主题。
pub fn all_themes() -> Vec<Theme> {
    EMBEDDED_THEMES
        .iter()
        .filter_map(|(_, content)| serde_json::from_str(content).ok())
        .collect()
}

// ---- 测试 ----

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_list_themes() {
        let ids = list_themes();
        assert!(!ids.is_empty(), "应有至少一个主题文件");
        assert!(ids.contains(&"terminal".to_string()), "应包含 terminal 主题");
        assert!(ids.contains(&"circuit".to_string()), "应包含 circuit 主题");
    }

    #[test]
    fn test_get_terminal_theme() {
        let theme = get_theme("terminal")
            .expect("terminal 主题应存在");
        assert_eq!(theme.id, "terminal");
        assert_eq!(theme.name, "Terminal");
        assert!(theme.description.contains("Bloomberg"));
        // 验证暗色端点
        assert_eq!(theme.dark.bg_root, "#0c0c0e");
        assert_eq!(theme.dark.accent, "#f59e0b"); // 橙琥珀色
        // 验证亮色端点
        assert_eq!(theme.light.bg_root, "#faf8f5");
        assert_eq!(theme.light.accent, "#d97706");
    }

    #[test]
    fn test_get_nonexistent_theme() {
        assert!(get_theme("nonexistent_theme_xyz").is_none());
    }

    #[test]
    fn test_all_themes() {
        let themes = all_themes();
        assert!(themes.len() >= 10, "应有至少 10 个主题，实际 {}", themes.len());
    }

    #[test]
    fn test_theme_colors_structure() {
        let theme = get_theme("candlestick").unwrap();
        // 验证所有 17 个字段均非空
        assert!(!theme.dark.bg_root.is_empty());
        assert!(!theme.dark.bg_main.is_empty());
        assert!(!theme.dark.bg_sidebar.is_empty());
        assert!(!theme.dark.bg_card.is_empty());
        assert!(!theme.dark.bg_card_hover.is_empty());
        assert!(!theme.dark.bg_input.is_empty());
        assert!(!theme.dark.bg_chart.is_empty());
        assert!(!theme.dark.bg_sub_panel.is_empty());
        assert!(!theme.dark.border_main.is_empty());
        assert!(!theme.dark.border_sub.is_empty());
        assert!(!theme.dark.border_input.is_empty());
        assert!(!theme.dark.text_primary.is_empty());
        assert!(!theme.dark.text_secondary.is_empty());
        assert!(!theme.dark.text_tertiary.is_empty());
        assert!(!theme.dark.accent.is_empty());
        assert!(!theme.dark.accent_hover.is_empty());
        assert!(!theme.dark.grid_line.is_empty());
        // 亮色同理
        assert!(!theme.light.bg_root.is_empty());
        assert!(!theme.light.accent.is_empty());
    }
}
