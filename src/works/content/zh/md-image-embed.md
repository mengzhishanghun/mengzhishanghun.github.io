---
title: MDImageEmbed
description: 在 Obsidian 中把 Markdown 的本地图片转换为 Base64 内嵌格式后复制。
type: work
slug: md-image-embed
categoryId: obsidian-plugins
categoryName: Ob插件
categoryOrder: 3
order: 1
status: 正式文档
featured: false
draft: false
sitePublish: false
tags:
  - 图片
  - 导出
sourcePlatform: 博客园
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19379394
links:
  - label: 博客园原文
    href: https://www.cnblogs.com/mengzhishanghun/p/19379394
docIds:
  - md-image-embed-guide
sourceDate: 2025-12-21
lang: zh
translationKey: md-image-embed
workInfo:
  channels:
    - kind: docs
      href: /docs/zh/guides/writing-tools/md-image-embed-guide/
  compatibility:
    - platforms:
        - Obsidian 插件（操作系统待核实）
      requirements: []
---
## 作品简介

MDImageEmbed 是面向 Obsidian 的本地图片导出插件。

使用者右键 Markdown 文件，选择 Copy as Base64 format，即可将该文件正文中的本地图片转换为 Base64 内嵌格式后复制，便于把文章转贴到接受这种图片形式的目标平台。

## 背景与目标

Obsidian 笔记可引用库内图片，日常编辑时这种方式易于管理。但只复制 Markdown 文本到外部编辑器，图片文件不会随文本一起过去，原有路径在外部通常无法解析。

插件在 Obsidian 内完成转换，从所选 Markdown 文件生成一份带图片数据的复制稿，供后续转贴。

## 核心能力

### 右键复制入口

使用者在 Obsidian 中右键 `.md` 文件并选择 Copy as Base64 format，插件处理所选文件并将结果放入剪贴板。

原始笔记继续保持日常可编辑的图片引用方式，复制稿用于后续粘贴和发布。

### 两类引用解析与过滤

插件识别标准 Markdown 图片写法以及 Obsidian Wiki 图片引用，并解析本地图片路径。

网络图片和已经内嵌的 Base64 图片会跳过转换，避免把远端地址或已有数据重复处理。

### 发布文本模板

可配置前缀与后缀模板，在复制结果前后加入版权声明或作者信息。模板补充的是固定文本；这些文字如何展示，仍取决于目标平台的编辑器和渲染规则。

## 适用场景

适用于主要在 Obsidian 写作、偶尔需要把含本地图片的文章转贴到博客或其他支持内嵌图片的平台。它把图片转换和复制放在文件右键菜单中，适合手工发布单篇内容。

## 适用范围与边界

目标平台必须支持 Base64 图片，或提供能够提取内嵌图片的功能；同时要核对正文长度及上传体积限制。

图片内嵌会让文本明显变大，不能把成功复制等同于平台一定能保存或显示。目标平台的实际效果应在发布前预览。
