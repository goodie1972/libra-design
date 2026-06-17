// libra-mcp — Libra 设计系统 MCP Server
//
// 通过 stdio 提供 MCP 协议接口，向 AI 编程助手暴露 Libra 设计令牌。
//
// 工具:
//   - get_design_tokens — 返回完整设计令牌 JSON
//   - generate_css      — 生成 tokens.css
//   - lerp_color        — hex 颜色间线性插值
//
// 资源:
//   - libra://tokens/design-tokens.json
//   - libra://css/tokens.css
package main

import (
	"log"
	"os"

	"github.com/goodie1972/go-mcp/mcp"
)

func main() {
	server := mcp.NewServer()
	if err := server.Run(); err != nil {
		log.Printf("libra-mcp 退出: %v", err)
		os.Exit(1)
	}
}
