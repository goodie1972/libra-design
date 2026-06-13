use leptos::prelude::*;

/// Tabs 组件 — 水平 tab + active 指示
#[component]
pub fn Tabs(
    children: Children,
) -> impl IntoView {
    view! {
        <div class="libra-tabs">
            {children()}
        </div>
    }
}

/// Tab 选项
#[component]
pub fn TabItem(
    #[prop(optional)]
    label: Option<String>,
    #[prop(default = false)]
    active: bool,
    #[prop(optional)]
    on_click: Option<Callback<()>>,
) -> impl IntoView {
    let class = if active {
        "libra-tab-item libra-tab-item--active"
    } else {
        "libra-tab-item"
    };

    view! {
        <button class=class on:click=move |_| {
            if let Some(cb) = on_click {
                cb.run(());
            }
        }>
            {label.unwrap_or_default()}
        </button>
    }
}
