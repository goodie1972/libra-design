# go-cli — Libra Go 原生 CLI

> 单二进制。零依赖。`libra init` 一把生成 tokens.css。

## 为什么不用 npm CLI？

npm CLI 需要 Node 运行时 + 200MB node_modules。Go 版本是单二进制，~8MB，`go install` 一键安装。

## 安装

```bash
go install github.com/libra/go-cli/cmd/libra@latest
```

## 用法

```bash
# 生成 tokens.css（78 个 CSS 变量）
libra init

# 指定输出路径
libra init --out dist/tokens.css

# 帮助
libra help
```

## 输出示例

```css
:root {
  --up:              #ef5350;
  --down:            #26a69a;
  --bg-root:         #0c0c0e;
  --bg-card:         #121214;
  --text-primary:    #e8e8ed;
  --accent:          #4a6cf7;
  --font-mono:       'JetBrains Mono', 'SF Mono', monospace;
  --text-base:       13px;
  --space-4:         16px;
  /* ... 共 78 个 CSS 变量 */
}
```

## npm 等价命令

```bash
# npm 版
npx @libra-design/cli init
# Go 版（更快，零依赖）
libra init
```

## 许可

MIT
