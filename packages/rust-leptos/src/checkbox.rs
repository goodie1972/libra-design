use leptos::prelude::*;

/// 自定义复选框组件
#[component]
pub fn Checkbox(
    #[prop(default = false)]
    checked: bool,
    #[prop(optional)]
    label: Option<String>,
    #[prop(default = false)]
    disabled: bool,
    #[prop(optional)]
    on_change: Option<Callback<(bool,)>>,
) -> impl IntoView {
    let class = if checked {
        "libra-checkbox libra-checkbox--checked"
    } else {
        "libra-checkbox"
    };

    let label_view = label.map(|l| {
        view! { <span class="libra-checkbox-label">{l}</span> }.into_any()
    });

    view! {
        <label class="libra-checkbox-wrapper">
            <input
                type="checkbox"
                class=class
                prop:checked=checked
                disabled=disabled
                on:change=move |ev| {
                    let is_checked = event_target_checked(&ev);
                    if let Some(cb) = on_change {
                        cb.run((is_checked,));
                    }
                }
            />
            <span class="libra-checkbox-indicator"></span>
            {label_view}
        </label>
    }
}
