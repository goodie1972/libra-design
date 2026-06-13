use leptos::prelude::*;

/// 模态对话框组件
#[component]
pub fn Modal(
    #[prop(default = false)]
    show: bool,
    #[prop(optional)]
    title: Option<String>,
    #[prop(optional)]
    on_close: Option<Callback<()>>,
    children: Children,
) -> impl IntoView {
    let display_class = if show { "libra-modal libra-modal--open" } else { "libra-modal" };

    view! {
        <div class=display_class>
            <div class="libra-modal-mask" on:click=move |_| {
                if let Some(cb) = on_close {
                    cb.run(());
                }
            }></div>
            <div class="libra-modal-content">
                <div class="libra-modal-header">
                    <h3 class="libra-modal-title">{title.unwrap_or_default()}</h3>
                    <button class="libra-modal-close" on:click=move |_| {
                        if let Some(cb) = on_close {
                            cb.run(());
                        }
                    }>"x"</button>
                </div>
                <div class="libra-modal-body">
                    {children()}
                </div>
            </div>
        </div>
    }
}
