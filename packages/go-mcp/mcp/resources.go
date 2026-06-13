package mcp

import (
	"fmt"
	"os"

	"github.com/libra/go-tokens"
)

// registerResources 返回所有可用资源
func registerResources() []Resource {
	return []Resource{
		{
			URI:         "libra://tokens/design-tokens.json",
			Name:        "Design Tokens JSON",
			Description: "Libra 设计系统的语言无关设计令牌定义",
			MimeType:    "application/json",
		},
		{
			URI:         "libra://css/tokens.css",
			Name:        "Tokens CSS",
			Description: "Libra 设计系统的 CSS 自定义属性文件",
			MimeType:    "text/css",
		},
	}
}

// readResource 根据 URI 读取资源内容
func readResource(uri string) (*ReadResourceResult, error) {
	switch uri {
	case "libra://tokens/design-tokens.json":
		data, err := os.ReadFile("../../tokens/design-tokens.json")
		if err != nil {
			return nil, fmt.Errorf("无法读取 design-tokens.json: %w", err)
		}
		return &ReadResourceResult{
			Contents: []ResourceContent{
				{URI: uri, MimeType: "application/json", Text: string(data)},
			},
		}, nil
	case "libra://css/tokens.css":
		css := tokens.GenerateCSS()
		return &ReadResourceResult{
			Contents: []ResourceContent{
				{URI: uri, MimeType: "text/css", Text: css},
			},
		}, nil
	default:
		return nil, fmt.Errorf("未知资源: %s", uri)
	}
}
