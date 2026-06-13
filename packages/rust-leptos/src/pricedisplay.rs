use leptos::prelude::*;

/// 价格展示组件 — 支持涨跌色 + 等宽数字
#[component]
pub fn PriceDisplay(
    #[prop(default = "0.00".into())]
    price: String,
    #[prop(default = 2)]
    decimals: u32,
    #[prop(default = false)]
    show_currency: bool,
    #[prop(default = "".into())]
    change: String,
) -> impl IntoView {
    let price_val: f64 = price.parse().unwrap_or(0.0);
    let formatted_price = format!("{:.1$}", price_val, decimals as usize);
    let change_f: f64 = change.parse().unwrap_or(0.0);
    let color_class = if change_f > 0.0 {
        "libra-price libra-price--up"
    } else if change_f < 0.0 {
        "libra-price libra-price--down"
    } else {
        "libra-price libra-price--flat"
    };

    let currency = if show_currency { "$" } else { "" };
    let change_view = (!change.is_empty()).then(|| {
        let sign = if change_f > 0.0 { "+" } else { "" };
        let change_text = format!(" {}{}", sign, change);
        view! {
            <span class="libra-price-change">{change_text}</span>
        }
    });

    view! {
        <span class=color_class>
            <span class="libra-price-num">{currency}{formatted_price}</span>
            {change_view}
        </span>
    }
}
