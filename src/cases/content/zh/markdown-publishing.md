---
title: 让 Markdown 图片随文章一起发布
description: 从本地图片路径到可复制的发布文本，减少文章迁移时的手动整理。
type: case
slug: markdown-publishing
categoryId: desktop-automation
categoryName: 桌面与自动化
categoryOrder: 1
status: 已完成
featured: true
draft: false
sitePublish: true
tags:
  - Markdown
  - 图片
  - 写作工具
productIds:
  - md-blog-packer
coverAlt: 让 Markdown 图片随文章一起发布的流程图
websiteCoverUrl: /assets/cases/markdown-publishing.png
lang: zh
translationKey: markdown-publishing
---

## 背景介绍

我在把本地 Markdown 文章复制到其他平台时，遇到了正文能带走、图片却仍指向本地文件的问题。为减少逐张整理图片的操作，我制作了 MDBlogPacker，把本地图片放进导出文本。

日常写作仍可保留原始 Markdown 和独立图片，跨平台发布时再生成一份可复制的副本。

## 复现环境

输入是本地 Markdown 与图片文件，图片引用可能使用标准 Markdown 语法，也可能使用 Obsidian Wiki 图片引用。

目标发布平台需要支持 Base64 内嵌图片，且文章转换后的体积不能超出平台限制。工具提供 GUI 与命令行两种使用方式。

## 具体问题

本机能解析相对路径，不代表目标平台也能访问同一文件。只复制文字时，图片文件没有随正文移动，发布后可能出现空白或失效引用。

## 解决方案

选择导出方式前，需要区分独立图片、远程地址与 Base64 内嵌的适用场景。能够自行管理资源的站点与只接受粘贴的编辑器，处理方式可能不同。如何选择图片发布方式，可[查看图片发布方案详情](</zh/works/md-blog-packer/>)。

MDBlogPacker 识别标准 Markdown 图片语法和 Wiki 图片引用，读取本地图片并转换为 Base64 内嵌格式；网络图片与已内嵌图片保留原状。

转换结果可以复制或导出为文件，用作发布副本。原稿和图片继续作为维护来源，后续修改不必直接编辑大段编码。

内嵌会增加文本体积，因此发布前仍需要检查目标平台的接收规则与最终页面表现。

## 最终总结

这款图片转换工具可通过 GUI 或 CLI 使用，让本地图片随导出文本一起转移，减少文章迁移时逐张处理图片的工作。

是否成功显示取决于目标平台对内嵌图片的支持。对于能自行管理资源的网站，独立同步图片仍便于缓存和后续替换。
