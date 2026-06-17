// libra-server — 单二进制金融仪表盘
//
// 构建:  go build -o libra-server.exe .
// 运行:  ./libra-server.exe
// 访问:  http://localhost:8080
//
// 一个 Go 二进制 = 完整金融 UI + HTTP 服务器
// 零 npm、零 Chromium、零运行时依赖
package main

import (
	"context"
	"io"
	"log"
	"net/http"

	"github.com/a-h/templ"
	components "github.com/goodie1972/go-templ/components"
	tokens "github.com/goodie1972/go-tokens"
)

var version = "0.1.0"

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/", dashboardHandler)
	mux.HandleFunc("/partial/watchlist", partialWatchlist)
	mux.HandleFunc("/partial/news", partialNews)

	log.Println("🚀 Libra 金融仪表盘 → http://localhost:8080")
	log.Printf("   单二进制 (%s) · %d Go templ 组件", version, 40)
	if err := http.ListenAndServe(":8080", mux); err != nil {
		log.Fatal(err)
	}
}

func dashboardHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")

	css := tokens.GenerateCSS()
	page := dashboardHTML(css)
	page.Render(r.Context(), w)
}

func dashboardHTML(css string) templ.Component {
	return templ.ComponentFunc(func(ctx context.Context, w io.Writer) error {
		// 行情数据
		type idx struct{ n, v, p, d string }
		indices := []idx{
			{"上证指数", "3382.45", "+1.23", "var(--up)"},
			{"深证成指", "10876.32", "-0.45", "var(--down)"},
			{"创业板指", "2154.78", "+0.88", "var(--up)"},
			{"科创50", "968.50", "+1.56", "var(--up)"},
		}

		io.WriteString(w, `<!DOCTYPE html><html lang="zh-CN"><head>`)
		io.WriteString(w, `<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">`)
		io.WriteString(w, `<title>Libra 金融仪表盘</title>`)
		io.WriteString(w, `<script src="https://unpkg.com/htmx.org@2.0.4"></script>`)
		io.WriteString(w, `<style>`+css+`</style>`)
		io.WriteString(w, `<style>
body{margin:0;background:var(--bg-root);color:var(--text-primary);font-family:var(--font-body);-webkit-font-smoothing:antialiased;}
.wrap{max-width:1060px;margin:0 auto;padding:20px 28px;}
h1{font-size:20px;font-weight:600;letter-spacing:-0.03em;margin:0 0 20px 0;}
h2{font-size:12px;font-weight:500;color:var(--text-secondary);margin:0 0 10px 0;text-transform:uppercase;letter-spacing:0.04em;}
.grid{display:grid;gap:1px;background:var(--border-sub);border:1px solid var(--border-sub);border-radius:var(--card-radius);overflow:hidden;margin-bottom:20px;}
.grid-c4{grid-template-columns:repeat(4,1fr);}
.grid-c2{grid-template-columns:1fr 1fr;}
.idx-card{background:var(--bg-card);padding:18px 20px;text-align:center;transition:background 0.2s;}
.idx-card:hover{background:var(--bg-card-hover);}
.idx-label{font-size:11px;color:var(--text-tertiary);margin-bottom:4px;}
.idx-val{font-size:22px;font-weight:700;font-family:var(--font-mono);font-variant-numeric:tabular-nums;}
.idx-pct{font-size:12px;font-weight:500;font-family:var(--font-mono);margin-top:2px;}
.section{margin-bottom:24px;}
.row{display:flex;gap:16px;flex-wrap:wrap;}
.col{flex:1;min-width:280px;}
.demo{align-items:center;justify-content:center;}
`)

		io.WriteString(w, `</style></head><body>`)
		io.WriteString(w, `<div class="wrap">`)

		// 标题
		io.WriteString(w, `<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">`)
		io.WriteString(w, `<h1 style="margin:0;">📈 Libra 金融仪表盘</h1>`)
		io.WriteString(w, `<span style="font-size:11px;color:var(--text-tertiary);">单二进制 · `+version+`</span>`)
		io.WriteString(w, `</div>`)

		// 行情
		io.WriteString(w, `<div class="grid grid-c4">`)
		for _, i := range indices {
			io.WriteString(w, `<div class="idx-card"><div class="idx-label">`+i.n+`</div>`)
			io.WriteString(w, `<div class="idx-val" style="color:`+i.d+`">`+i.v+`</div>`)
			io.WriteString(w, `<div class="idx-pct" style="color:`+i.d+`">`+i.p+`</div></div>`)
		}
		io.WriteString(w, `</div>`)

		// 组件展示
		io.WriteString(w, `<div class="section"><h2>组件展示</h2><div class="row">`)

		// Badges
		io.WriteString(w, `<div class="col" style="background:var(--bg-card);border:var(--card-border);border-radius:var(--card-radius);padding:16px;">`)
		io.WriteString(w, `<div style="font-size:12px;font-weight:600;margin-bottom:10px;">Badge 涨跌标签</div>`)
		io.WriteString(w, `<div style="display:flex;gap:6px;flex-wrap:wrap;">`)
		components.Badge("涨", "up", nil).Render(ctx, w)
		components.Badge("跌", "down", nil).Render(ctx, w)
		components.Badge("平", "flat", nil).Render(ctx, w)
		components.Badge("成功", "success", nil).Render(ctx, w)
		components.Badge("警告", "warning", nil).Render(ctx, w)
		components.Badge("错误", "error", nil).Render(ctx, w)
		io.WriteString(w, `</div></div>`)

		// Tags
		io.WriteString(w, `<div class="col" style="background:var(--bg-card);border:var(--card-border);border-radius:var(--card-radius);padding:16px;">`)
		io.WriteString(w, `<div style="font-size:12px;font-weight:600;margin-bottom:10px;">Tag 标签</div>`)
		io.WriteString(w, `<div style="display:flex;gap:6px;flex-wrap:wrap;">`)
		components.Tag("默认", "default", false, nil).Render(ctx, w)
		components.Tag("主要", "primary", false, nil).Render(ctx, w)
		components.Tag("成功", "success", false, nil).Render(ctx, w)
		components.Tag("警告", "warning", false, nil).Render(ctx, w)
		components.Tag("错误", "error", false, nil).Render(ctx, w)
		io.WriteString(w, `</div></div>`)

		io.WriteString(w, `</div></div>`)

		// 数据 + 日历
		io.WriteString(w, `<div class="section"><div class="row">`)

		// Watchlist
		io.WriteString(w, `<div class="col"><h2>自选股</h2><div id="watchlist">`)
		wlItems := []components.WatchlistItem{
			{Symbol: "sh600519", Name: "贵州茅台", Price: 1689.50, Change: 2.15, ChangePercent: 2.15},
			{Symbol: "sz000858", Name: "五粮液", Price: 142.80, Change: -1.34, ChangePercent: -1.34},
			{Symbol: "sh601398", Name: "工商银行", Price: 5.89, Change: 0.51, ChangePercent: 0.51},
			{Symbol: "sz300750", Name: "宁德时代", Price: 196.35, Change: -2.87, ChangePercent: -2.87},
		}
		components.Watchlist(wlItems, templ.Attributes{
			"hx-get":    "/partial/watchlist",
			"hx-trigger": "every 30s",
			"hx-target":  "#watchlist",
		}).Render(ctx, w)
		io.WriteString(w, `</div></div>`)

		// Calendar
		io.WriteString(w, `<div class="col"><h2>6月日历</h2>`)
		components.Calendar(2026, 6, []components.CalendarEvent{
			{Day: 15, Type: "earnings", Text: "财报"},
			{Day: 20, Type: "dividend", Text: "除息"},
			{Day: 25, Type: "other", Text: "公告"},
		}, nil).Render(ctx, w)
		io.WriteString(w, `</div>`)

		io.WriteString(w, `</div></div>`)

		// NewsFeed
		io.WriteString(w, `<div class="section"><h2>实时快讯</h2><div id="newsfeed">`)
		components.NewsFeed([]components.NewsItem{
			{Title: "央行今日开展 5000 亿元 MLF 操作", Source: "财联社", Time: "09:45"},
			{Title: "北向资金半日净买入 45.6 亿元", Source: "证券时报", Time: "10:12"},
			{Title: "美联储维持利率不变，符合预期", Source: "Wind", Time: "10:30"},
			{Title: "碳酸锂价格跌破 10 万元/吨", Source: "21财经", Time: "11:00"},
		}, templ.Attributes{
			"hx-get":    "/partial/news",
			"hx-trigger": "every 60s",
			"hx-target":  "#newsfeed",
		}).Render(ctx, w)
		io.WriteString(w, `</div></div>`)

		// Footer
		io.WriteString(w, `<div style="text-align:center;padding:20px 0;font-size:11px;color:var(--text-tertiary);border-top:1px solid var(--border-sub);">`)
		io.WriteString(w, `Libra Design · `)
		io.WriteString(w, `<a href="https://github.com/goodie1972/libra-design" style="color:var(--accent);text-decoration:none;">GitHub</a>`)
		io.WriteString(w, `</div></div></body></html>`)

		return nil
	})
}

func partialWatchlist(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	// 模拟价格波动
	items := []components.WatchlistItem{
		{Symbol: "sh600519", Name: "贵州茅台", Price: 1690.50, Change: 2.20, ChangePercent: 2.20},
		{Symbol: "sz000858", Name: "五粮液", Price: 143.00, Change: -1.10, ChangePercent: -1.10},
		{Symbol: "sh601398", Name: "工商银行", Price: 5.92, Change: 0.54, ChangePercent: 0.54},
		{Symbol: "sz300750", Name: "宁德时代", Price: 197.10, Change: -2.50, ChangePercent: -2.50},
	}
	components.Watchlist(items, nil).Render(r.Context(), w)
}

func partialNews(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	components.NewsFeed([]components.NewsItem{
		{Title: "AI 芯片板块持续走强，寒武纪涨超 8%", Source: "实时更新", Time: "13:45"},
		{Title: "港股恒指午后涨幅扩大至 2%", Source: "实时更新", Time: "13:30"},
	}, nil).Render(r.Context(), w)
}
