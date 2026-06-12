# @libra/mcp-server

MCP Server for Libra Design System — exposes design tokens and component generation to AI agents (Claude Code, Cursor, etc.).

## Usage

### Claude Code

Add to `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "libra": {
      "command": "npx",
      "args": ["@libra/mcp-server"]
    }
  }
}
```

### Tools

| Tool | Description |
|------|-------------|
| `get_tokens` | Return all CSS custom properties (dark/light mode) |
| `get_semantic_colors` | Return semantic color palette |
| `get_typography` | Return font stacks and size scale |
| `get_spacing` | Return 4px spacing scale |
| `get_components` | Return component specs |
| `generate_css` | Generate tokens.css |
| `generate_component` | Generate React component code |
