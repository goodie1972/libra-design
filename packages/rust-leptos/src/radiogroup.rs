use leptos::prelude::*;

/// 单选按钮组组件
#[component]
pub fn RadioGroup(
    children: Children,
) -> impl IntoView {
    view! {
        <div class="libra-radio-group" role="radiogroup">
            {children()}
        </div>
    }
}

/// 单选项
#[component]
pub fn RadioItem(
    #[prop(optional)]
    value: Option<String>,
    #[prop(optional)]
    label: Option<String>,
    #[prop(default = false)]
    disabled: bool,
) -> impl IntoView {
    let val = value.unwrap_or_default();
    let label_view = label.map(|l| view! { <span class="libra-radio-label">{l}</span> });
    view! {
        <label class="libra-radio-item">
            <input
                type="radio"
                class="libra-radio-input"
                value=val
                disabled=disabled
            />
            <span class="libra-radio-indicator"></span>
            {label_view}
        </label>
    }
}
