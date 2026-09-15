# MZSH 网站本地预览

新版位于本目录，旧站根目录保持原样。预览分支不用于 GitHub Pages 发布。

## 运行与构建

需要 Node.js 22.12 或以上。在本目录运行：

```powershell
npm ci
npm run dev
npm run status
npm run stop
npm run build
npm run preview
```

开发入口为 http://127.0.0.1:4321/ ，文档代理到 /docs/。静态预览默认使用 4173 端口，可用 PORT 环境变量调整；仅绑定本机回环。

build 构建主站、生成博客 Pagefind 索引、构建文档及其独立搜索，再合并到正式静态产物 dist/。全文搜索需完成静态构建后在静态预览中使用；开发模式仍可编辑和预览文章。

## 栏目与内容关联

- 产品：/zh/projects/、/en/projects/；可使用的工具与插件，开源或付费不决定栏目归属。
- 作品：/zh/works/、/en/works/；说明项目背景、实现思路与成果。
- 文档：/docs/zh/、/docs/en/；操作步骤和使用说明。
- 博客：/zh/blog/、/en/blog/；技术文章、全文搜索、标签与 RSS。
- 关于我：/zh/me/、/en/me/；个人介绍与合作联系方式。

shared/catalog.ts 保存产品与作品的权威资料；site.ts 保存主站文案与联系方式。产品只有设置 docPath 才会生成文档入口；无本站文档的项目连接真实 README，不虚构文档路由。license 只在已核实许可时填写，其他项目显示“公开源码”。

作品用 productIds 关联产品；产品与文档、作品与关联产品的文档自动互链。文章用 productIds、workIds、docIds 声明关系。shared/relations.ts 从这些单向声明生成双向引用，同一页面不需要另外维护反向链接。未知关联 ID 或重复文章网址会使构建失败。

## 写文章

在 shared/posts/zh/ 或 shared/posts/en/ 新建 Markdown 文件。不要从私人笔记库自动扫描或发布文章。

```yaml
---
title: 文章标题
description: 一句话摘要
lang: zh
slug: stable-article-url
translationKey: stable-article-url
date: 2026-09-12
draft: true
tags: [Markdown]
productIds: [md-blog-packer]
workIds: [markdown-publishing]
docIds: [md-blog-packer]
---
```

slug 只用小写英文字母、数字和单连字符，决定固定网址；drafts 为保留目录名，不可用作文章 slug。相同 translationKey 表示同一文章的语言版本；没有译文时，语言切换回到目标语言的博客列表。不同语言可使用不同 slug。三个关联数组可省略；docIds 填拥有本站文档的产品 ID。

默认 draft 为 true。只有 draft: false 且 date 不晚于构建时间的文章进入公开列表、RSS、搜索和关联推荐。未来日期只会在之后的构建中生效，不会自行触发定时任务。

草稿仅在显式设置 PREVIEW_DRAFTS=1 后生成独立预览路由，例如 /zh/blog/drafts/stable-article-url/。即便生成草稿预览，草稿也不进入列表、RSS、搜索或推荐。此开关仅用于本机，不得用于正式发布产物：

```powershell
$env:PREVIEW_DRAFTS='1'
npm run build
Remove-Item Env:PREVIEW_DRAFTS
# 预览完成后重新构建，移除草稿页面
npm run build
```

文章图片可放在 portal/public/assets/blog/<文章目录>/，Markdown 以 /assets/blog/... 引用。日常维护独立图片，不必将本站图片转换为 Base64。

## RSS 与发布边界

RSS 位于 /zh/blog/rss.xml 和 /en/blog/rss.xml。BLOG_SITE_URL 控制订阅中的绝对地址，默认是本机 http://127.0.0.1:4321；未来正式部署必须设为经确认的正式源站地址，并按子域名方案核对路径。

当前两篇语言版本是依据 MDBlogPacker 公开 README 整理的同一篇新文章，用于本地阅读预览；不是迁移的博客园旧文章。旧文仍连接博客园，不自动同步外部平台。

保留 noindex。没有部署工作流，没有修改 main、DNS、VPS 或现网文件。当前各栏目为同源路径，子域名部署和跨子域名偏好共享仍需单独配置；正式替换前应确认文章、案例、备案展示和公开素材。

node_modules/、dist/、.astro/、preview.local/ 等为依赖或生成物，不提交版本控制。
