# Libra Design — 路线图

> 路线图已迁移至仓库根目录的 [PLAN.md](../PLAN.md)
>
> 该文档包含：
> - 10 套主题系统详细规格
> - 组件覆盖矩阵 (React 44→64, Go 10→40)
> - Bloomberg Terminal 对标分析
> - Phase 4-8 执行计划
> - 每次交付验证标准

---

## 历史版本

- v0.1.0 (2026-06-12): 初始发布 — 5 个 npm 包 (@libra-design/tokens/theme/react/cli/mcp-server)，15 个 React 组件
- v0.1.2 (2026-06-13): React 扩展至 44 组件 + 10 Go templ 组件 + MCP Server e2e 验证
- v0.1.3 (2026-06-13 ~ 2026-06-17): Phase 5-7 完成 — React 44→64 组件，Go templ 10→40 组件
- v0.1.4 (2026-06-18 ~ 2026-06-20): Phase 4 主题系统完成（10 套命名金融主题）+ Rust crates 发布 (libra-tokens/libra-leptos) + Vitest 测试套件 133 用例
- v0.1.9 (2026-07-13): 图标三叠层系统（Tabler/Phosphor/Lucide 统一 `<Icon>` 组件）+ 字体系统（Inter/JetBrains Mono/Noto Sans SC/霞鹜文楷 CSS 变量）+ Phase 1-4 代码质量完善（Tailwind 重构、ARIA a11y、JSDoc、rgba→CSS 变量）

