// Package tokens 提供 Libra 设计系统的色值常量、颜色运算和 CSS 生成。
//
// 设计令牌从 ../../tokens/design-tokens.json 手动移植，保持与 TS 版本一致。
// 组件契约：
//  1. 所有颜色使用 CSS 自定义属性，禁止硬编码 hex
//  2. 数值列强制等宽字体 + tabular-nums
//  3. 涨跌色仅用 --up(红涨)/--down(绿跌)
//  4. 间距只用 4px 倍数（8 个值）
//  5. 暗色模式不靠 box-shadow，靠四层表面堆叠区分层级
package tokens

import (
	_ "embed"
	"encoding/json"
	"fmt"
	"math"
	"strconv"
	"strings"
)

// ---- 嵌入的 design-tokens.json ----

//go:embed design-tokens.json
var rawTokens []byte

// DesignTokens 是 language-agnostic 设计令牌的完整结构
type DesignTokens struct {
	Version    string            `json:"version"`
	Colors     ColorsSection     `json:"colors"`
	Typography TypographySection `json:"typography"`
	Spacing    map[string]int    `json:"spacing"`
	Radii      map[string]int    `json:"radii"`
	Component  map[string]string `json:"component"`
}

// ColorsSection 颜色分区
type ColorsSection struct {
	Semantic     map[string]string `json:"semantic"`
	DarkEndpoint map[string]string `json:"dark_endpoint"`
	LightEndpoint map[string]string `json:"light_endpoint"`
	Chart        map[string]string `json:"chart"`
}

// TypographySection 字体分区
type TypographySection struct {
	Families map[string]string  `json:"families"`
	Sizes    map[string]float64 `json:"sizes"`
	Weights  map[string]int     `json:"weights"`
	Tracking map[string]float64 `json:"tracking"`
	Leading  map[string]float64 `json:"leading"`
}

// Tokens 是解析后的设计令牌全局实例
var Tokens DesignTokens

func init() {
	if err := json.Unmarshal(rawTokens, &Tokens); err != nil {
		panic(fmt.Sprintf("tokens: 无法解析 design-tokens.json: %v", err))
	}
}

// ---- 语义色常量（手动移植，与 types.ts SEMANTIC_COLORS 一致）----

const (
	ColorUp        = "#ef5350"
	ColorDown      = "#26a69a"
	ColorFlat      = "#9e9e9e"
	ColorUpBg      = "rgba(239, 83, 80, 0.08)"
	ColorUpLight   = "#ff8a80"
	ColorDownBg    = "rgba(38, 166, 154, 0.08)"
	ColorDownLight = "#64d8cb"
	ColorMA5       = "#f8b500"
	ColorMA10      = "#4a6cf7"
	ColorMA20      = "#9c27b0"
	ColorMA60      = "#009688"
	ColorMA120     = "#ff7043"
	ColorMA250     = "#78909c"
	ColorSuccess   = "#34a853"
	ColorWarning   = "#fbbc04"
	ColorError     = "#ea4335"
)

// ---- 暗色端点常量 ----

const (
	DarkBgRoot       = "#0c0c0e"
	DarkBgMain       = "#0c0c0e"
	DarkBgSidebar    = "#0c0c0e"
	DarkBgCard       = "#121214"
	DarkBgCardHover  = "#18181b"
	DarkBgInput      = "#18181b"
	DarkBgChart      = "#0c0c0e"
	DarkBgSubPanel   = "#121214"
	DarkBorderMain   = "#1e1e22"
	DarkBorderSub    = "#161618"
	DarkBorderInput  = "#1e1e22"
	DarkTextPrimary  = "#e8e8ed"
	DarkTextSecondary = "#9a9aa0"
	DarkTextTertiary = "#63636a"
	DarkAccent       = "#4a6cf7"
	DarkAccentHover  = "#5d7cf9"
	DarkGridLine     = "#18191c"
)

// ---- 亮色端点常量 ----

const (
	LightBgRoot       = "#f5f5f7"
	LightBgMain       = "#f5f5f7"
	LightBgSidebar    = "#f5f5f7"
	LightBgCard       = "#ffffff"
	LightBgCardHover  = "#f0f0f2"
	LightBgInput      = "#eaeaee"
	LightBgChart      = "#f5f5f7"
	LightBgSubPanel   = "#ffffff"
	LightBorderMain   = "#d4d4d8"
	LightBorderSub    = "#e8e8ec"
	LightBorderInput  = "#d4d4d8"
	LightTextPrimary  = "#0d0d12"
	LightTextSecondary = "#555566"
	LightTextTertiary = "#8e8e98"
	LightAccent       = "#533afd"
	LightAccentHover  = "#4527e0"
	LightGridLine     = "#e8ecf0"
)

// ---- 颜色运算 ----

// LerpColor 在两个 hex 颜色（#RRGGBB 或 #RRGGBBAA）之间线性插值。
// t=0 返回 a，t=1 返回 b。alpha 通道仅在两者都有 alpha 时插值。
func LerpColor(a, b string, t float64) string {
	t = clamp01(t)
	if t == 0 {
		return a
	}
	if t == 1 {
		return b
	}

	ra, ga, ba, aa := parseHex(a)
	rb, gb, bb, ab := parseHex(b)

	r := uint8(lerpLinear(float64(ra), float64(rb), t))
	g := uint8(lerpLinear(float64(ga), float64(gb), t))
	bv := uint8(lerpLinear(float64(ba), float64(bb), t))

	// 仅当两者都有 alpha 信息时才插值 alpha
	if len(a) >= 8 && len(b) >= 8 {
		av := uint8(lerpLinear(float64(aa), float64(ab), t))
		return fmt.Sprintf("#%02x%02x%02x%02x", r, g, bv, av)
	}
	return fmt.Sprintf("#%02x%02x%02x", r, g, bv)
}

// LerpLinear 线性插值。t=0 返回 a，t=1 返回 b。
func LerpLinear(a, b, t float64) float64 {
	return a + (b-a)*clamp01(t)
}

func clamp01(v float64) float64 {
	if v < 0 {
		return 0
	}
	if v > 1 {
		return 1
	}
	return v
}

// lerpLinear is the internal alias for readability when mixing with ints
func lerpLinear(a, b, t float64) float64 {
	return LerpLinear(a, b, t)
}

// parseHex 解析 hex 颜色字符串为 0-255 的 RGBA 分量。
// 支持 #RGB, #RRGGBB, #RRGGBBAA 格式。
func parseHex(hex string) (r, g, b, a int) {
	hex = strings.TrimPrefix(hex, "#")
	a = 255

	switch len(hex) {
	case 3:
		r = parseHexByte(strings.Repeat(hex[0:1], 2))
		g = parseHexByte(strings.Repeat(hex[1:2], 2))
		b = parseHexByte(strings.Repeat(hex[2:3], 2))
	case 6:
		r = parseHexByte(hex[0:2])
		g = parseHexByte(hex[2:4])
		b = parseHexByte(hex[4:6])
	case 8:
		r = parseHexByte(hex[0:2])
		g = parseHexByte(hex[2:4])
		b = parseHexByte(hex[4:6])
		a = parseHexByte(hex[6:8])
	default:
		return 0, 0, 0, 255
	}
	return
}

func parseHexByte(s string) int {
	v, err := strconv.ParseInt(s, 16, 32)
	if err != nil {
		return 0
	}
	return int(v)
}

// RoundToSpacing 将值对齐到最近的 4px 间距倍数。
func RoundToSpacing(v float64) float64 {
	return math.Round(v/4) * 4
}

// ---- CSS 生成 ----

// GenerateCSS 从设计令牌生成完整的 CSS 自定义属性文件。
// 输出与 @libra-design/tokens 的 index.css 一致，共 ~140 个 CSS 变量。
func GenerateCSS() string {
	var b strings.Builder

	b.WriteString("/* ============================================================\n")
	b.WriteString("   Libra Design Tokens — 由 libra init 生成\n")
	b.WriteString(fmt.Sprintf("   版本: %s\n", Tokens.Version))
	b.WriteString("   双主题起始值（暗色端点），由 applyMix() 动态改写\n")
	b.WriteString("   ============================================================ */\n\n")
	b.WriteString(":root {\n")

	// 1. 语义色
	b.WriteString("  /* ========================================\n")
	b.WriteString("     1. 语义色（全局常量，不随主题变化）\n")
	b.WriteString("     ======================================== */\n\n")
	b.WriteString("  /* 涨跌色 — A 股惯例：红涨绿跌 */\n")
	writeCSSVar(&b, "up", Tokens.Colors.Semantic["up"])
	writeCSSVar(&b, "down", Tokens.Colors.Semantic["down"])
	writeCSSVar(&b, "flat", Tokens.Colors.Semantic["flat"])
	b.WriteString("\n  /* 涨跌辅助色 */\n")
	writeCSSVar(&b, "up-bg", Tokens.Colors.Semantic["up-bg"])
	writeCSSVar(&b, "up-light", Tokens.Colors.Semantic["up-light"])
	writeCSSVar(&b, "down-bg", Tokens.Colors.Semantic["down-bg"])
	writeCSSVar(&b, "down-light", Tokens.Colors.Semantic["down-light"])
	b.WriteString("\n  /* K 线均线色 */\n")
	writeCSSVar(&b, "ma5", Tokens.Colors.Semantic["ma5"])
	writeCSSVar(&b, "ma10", Tokens.Colors.Semantic["ma10"])
	writeCSSVar(&b, "ma20", Tokens.Colors.Semantic["ma20"])
	writeCSSVar(&b, "ma60", Tokens.Colors.Semantic["ma60"])
	writeCSSVar(&b, "ma120", Tokens.Colors.Semantic["ma120"])
	writeCSSVar(&b, "ma250", Tokens.Colors.Semantic["ma250"])
	b.WriteString("\n  /* 功能色 */\n")
	writeCSSVar(&b, "success", Tokens.Colors.Semantic["success"])
	writeCSSVar(&b, "warning", Tokens.Colors.Semantic["warning"])
	writeCSSVar(&b, "error", Tokens.Colors.Semantic["error"])

	// 2. 主题色（暗色端点）
	b.WriteString("\n  /* ========================================\n")
	b.WriteString("     2. 主题色（暗色端点 t=0）\n")
	b.WriteString("     ======================================== */\n\n")
	b.WriteString("  /* 背景系 — 四层表面堆叠体系（参考 Linear） */\n")
	writeCSSVar(&b, "bg-root", Tokens.Colors.DarkEndpoint["bg-root"])
	writeCSSVar(&b, "bg-main", Tokens.Colors.DarkEndpoint["bg-main"])
	writeCSSVar(&b, "bg-sidebar", Tokens.Colors.DarkEndpoint["bg-sidebar"])
	writeCSSVar(&b, "bg-card", Tokens.Colors.DarkEndpoint["bg-card"])
	writeCSSVar(&b, "bg-card-hover", Tokens.Colors.DarkEndpoint["bg-card-hover"])
	writeCSSVar(&b, "bg-input", Tokens.Colors.DarkEndpoint["bg-input"])
	writeCSSVar(&b, "bg-chart", Tokens.Colors.DarkEndpoint["bg-chart"])
	writeCSSVar(&b, "bg-sub-panel", Tokens.Colors.DarkEndpoint["bg-sub-panel"])
	b.WriteString("\n  /* 边框系 */\n")
	writeCSSVar(&b, "border-main", Tokens.Colors.DarkEndpoint["border-main"])
	writeCSSVar(&b, "border-sub", Tokens.Colors.DarkEndpoint["border-sub"])
	writeCSSVar(&b, "border-input", Tokens.Colors.DarkEndpoint["border-input"])
	b.WriteString("\n  /* 文字系 */\n")
	writeCSSVar(&b, "text-primary", Tokens.Colors.DarkEndpoint["text-primary"])
	writeCSSVar(&b, "text-secondary", Tokens.Colors.DarkEndpoint["text-secondary"])
	writeCSSVar(&b, "text-tertiary", Tokens.Colors.DarkEndpoint["text-tertiary"])
	b.WriteString("\n  /* 交互色 */\n")
	writeCSSVar(&b, "accent", Tokens.Colors.DarkEndpoint["accent"])
	writeCSSVar(&b, "accent-hover", Tokens.Colors.DarkEndpoint["accent-hover"])

	// 3. 字体系统
	b.WriteString("\n  /* ========================================\n")
	b.WriteString("     3. 字体系统\n")
	b.WriteString("     ======================================== */\n\n")
	writeCSSVarRaw(&b, "font-display", Tokens.Typography.Families["display"])
	writeCSSVarRaw(&b, "font-body", Tokens.Typography.Families["body"])
	writeCSSVarRaw(&b, "font-mono", Tokens.Typography.Families["mono"])
	b.WriteString("\n  /* 字号阶梯 */\n")
	for _, k := range sizeKeys {
		writeCSSVarPx(&b, "text-"+k, Tokens.Typography.Sizes[k])
	}
	b.WriteString("\n  /* 字重 */\n")
	writeCSSVarNum(&b, "weight-normal", Tokens.Typography.Weights["normal"])
	writeCSSVarNum(&b, "weight-medium", Tokens.Typography.Weights["medium"])
	writeCSSVarNum(&b, "weight-semibold", Tokens.Typography.Weights["semibold"])
	writeCSSVarNum(&b, "weight-bold", Tokens.Typography.Weights["bold"])
	b.WriteString("\n  /* 字距 */\n")
	for _, k := range trackingKeys {
		writeCSSVarEm(&b, "tracking-"+k, Tokens.Typography.Tracking[k])
	}
	b.WriteString("\n  /* 行高 */\n")
	writeCSSVarFloat(&b, "leading-tight", Tokens.Typography.Leading["tight"])
	writeCSSVarFloat(&b, "leading-normal", Tokens.Typography.Leading["normal"])
	writeCSSVarFloat(&b, "leading-loose", Tokens.Typography.Leading["loose"])

	// 4. 间距系统
	b.WriteString("\n  /* ========================================\n")
	b.WriteString("     4. 间距系统（4px 基数）\n")
	b.WriteString("     ======================================== */\n\n")
	for _, k := range spaceKeys {
		if v, ok := Tokens.Spacing[k]; ok {
			writeCSSVarPxInt(&b, "space-"+k, v)
		}
	}

	// 5. 结构属性
	b.WriteString("\n  /* ========================================\n")
	b.WriteString("     5. 结构属性（会被 applyMix 动态改写）\n")
	b.WriteString("     ======================================== */\n\n")
	writeCSSVarPxInt(&b, "btn-radius", Tokens.Radii["btn"])
	writeCSSVarPxInt(&b, "card-radius", Tokens.Radii["card"])
	writeCSSVarRaw(&b, "card-shadow", Tokens.Component["card-shadow"])
	writeCSSVarRaw(&b, "card-border", Tokens.Component["card-border"])

	// 6. 图表专用变量
	b.WriteString("\n  /* ========================================\n")
	b.WriteString("     6. 图表专用变量\n")
	b.WriteString("     ======================================== */\n\n")
	writeCSSVar(&b, "grid-line", Tokens.Colors.DarkEndpoint["grid-line"])
	writeCSSVar(&b, "vol-up", Tokens.Colors.Chart["vol-up"])
	writeCSSVar(&b, "vol-down", Tokens.Colors.Chart["vol-down"])
	writeCSSVar(&b, "hist-up", Tokens.Colors.Chart["hist-up"])
	writeCSSVar(&b, "hist-down", Tokens.Colors.Chart["hist-down"])

	// 7. 圆角体系
	b.WriteString("\n  /* ========================================\n")
	b.WriteString("     7. 圆角体系\n")
	b.WriteString("     ======================================== */\n\n")
	for _, k := range radiusKeys {
		if k == "btn" || k == "card" {
			continue // 已在上面的结构属性中输出
		}
		if v, ok := Tokens.Radii[k]; ok {
			if k == "full" {
				b.WriteString(fmt.Sprintf("  --radius-%s:   %dpx;\n", k, v))
			} else {
				writeCSSVarPxInt(&b, "radius-"+k, v)
			}
		}
	}

	b.WriteString("}\n")
	return b.String()
}

// 有序 key 列表，保证 CSS 输出顺序与 index.css 一致
var sizeKeys = []string{"xs", "sm", "base", "md", "lg", "xl", "2xl", "3xl", "4xl"}
var trackingKeys = []string{"display", "title", "subtitle", "body", "label"}
var spaceKeys = []string{"1", "2", "3", "4", "5", "6", "7", "8"}
var leadingKeys = []string{"tight", "normal", "loose"}
var radiusKeys = []string{"sm", "md", "lg", "xl", "full", "btn", "card"}

// ---- CSS 写入辅助函数 ----

func writeCSSVar(b *strings.Builder, name, value string) {
	if value == "" {
		return
	}
	pad := calcPad(name)
	b.WriteString(fmt.Sprintf("  --%-*s %s;\n", pad, name+":", value))
}

func writeCSSVarRaw(b *strings.Builder, name, value string) {
	if value == "" {
		return
	}
	pad := calcPad(name)
	b.WriteString(fmt.Sprintf("  --%-*s %s;\n", pad, name+":", value))
}

func writeCSSVarPx(b *strings.Builder, name string, value float64) {
	if value == 0 {
		return
	}
	pad := calcPad(name)
	b.WriteString(fmt.Sprintf("  --%-*s %.0fpx;\n", pad, name+":", value))
}

func writeCSSVarPxInt(b *strings.Builder, name string, value int) {
	if value == 0 {
		return
	}
	pad := calcPad(name)
	b.WriteString(fmt.Sprintf("  --%-*s %dpx;\n", pad, name+":", value))
}

func writeCSSVarEm(b *strings.Builder, name string, value float64) {
	pad := calcPad(name)
	b.WriteString(fmt.Sprintf("  --%-*s %.2fem;\n", pad, name+":", value))
}

func writeCSSVarNum(b *strings.Builder, name string, value int) {
	if value == 0 {
		return
	}
	pad := calcPad(name)
	b.WriteString(fmt.Sprintf("  --%-*s %d;\n", pad, name+":", value))
}

func writeCSSVarFloat(b *strings.Builder, name string, value float64) {
	if value == 0 {
		return
	}
	pad := calcPad(name)
	b.WriteString(fmt.Sprintf("  --%-*s %.1f;\n", pad, name+":", value))
}

// calcPad 计算对齐宽度
func calcPad(name string) int {
	base := len(name) + 2 // "--" prefix
	switch {
	case base <= 10:
		return 16
	case base <= 14:
		return 20
	case base <= 18:
		return 24
	default:
		return 28
	}
}
