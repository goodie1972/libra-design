package mcp

import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/libra/go-tokens"
)

// registerTools 返回所有可用工具的定义
func registerTools() []Tool {
	return []Tool{
		{
			Name:        "get_design_tokens",
			Description: "返回 Libra 设计系统的完整设计令牌（颜色、字体、间距、圆角等），JSON 格式",
			InputSchema: InputSchema{
				Type:       "object",
				Properties: map[string]Property{},
			},
		},
		{
			Name:        "generate_css",
			Description: "从设计令牌生成完整的 tokens.css 文件（包含所有 CSS 自定义属性）",
			InputSchema: InputSchema{
				Type:       "object",
				Properties: map[string]Property{},
			},
		},
		{
			Name:        "lerp_color",
			Description: "在两个 hex 颜色之间线性插值。t=0 返回 color_a，t=1 返回 color_b",
			InputSchema: InputSchema{
				Type: "object",
				Properties: map[string]Property{
					"color_a": {Type: "string", Description: "起始 hex 颜色，如 #0c0c0e"},
					"color_b": {Type: "string", Description: "结束 hex 颜色，如 #f5f5f7"},
					"t":       {Type: "number", Description: "插值比例 (0-1)"},
				},
				Required: []string{"color_a", "color_b", "t"},
			},
		},
	}
}

// callTool 根据工具名称分发调用
func callTool(name string, args json.RawMessage) (*CallToolResult, error) {
	switch name {
	case "get_design_tokens":
		return handleGetDesignTokens()
	case "generate_css":
		return handleGenerateCSS()
	case "lerp_color":
		return handleLerpColor(args)
	default:
		return nil, fmt.Errorf("未知工具: %s", name)
	}
}

func handleGetDesignTokens() (*CallToolResult, error) {
	data, err := os.ReadFile("../../tokens/design-tokens.json")
	if err != nil {
		// 回退：从 go-tokens 模块读取嵌入式副本
		css := tokens.GenerateCSS()
		return &CallToolResult{
			Content: []ContentItem{
				{Type: "text", Text: fmt.Sprintf("无法读取 design-tokens.json：%v\n\n请使用 generate_css 工具获取 CSS 变量列表", err)},
			},
		}, fmt.Errorf("无法读取 tokens/design-tokens.json，请使用 generate_css 工具: %w", err)
		_ = css // suppress unused warning
	}
	// 美化输出 JSON
	var pretty map[string]interface{}
	json.Unmarshal(data, &pretty)
	prettyJSON, _ := json.MarshalIndent(pretty, "", "  ")
	return &CallToolResult{
		Content: []ContentItem{
			{Type: "text", Text: string(prettyJSON)},
		},
	}, nil
}

func handleGenerateCSS() (*CallToolResult, error) {
	css := tokens.GenerateCSS()
	return &CallToolResult{
		Content: []ContentItem{
			{Type: "text", Text: css},
		},
	}, nil
}

func handleLerpColor(args json.RawMessage) (*CallToolResult, error) {
	var params struct {
		A string  `json:"color_a"`
		B string  `json:"color_b"`
		T float64 `json:"t"`
	}
	if err := json.Unmarshal(args, &params); err != nil {
		return nil, fmt.Errorf("参数解析失败: %w", err)
	}
	result := tokens.LerpColor(params.A, params.B, params.T)
	return &CallToolResult{
		Content: []ContentItem{
			{Type: "text", Text: result},
		},
	}, nil
}
