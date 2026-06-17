package tokens

import (
	"strings"
	"testing"
)

func TestListThemes(t *testing.T) {
	ids := ListThemes()
	if len(ids) != 10 {
		t.Fatalf("ListThemes 返回 %d 项，期望 10: %v", len(ids), ids)
	}
	for _, want := range []string{
		"terminal", "ticker", "vault", "margin", "ledger",
		"prospectus", "arbitrage", "circuit", "candlestick", "clearing",
	} {
		found := false
		for _, got := range ids {
			if got == want {
				found = true
				break
			}
		}
		if !found {
			t.Errorf("ListThemes 缺少主题 %q", want)
		}
	}
}

func TestGetTerminalTheme(t *testing.T) {
	th, err := GetTheme("terminal")
	if err != nil {
		t.Fatalf("GetTheme(\"terminal\") 失败: %v", err)
	}
	if th.ID != "terminal" {
		t.Errorf("ID = %q, 期望 terminal", th.ID)
	}
	if !strings.Contains(th.Description, "Bloomberg") {
		t.Errorf("Description 缺少 Bloomberg: %q", th.Description)
	}
	// 暗色端点（对齐 Rust themes.rs 测试断言）
	if th.Dark.BgRoot != "#0c0c0e" {
		t.Errorf("Dark.BgRoot = %q, 期望 #0c0c0e", th.Dark.BgRoot)
	}
	if th.Dark.Accent != "#f59e0b" {
		t.Errorf("Dark.Accent = %q, 期望 #f59e0b (琥珀)", th.Dark.Accent)
	}
	// 亮色端点
	if th.Light.BgRoot != "#faf8f5" {
		t.Errorf("Light.BgRoot = %q, 期望 #faf8f5", th.Light.BgRoot)
	}
	if th.Light.Accent != "#d97706" {
		t.Errorf("Light.Accent = %q, 期望 #d97706", th.Light.Accent)
	}
}

func TestGetNonexistentTheme(t *testing.T) {
	if _, err := GetTheme("nonexistent_xyz"); err == nil {
		t.Error("GetTheme 对不存在主题应返回错误")
	}
}

func TestAllThemes(t *testing.T) {
	themes, err := AllThemes()
	if err != nil {
		t.Fatalf("AllThemes 失败: %v", err)
	}
	if len(themes) != 10 {
		t.Errorf("AllThemes 返回 %d 项，期望 10", len(themes))
	}
}
