import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Libra Design',
  description: '极致审美的设计语言，专为 Go/Rust 量身定制',
  lang: 'zh-CN',
  ignoreDeadLinks: true,

  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/' },
      { text: '组件', link: '/components/' },
      { text: '主题', link: '/themes/' },
      { text: 'API', link: '/api/' },
      { text: 'GitHub', link: 'https://github.com/goodie1972/libra-design' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '入门',
          items: [
            { text: '简介', link: '/guide/' },
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '安装指南', link: '/guide/installation' },
          ],
        },
        {
          text: '配套模块',
          items: [
            { text: '图标系统', link: '/guide/icons' },
            { text: '字体系统', link: '/guide/fonts' },
          ],
        },
        {
          text: '语言绑定',
          items: [
            { text: 'Go', link: '/guide/go' },
            { text: 'Rust', link: '/guide/rust' },
            { text: 'TypeScript', link: '/guide/typescript' },
          ],
        },
      ],
      '/components/': [
        {
          text: '组件',
          items: [
            { text: '概览', link: '/components/' },
            { text: 'Go Templ', link: '/components/go-templ' },
            { text: 'Rust Leptos', link: '/components/rust-leptos' },
            { text: 'React', link: '/components/react' },
          ],
        },
      ],
      '/themes/': [
        {
          text: '主题系统',
          items: [
            { text: 'Theme Registry', link: '/themes/' },
            { text: 'Mix Engine', link: '/themes/mix-engine' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/goodie1972/libra-design' },
    ],

    footer: {
      message: '极致审美的设计语言，专为 Go/Rust 量身定制',
      copyright: 'MIT Licensed',
    },
  },
})
