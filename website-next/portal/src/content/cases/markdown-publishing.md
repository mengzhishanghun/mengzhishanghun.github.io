---
title: 让 Markdown 图片随文章一起发布
description: 从本地图片路径到可复制的发布文本，减少文章迁移时的手动整理。
slug: markdown-publishing
categoryId: tooling
categoryName: 工具实践
categoryOrder: 0
order: 1
status: 已完成
featured: true
tags: [Markdown, 图片, 写作工具]
productIds: [md-blog-packer]
---
## 背景
本地 Markdown 能显示图片，复制到其他平台后，相对路径却未必可用。

## 主要方案
MDBlogPacker 读取本地图片并转换为 Base64 内嵌格式，同时保留网络图片，支持标准图片语法与 Wiki 图片引用。

## 最终效果
提供 GUI 和命令行两种使用方式，转换结果可复制或导出；是否接受内嵌图片仍取决于目标平台。
