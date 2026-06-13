use leptos::prelude::*;

/// 按钮组件
/// variant: default / secondary / ghost / danger
/// size: default / sm / lg
#[component]
pub fn Button(
    #[prop(default = "default".into())]
    variant: String,
    #[prop(default = "default".into())]
    size: String,
    #[prop(default = false)]
    disabled: bool,
    #[prop(optional)]
    on_click: Option<Callback<()>>,
    children: Children,
) -> impl IntoView {
    let class = format!("libra-btn libra-btn--{} libra-btn--{}", variant, size);
    view! {
        <button class=class disabled=disabled on:click=move |_| {
            if let Some(cb) = on_click {
                cb.run(());
            }
        }>
            {children()}
        </button>
    }
}
