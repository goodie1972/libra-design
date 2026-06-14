// libra — Libra 设计系统 CLI
//
//   libra init         生成 tokens.css（当前目录）
//   libra init --out path/to/tokens.css  指定输出路径
//
// 安装: git clone 后本地 go build
package main

import (
	"flag"
	"fmt"
	"os"

	"github.com/libra/go-tokens"
)

func main() {
	initCmd := flag.NewFlagSet("init", flag.ExitOnError)
	outPath := initCmd.String("out", "tokens.css", "输出文件路径")

	if len(os.Args) < 2 {
		printUsage()
		os.Exit(1)
	}

	switch os.Args[1] {
	case "init":
		initCmd.Parse(os.Args[2:])
		css := tokens.GenerateCSS()
		if err := os.WriteFile(*outPath, []byte(css), 0644); err != nil {
			fmt.Fprintf(os.Stderr, "libra: 写入失败: %v\n", err)
			os.Exit(1)
		}
		fmt.Printf("✓ 已生成 %s (%d 字节)\n", *outPath, len(css))
	case "help", "-h", "--help":
		printUsage()
	default:
		fmt.Fprintf(os.Stderr, "libra: 未知命令: %s\n", os.Args[1])
		printUsage()
		os.Exit(1)
	}
}

func printUsage() {
	fmt.Println(`Libra 设计系统 CLI

用法:
  libra init [--out <路径>]    生成 tokens.css（默认输出到当前目录 tokens.css）
  libra help                   显示帮助

示例:
  libra init                    # → ./tokens.css
  libra init --out dist/tokens.css  # → dist/tokens.css`)
}
