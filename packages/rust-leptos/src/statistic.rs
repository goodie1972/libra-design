use leptos::prelude::*;

/// 统计数值组件
#[component]
pub fn Statistic(
    #[prop(optional)]
    label: Option<String>,
    #[prop(default = "0".into())]
    value: String,
    #[prop(optional)]
    trend: Option<String>,
    #[prop(optional)]
    precision: Option<u32>,
) -> impl IntoView {
    let formatted = if let Some(prec) = precision {
        let val: f64 = value.parse().unwrap_or(0.0);
        format!("{:.1$}", val, prec as usize)
    } else {
        value
    };

    let trend_class = trend
        .as_ref()
        .map(|t| format!("libra-statistic-trend libra-statistic-trend--{}", t));

    view! {
        <div class="libra-statistic">
            {label.map(|l| view! { <div class="libra-statistic-label">{l}</div> })}
            <div class="libra-statistic-value">{formatted}</div>
            {trend_class.map(|cls| view! { <div class=cls></div> })}
        </div>
    }
}
