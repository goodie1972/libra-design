use leptos::prelude::*;

/// 徽章组件
/// variant: up / down / flat / success / warning / error
#[component]
pub fn Badge(
    #[prop(default = "flat".into())]
    variant: String,
    children: Children,
) -> impl IntoView {
    let class = format!("libra-badge libra-badge--{}", variant);
    view! {
        <span class=class>
            {children()}
        </span>
    }
}
