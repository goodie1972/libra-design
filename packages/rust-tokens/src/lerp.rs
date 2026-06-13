// 颜色运算 — 线性插值

/// 将 hex 颜色（#RGB / #RRGGBB / #RRGGBBAA）解析为 RGBA 分量 (0-255)。
/// 无 alpha 时默认 a=255。
fn parse_hex(hex: &str) -> (u8, u8, u8, u8) {
    let hex = hex.trim_start_matches('#');
    match hex.len() {
        3 => {
            let r = u8::from_str_radix(&hex[0..1].repeat(2), 16).unwrap_or(0);
            let g = u8::from_str_radix(&hex[1..2].repeat(2), 16).unwrap_or(0);
            let b = u8::from_str_radix(&hex[2..3].repeat(2), 16).unwrap_or(0);
            (r, g, b, 255)
        }
        6 => {
            let r = u8::from_str_radix(&hex[0..2], 16).unwrap_or(0);
            let g = u8::from_str_radix(&hex[2..4], 16).unwrap_or(0);
            let b = u8::from_str_radix(&hex[4..6], 16).unwrap_or(0);
            (r, g, b, 255)
        }
        8 => {
            let r = u8::from_str_radix(&hex[0..2], 16).unwrap_or(0);
            let g = u8::from_str_radix(&hex[2..4], 16).unwrap_or(0);
            let b = u8::from_str_radix(&hex[4..6], 16).unwrap_or(0);
            let a = u8::from_str_radix(&hex[6..8], 16).unwrap_or(255);
            (r, g, b, a)
        }
        _ => (0, 0, 0, 255),
    }
}

/// 将 hex 颜色字符串解析为 RGB 分量，忽略 alpha。
pub fn hex_to_rgb(hex: &str) -> (u8, u8, u8) {
    let (r, g, b, _) = parse_hex(hex);
    (r, g, b)
}

/// 将 RGB 分量格式化为 #RRGGBB。
pub fn rgb_to_hex(r: u8, g: u8, b: u8) -> String {
    format!("#{:02x}{:02x}{:02x}", r, g, b)
}

/// 将 t 限制在 [0, 1] 范围内。
fn clamp01(t: f64) -> f64 {
    t.clamp(0.0, 1.0)
}

/// 数值线性插值。t=0 返回 a，t=1 返回 b。
pub fn lerp_linear(a: f64, b: f64, t: f64) -> f64 {
    let t = clamp01(t);
    a + (b - a) * t
}

/// 在两个 hex 颜色之间进行线性 RGB 插值。
///
/// 支持 #RGB / #RRGGBB / #RRGGBBAA 格式。
/// 仅当两个颜色都有 alpha 通道时才对 alpha 进行插值。
/// t=0 返回 a，t=1 返回 b，中间值线性混合。
pub fn lerp_color(a: &str, b: &str, t: f64) -> String {
    let t = clamp01(t);
    if t == 0.0 {
        return a.to_string();
    }
    if t == 1.0 {
        return b.to_string();
    }

    let (ra, ga, ba, aa) = parse_hex(a);
    let (rb, gb, bb, ab) = parse_hex(b);

    let r = lerp_linear(ra as f64, rb as f64, t).round() as u8;
    let g = lerp_linear(ga as f64, gb as f64, t).round() as u8;
    let bv = lerp_linear(ba as f64, bb as f64, t).round() as u8;

    // 仅当两者都有 alpha 信息时才插值 alpha
    if a.len() >= 8 && b.len() >= 8 {
        let av = lerp_linear(aa as f64, ab as f64, t).round() as u8;
        format!("#{:02x}{:02x}{:02x}{:02x}", r, g, bv, av)
    } else {
        format!("#{:02x}{:02x}{:02x}", r, g, bv)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_clamp01() {
        assert!((clamp01(-0.5) - 0.0).abs() < f64::EPSILON);
        assert!((clamp01(0.5) - 0.5).abs() < f64::EPSILON);
        assert!((clamp01(1.5) - 1.0).abs() < f64::EPSILON);
    }

    #[test]
    fn test_lerp_linear() {
        assert!((lerp_linear(10.0, 20.0, 0.0) - 10.0).abs() < f64::EPSILON);
        assert!((lerp_linear(10.0, 20.0, 1.0) - 20.0).abs() < f64::EPSILON);
        assert!((lerp_linear(10.0, 20.0, 0.5) - 15.0).abs() < f64::EPSILON);
    }

    #[test]
    fn test_hex_to_rgb() {
        assert_eq!(hex_to_rgb("#ef5350"), (239, 83, 80));
        assert_eq!(hex_to_rgb("#26a69a"), (38, 166, 154));
        assert_eq!(hex_to_rgb("#fff"), (255, 255, 255));
        assert_eq!(hex_to_rgb("#000"), (0, 0, 0));
    }

    #[test]
    fn test_rgb_to_hex() {
        assert_eq!(rgb_to_hex(239, 83, 80), "#ef5350");
        assert_eq!(rgb_to_hex(38, 166, 154), "#26a69a");
    }

    #[test]
    fn test_lerp_color_edges() {
        assert_eq!(lerp_color("#ef5350", "#26a69a", 0.0), "#ef5350");
        assert_eq!(lerp_color("#ef5350", "#26a69a", 1.0), "#26a69a");
    }

    #[test]
    fn test_lerp_color_mid() {
        let result = lerp_color("#000000", "#ffffff", 0.5);
        // #808080 ≈ #7f7f7f — 由于四舍五入可能是 #808080
        assert!(result == "#808080" || result == "#7f7f7f",
            "mid gray should be near 808080, got {}", result);
    }

    #[test]
    fn test_lerp_color_with_alpha() {
        let result = lerp_color("#000000ff", "#ffffffff", 0.5);
        assert_eq!(result, "#808080ff");
    }

    #[test]
    fn test_hex_to_rgb_3digit() {
        assert_eq!(hex_to_rgb("#f00"), (255, 0, 0));
        assert_eq!(hex_to_rgb("#0f0"), (0, 255, 0));
        assert_eq!(hex_to_rgb("#00f"), (0, 0, 255));
    }

    #[test]
    fn test_parse_hex_8digit() {
        let (r, g, b, a) = parse_hex("#ef535080");
        assert_eq!(r, 239);
        assert_eq!(g, 83);
        assert_eq!(b, 80);
        assert_eq!(a, 128);
    }
}
