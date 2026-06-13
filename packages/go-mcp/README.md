# go-mcp — Libra MCP Server（Go 原生）

> AI Agent 消费设计令牌的最佳方式。单二进制，10ms 冷启动，零依赖。

## 为什么 Go 版 MCP？

npm MCP Server 需要 `npx` + Node 运行时，冷启动 500ms+。Go 版本 10ms 冷启动，单文件部署，适合生产环境 AI 工作流。

## 安装

```bash
go install github.com/libra/go-mcp@latest
libra-mcp
```

## MCP 配置

在你的 AI 助手 MCP 配置中添加：

```json
{
  "mcpServers": {
    "libra": {
      "command": "libra-mcp"
    }
  }
}
```

## 可用工具

| 工具 | 功能 | 示例 |
|------|------|------|
| `get_design_tokens` | 返回完整设计令牌 JSON | 色值、字体、间距、圆角 |
| `generate_css` | 生成 tokens.css | 78 个 CSS 自定义属性 |
| `lerp_color` | hex 颜色线性插值 | `#0c0c0e → #ffffff, t=0.5 → #858586` |

## 可用资源

| 资源 URI | 内容 |
|----------|------|
| `libra://tokens/design-tokens.json` | 语言无关设计令牌 |
| `libra://css/tokens.css` | 完整 CSS 变量文件 |

## 协议

标准 MCP JSON-RPC 2.0 over stdio。纯 Go 标准库实现，零外部 MCP SDK 依赖。

## 许可

MIT
