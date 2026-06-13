use leptos::prelude::*;

/// 警告提示组件
/// variant: info / success / warning / error
#[component]
pub fn Alert(
    #[prop(default = "info".into())]
    variant: String,
    #[prop(optional)]
    title: Option<String>,
    #[prop(optional)]
    closable: Option<bool>,
    #[prop(optional)]
    on_close: Option<Callback<()>>,
    children: Children,
) -> impl IntoView {
    let class = format!("libra-alert libra-alert--{}", variant);
    let title_view = title.map(|t| view! { <strong class="libra-alert-title">{t}</strong> }.into_any());
    let close_btn = closable.unwrap_or(false).then(|| {
        view! {
            <button class="libra-alert-close" on:click=move |_| {
                if let Some(cb) = on_close {
                    cb.run(());
                }
            }>"x"</button>
        }.into_any()
    });

    view! {
        <div class=class role="alert">
            <div class="libra-alert-icon"></div>
            <div class="libra-alert-body">
                {title_view}
                <div class="libra-alert-message">
                    {children()}
                </div>
            </div>
            {close_btn}
        </div>
    }
}
