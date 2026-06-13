use leptos::prelude::*;

/// 股票卡片组件
#[component]
pub fn StockCard(
    #[prop(default = "".into())]
    name: String,
    #[prop(default = "".into())]
    code: String,
    #[prop(default = "0.00".into())]
    price: String,
    #[prop(default = "0.00".into())]
    change: String,
    #[prop(default = "0.00%".into())]
    change_pct: String,
) -> impl IntoView {
    let change_f: f64 = change.parse().unwrap_or(0.0);
    let color_class = if change_f > 0.0 {
        "libra-stock-card libra-stock-card--up"
    } else if change_f < 0.0 {
        "libra-stock-card libra-stock-card--down"
    } else {
        "libra-stock-card"
    };

    view! {
        <div class=color_class>
            <div class="libra-stock-card-info">
                <span class="libra-stock-card-name">{name}</span>
                <span class="libra-stock-card-code">{code}</span>
            </div>
            <div class="libra-stock-card-data">
                <span class="libra-stock-card-price">{price}</span>
                <span class="libra-stock-card-change">{change}</span>
                <span class="libra-stock-card-change-pct">{change_pct}</span>
            </div>
        </div>
    }
}
