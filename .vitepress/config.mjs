import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Comic Auto",
  titleTemplate: ":title | Comic Auto 文档",
  description: "漫画自动订阅、爬取、下载和库管理系统文档",
  lang: 'zh-CN',
  base: '/',
  
  head: [
    ['meta', { name: 'theme-color', content: '#6366f1' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:locale', content: 'zh-CN' }],
  ],

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.svg',
    
    nav: [
      { text: '首页', link: '/' },
      { text: '使用指南', link: '/guide/' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '开始',
          items: [
            { text: '快速开始', link: '/guide/' },
            { text: '基础配置', link: '/guide/architecture' },
            { text: '客户端', link: '/guide/features' },
          ]
        },
        {
          text: '部署',
          items: [
            { text: '部署概览', link: '/guide/deploy' },
            { text: '环境准备', link: '/guide/deploy-environment' },
            { text: '后端部署', link: '/guide/deploy-backend' },
            { text: '前端部署', link: '/guide/deploy-frontend' },
            { text: 'Docker 部署', link: '/guide/deploy-docker' },
            { text: 'Android 打包', link: '/guide/deploy-android' },
          ]
        }
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/cacty' }
    ],

    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭'
            }
          }
        }
      }
    },

    footer: {
      message: 'Comic Auto - 漫画自动管理系统',
      copyright: 'Copyright © 2026 Cacty'
    },

    outline: {
      label: '页面导航',
      level: 'deep',
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '回到顶部',
    langMenuLabel: '多语言',
  },

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    lineNumbers: true,
  },

  cleanUrls: true,
})
