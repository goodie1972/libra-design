use leptos::prelude::*;
use leptos::ev;

/// 开关组件
#[component]
pub fn Switch(
    #[prop(default = false)]
    checked: bool,
    #[prop(default = false)]
    disabled: bool,
    #[prop(optional)]
    on_change: Option<Callback<(bool,)>>,
) -> impl IntoView {
    let onchange = move |ev: ev::Event| {
        let checked = event_target_checked(&ev);
        if let Some(ref cb) = on_change {
            cb.run((checked,));
        }
    };

    let track_class = if checked {
        "libra-switch-track libra-switch-track--on"
    } else {
        "libra-switch-track"
    };

    view! {
        <label class="libra-switch-wrapper">
            <input
                type="checkbox"
                class="libra-switch-input"
                prop:checked=checked
                disabled=disabled
                on:change=onchange
            />
            <span class=track_class>
                <span class="libra-switch-thumb"></span>
            </span>
        </label>
    }
}
