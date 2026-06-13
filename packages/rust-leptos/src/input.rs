use leptos::prelude::*;

/// 输入框组件
#[component]
pub fn Input(
    #[prop(optional)]
    label: Option<String>,
    #[prop(optional)]
    placeholder: Option<String>,
    #[prop(optional)]
    error: Option<String>,
    #[prop(default = false)]
    disabled: bool,
    #[prop(optional)]
    value: Option<String>,
    #[prop(optional)]
    on_input: Option<Callback<(String,)>>,
) -> impl IntoView {
    let has_error = error.is_some();
    let err_cls = if has_error { " libra-input--error" } else { "" };
    let input_class = format!("libra-input{}", err_cls);

    let mut children: Vec<AnyView> = Vec::new();
    if let Some(l) = label {
        children.push(view! { <label class="libra-input-label">{l}</label> }.into_any());
    }
    children.push(
        view! {
            <input
                class=input_class
                placeholder=placeholder.unwrap_or_default()
                disabled=disabled
                value=value.unwrap_or_default()
                on:input=move |ev| {
                    let val = event_target_value(&ev);
                    if let Some(ref cb) = on_input {
                        cb.run((val,));
                    }
                }
            />
        }
        .into_any(),
    );
    if let Some(e) = error {
        children.push(view! { <span class="libra-input-error">{e}</span> }.into_any());
    }

    view! {
        <div class="libra-input-wrapper">
            {children}
        </div>
    }
}
