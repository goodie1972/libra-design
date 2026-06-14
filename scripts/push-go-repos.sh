#!/bin/bash
# 将 4 个 Go 包推送到独立 GitHub 仓库
# 先分别在 GitHub 上创建:
#   github.com/goodie1972/go-tokens
#   github.com/goodie1972/go-templ
#   github.com/goodie1972/go-cli
#   github.com/goodie1972/go-mcp
# 然后执行此脚本

BASE=/d/bobo/go-repos

for repo in go-tokens go-templ go-cli go-mcp; do
  cd $BASE/$repo
  git init
  git add -A
  git commit -m "initial: standalone $repo from libra-design monorepo"
  git remote add origin git@github.com:goodie1972/$repo.git
  git branch -M main
  echo "Ready to push: $repo"
  # 取消注释以下行自动推送:
  # git push -u origin main
done

echo ""
echo "=== 全部就绪 ==="
echo "检查无误后，取消上面 git push 的注释再执行一次"
