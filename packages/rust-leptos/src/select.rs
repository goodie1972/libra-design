use leptos::prelude::*;

/// 下拉选择组件
#[component]
pub fn Select(
    #[prop(optional)]
    label: Option<String>,
    #[prop(optional)]
    placeholder: Option<String>,
    #[prop(optional)]
    error: Option<String>,
    #[prop(default = false)]
    disabled: bool,
    children: Children,
) -> impl IntoView {
    let has_error = error.is_some();
    let select_class = if has_error {
        "libra-select libra-select--error"
    } else {
        "libra-select"
    };

    view! {
        <div class="libra-select-wrapper">
            {label.map(|l| view! { <label class="libra-select-label">{l}</label> })}
            <select class=select_class disabled=disabled>
                {placeholder.map(|p| view! { <option value="" disabled=true selected=true>{p}</option> })}
                {children()}
            </select>
            {error.map(|e| view! { <span class="libra-select-error">{e}</span> })}
        </div>
    }
}
