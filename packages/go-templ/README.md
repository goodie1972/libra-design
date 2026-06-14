# @libra-design/go-templ

Libra 设计系统 — Go templ 金融级组件库。

## 组件列表

| 组件 | 文件 | 说明 |
|------|------|------|
| **Button** | `button.templ` | 按钮（default/secondary/ghost/danger）+ 尺寸（sm/lg/icon） |
| **Card** | `card.templ` | 卡片容器，子组件 CardHeader、CardTitle、CardContent |
| **Table** | `table.templ` | 金融表格，sticky header + 斑马条纹 + 等宽数字 |
| **Badge** | `badge.templ` | 标签（up/down/flat/success/warning/error） |
| **Input** | `input.templ` | 输入框，深色背景 + error 状态 + disabled |
| **Tabs** | `tabs.templ` | 水平标签页，底部 --accent 指示条 |
| **Modal** | `modal.templ` | 模态框，半透明暗色 overlay + 居中卡片 |
| **PriceDisplay** | `pricedisplay.templ` | 价格展示，等宽大字 + 红涨绿跌 |
| **StockCard** | `stockcard.templ` | 股票卡片，代码 + 价格 + 涨跌幅 + 成交量 |
| **MarketBoard** | `marketboard.templ` | 大盘指数，点位 + 涨跌 indicator |

## 设计规范

- **色彩**：全部使用 CSS 自定义属性（`var(--xxx)`），禁止硬编码 hex 值
- **涨跌**：统一使用 `var(--up)` 红色涨 / `var(--down)` 绿色跌
- **数字**：所有数值列使用等宽字体（`--font-mono`）+ `tabular-nums`
- **间距**：仅使用 4px 倍数（`--space-1` 到 `--space-8`）
- **暗色模式**：四层表面堆叠体系（`--bg-root` > `--bg-card` > `--bg-card-hover` > `--bg-input`）

## 使用

```go
package main

import (
    "github.com/goodie1972/go-templ/components"
    "net/http"
)

func main() {
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        components.Button("default", "default", false, nil).Render(r.Context(), w)
    })
    http.ListenAndServe(":8080", nil)
}
```

## 开发

```bash
# 安装依赖
go mod tidy

# 生成 Go 代码
templ generate ./...

# 编译检查
go build ./...
```

## 依赖

- `github.com/a-h/templ` — Go 模板引擎
- `github.com/goodie1972/go-tokens` — Libra 设计令牌
