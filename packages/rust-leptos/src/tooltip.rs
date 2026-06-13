use leptos::prelude::*;

/// 工具提示组件
#[component]
pub fn Tooltip(
    #[prop(default = "top".into())]
    placement: String,
    #[prop(default = "".into())]
    text: String,
    children: Children,
) -> impl IntoView {
    let class = format!("libra-tooltip libra-tooltip--{}", placement);

    view! {
        <div class="libra-tooltip-wrapper">
            {children()}
            <div class=class>
                <span class="libra-tooltip-arrow"></span>
                <span class="libra-tooltip-text">{text}</span>
            </div>
        </div>
    }
}
