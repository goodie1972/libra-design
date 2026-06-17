// 10 套命名金融主题 — 从 tokens/themes/*.json 嵌入二进制。
//
// 与 Rust libra-tokens::themes 对齐：
//   - ListThemes()  ←→ rust list_themes()
//   - GetTheme(id)  ←→ rust get_theme(id)
//   - AllThemes()   ←→ rust all_themes()
//
// 主题文件在编译期通过 //go:embed 打进二进制，运行时零外部文件依赖。
package tokens

import (
	"embed"
	"encoding/json"
	"fmt"
	"sort"
	"strings"
)

// ---- 嵌入的 10 套命名主题 ----

//go:embed themes/*.json
var themeFiles embed.FS

// Colors 单个端点（暗色或亮色）的 17 色集合。
//
// JSON 字段为 kebab-case（bg-root）。Go 的 encoding/json 没有
// rename_all 机制，因此每个字段都必须显式打 json tag。
type Colors struct {
	BgRoot        string `json:"bg-root"`
	BgMain        string `json:"bg-main"`
	BgSidebar     string `json:"bg-sidebar"`
	BgCard        string `json:"bg-card"`
	BgCardHover   string `json:"bg-card-hover"`
	BgInput       string `json:"bg-input"`
	BgChart       string `json:"bg-chart"`
	BgSubPanel    string `json:"bg-sub-panel"`
	BorderMain    string `json:"border-main"`
	BorderSub     string `json:"border-sub"`
	BorderInput   string `json:"border-input"`
	TextPrimary   string `json:"text-primary"`
	TextSecondary string `json:"text-secondary"`
	TextTertiary  string `json:"text-tertiary"`
	Accent        string `json:"accent"`
	AccentHover   string `json:"accent-hover"`
	GridLine      string `json:"grid-line"`
}

// Theme 完整主题定义，对应 tokens/themes/{id}.json。
type Theme struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Dark        Colors `json:"dark"`
	Light       Colors `json:"light"`
}

// ListThemes 返回所有可用主题的 ID（按字母序）。
func ListThemes() []string {
	entries, err := themeFiles.ReadDir("themes")
	if err != nil {
		return nil
	}
	var ids []string
	for _, e := range entries {
		if e.IsDir() || !strings.HasSuffix(e.Name(), ".json") {
			continue
		}
		ids = append(ids, strings.TrimSuffix(e.Name(), ".json"))
	}
	sort.Strings(ids)
	return ids
}

// GetTheme 按 ID 加载单个主题。找不到或解析失败返回错误。
func GetTheme(id string) (*Theme, error) {
	data, err := themeFiles.ReadFile(fmt.Sprintf("themes/%s.json", id))
	if err != nil {
		return nil, fmt.Errorf("tokens: 主题 %q 不存在: %w", id, err)
	}
	var t Theme
	if err := json.Unmarshal(data, &t); err != nil {
		return nil, fmt.Errorf("tokens: 解析主题 %q 失败: %w", id, err)
	}
	return &t, nil
}

// AllThemes 加载全部主题。
func AllThemes() ([]Theme, error) {
	ids := ListThemes()
	themes := make([]Theme, 0, len(ids))
	for _, id := range ids {
		t, err := GetTheme(id)
		if err != nil {
			return nil, err
		}
		themes = append(themes, *t)
	}
	return themes, nil
}
