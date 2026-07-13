---
layout: home

hero:
  name: Libra Design
  text: 极致审美的设计语言
  tagline: 专为 Go/Rust 量身定制的多语言金融设计系统
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/
    - theme: alt
      text: GitHub
      link: https://github.com/goodie1972/libra-design

features:
  - title: Go Native
    details: 单二进制 CLI，零运行时依赖，40+ 金融 templ 组件
    code: |
      ```go
      import "github.com/goodie1972/go-tokens"
      upColor := tokens.ColorUp // "#ef5350"
      ```
  - title: Rust (crates.io)
    details: 色值常量 + LerpColor + CSS 生成，20+ Leptos 组件
    code: |
      ```rust
      use libra_tokens::colors::dark;
      let bg = dark::BG_ROOT; // "#0c0c0e"
      ```
  - title: TypeScript
    details: CSS 变量 + TS 类型，64+ React 金融组件
    code: |
      ```ts
      import '@libra-design/tokens/css'
      import { Button, StockTable } from '@libra-design/react'
      ```
---
