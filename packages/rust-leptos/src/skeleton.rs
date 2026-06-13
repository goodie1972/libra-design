use leptos::prelude::*;

/// 骨架屏组件
/// variant: text / card / avatar
#[component]
pub fn Skeleton(
    #[prop(default = "text".into())]
    variant: String,
    #[prop(default = 1)]
    rows: u32,
) -> impl IntoView {
    let base_class = format!("libra-skeleton libra-skeleton--{}", variant);
    let inner = match variant.as_str() {
        "avatar" => {
            vec![view! { <div class="libra-skeleton-avatar"></div> }.into_any()]
        }
        "card" => {
            vec![
                view! { <div class="libra-skeleton-card-image"></div> }.into_any(),
                view! { <div class="libra-skeleton-card-line libra-skeleton-card-line--short"></div> }.into_any(),
                view! { <div class="libra-skeleton-card-line"></div> }.into_any(),
            ]
        }
        _ => {
            // text variant
            (0..rows)
                .map(|i| {
                    let line_class = if i == rows.saturating_sub(1) && rows > 1 {
                        "libra-skeleton-line libra-skeleton-line--short"
                    } else {
                        "libra-skeleton-line"
                    };
                    view! { <div class=line_class></div> }.into_any()
                })
                .collect()
        }
    };

    view! {
        <div class=base_class>
            {inner}
        </div>
    }
}
