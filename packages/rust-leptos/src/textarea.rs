use leptos::prelude::*;

/// 多行文本输入框组件
#[component]
pub fn Textarea(
    #[prop(optional)]
    label: Option<String>,
    #[prop(optional)]
    placeholder: Option<String>,
    #[prop(optional)]
    error: Option<String>,
    #[prop(default = false)]
    disabled: bool,
    #[prop(optional)]
    rows: Option<u32>,
) -> impl IntoView {
    let has_error = error.is_some();
    let textarea_class = if has_error {
        "libra-textarea libra-textarea--error"
    } else {
        "libra-textarea"
    };
    let row_count = rows.unwrap_or(3);

    view! {
        <div class="libra-textarea-wrapper">
            {label.map(|l| view! { <label class="libra-textarea-label">{l}</label> })}
            <textarea
                class=textarea_class
                placeholder=placeholder.unwrap_or_default()
                disabled=disabled
                rows=row_count
            ></textarea>
            {error.map(|e| view! { <span class="libra-textarea-error">{e}</span> })}
        </div>
    }
}
