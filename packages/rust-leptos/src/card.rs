use leptos::prelude::*;

/// 卡片容器组件
#[component]
pub fn Card(
    #[prop(optional)]
    class: Option<String>,
    children: Children,
) -> impl IntoView {
    let cls = class
        .map(|c| format!("libra-card {}", c))
        .unwrap_or_else(|| "libra-card".into());
    view! {
        <div class=cls>
            {children()}
        </div>
    }
}

/// 卡片头部
#[component]
pub fn CardHeader(
    children: Children,
) -> impl IntoView {
    view! {
        <div class="libra-card-header">
            {children()}
        </div>
    }
}

/// 卡片标题
#[component]
pub fn CardTitle(
    children: Children,
) -> impl IntoView {
    view! {
        <h3 class="libra-card-title">
            {children()}
        </h3>
    }
}

/// 卡片内容区域
#[component]
pub fn CardContent(
    children: Children,
) -> impl IntoView {
    view! {
        <div class="libra-card-content">
            {children()}
        </div>
    }
}
