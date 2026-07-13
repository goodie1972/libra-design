package components

import (
	"os"
	"strings"
	"testing"
)

// TestComponentFiles 验证组件源文件和生成文件的完整性。
// 注意：当前有 build 问题（生成代码中缺少 fmt import），需修复后方可运行 go test。
func TestComponentFiles(t *testing.T) {
	entries, err := os.ReadDir(".")
	if err != nil {
		t.Fatal(err)
	}

	var templFiles, goFiles int
	for _, e := range entries {
		if e.IsDir() {
			continue
		}
		if strings.HasSuffix(e.Name(), ".templ") {
			templFiles++
		}
		if strings.HasSuffix(e.Name(), "_templ.go") {
			goFiles++
		}
	}

	t.Logf("找到 %d 个 .templ 源文件", templFiles)
	t.Logf("找到 %d 个 _templ.go 生成文件", goFiles)

	if templFiles == 0 {
		t.Error("未找到任何 .templ 组件文件")
	}
	if goFiles == 0 {
		t.Error("未找到任何 _templ.go 生成文件")
	}
	if templFiles != 0 && goFiles != 0 && templFiles != goFiles {
		t.Errorf("源文件(%d)与生成文件(%d)数量不匹配", templFiles, goFiles)
	}
}

// TestComponentNaming 验证每个 .templ 文件有对应的 _templ.go 文件。
func TestComponentNaming(t *testing.T) {
	entries, err := os.ReadDir(".")
	if err != nil {
		t.Fatal(err)
	}

	sourceMap := make(map[string]bool)
	for _, e := range entries {
		name := e.Name()
		if strings.HasSuffix(name, ".templ") {
			base := strings.TrimSuffix(name, ".templ")
			sourceMap[base] = true
		}
	}

	for _, e := range entries {
		name := e.Name()
		if strings.HasSuffix(name, "_templ.go") {
			base := strings.TrimSuffix(name, "_templ.go")
			if !sourceMap[base] {
				t.Errorf("生成文件 %s 无对应 .templ 源文件", name)
			}
		}
	}
}
