use leptos::prelude::*;

/// 标签组件
/// variant: default / primary / success / warning / error
#[component]
pub fn Tag(
    #[prop(default = "default".into())]
    variant: String,
    children: Children,
) -> impl IntoView {
    let class = format!("libra-tag libra-tag--{}", variant);
    view! {
        <span class=class>
            {children()}
        </span>
    }
}
