use leptos::prelude::*;

/// 表格组件
#[component]
pub fn Table(
    #[prop(optional)]
    class: Option<String>,
    children: Children,
) -> impl IntoView {
    let cls = class
        .map(|c| format!("libra-table {}", c))
        .unwrap_or_else(|| "libra-table".into());
    view! {
        <table class=cls>
            {children()}
        </table>
    }
}
