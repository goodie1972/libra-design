use leptos::prelude::*;

/// 进度条组件
#[component]
pub fn Progress(
    #[prop(default = 0)]
    percent: u32,
    #[prop(optional)]
    color: Option<String>,
) -> impl IntoView {
    let pct = percent.min(100);
    let color_style = color
        .map(|c| format!("width: {}%; background-color: {};", pct, c))
        .unwrap_or_else(|| format!("width: {}%;", pct));

    view! {
        <div class="libra-progress">
            <div class="libra-progress-trail">
                <div class="libra-progress-bar" style=color_style></div>
            </div>
            <span class="libra-progress-text">{pct}"%"</span>
        </div>
    }
}
