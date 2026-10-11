---
title: MDBlogPacker
description: 将 Markdown 中的本地图片转成 Base64 内嵌格式，便于导出和复制到支持的平台。
type: work
slug: md-blog-packer
categoryId: open-source-tools
categoryName: 开源工具
categoryOrder: 1
order: 0
status: 正式文档
featured: false
draft: false
sitePublish: false
tags:
  - Markdown
  - 图片
links:
  - label: GitHub
    href: https://github.com/MZSH-Tools/MDBlogPacker
lang: zh
translationKey: md-blog-packer
---

## 作品简介

MDBlogPacker 用于把带有本地图片的 Markdown 整理成便于跨平台复制或导出的文本。

它识别普通 Markdown 图片语法和 Obsidian Wiki 图片引用，把本地图片转换为 Base64 内嵌内容，同时保留网络图片与已经内嵌的图片。使用者可以通过图形界面或命令行处理文章，再复制结果或导出文件。

## 背景与目标

本地笔记中的图片通常以相对路径或库内引用存在。只复制 Markdown 正文到另一个发布平台时，目标平台未必能访问这些本地文件，文章中的图片就会失效。

这个工具面向一次性发布或迁移，把图片数据随导出文本带走，减少在目标平台逐张重新处理本地图片的工作。

## 核心能力

### 识别本地图片引用

工具同时处理标准 Markdown 图片写法与 Obsidian Wiki 图片引用，覆盖两种常见的笔记写作方式。

识别后只对本地图片做内嵌转换；网络图片地址和原本已是 Base64 的内容保留原状，避免把整篇文章的所有图片引用重复改写。

### 批量转换与交付

一篇文章里的多个本地图片可在一次处理中转换为文本内嵌内容。图形界面适合手动检查和复制结果；CLI 适合已采用命令行的整理流程。处理结果可直接复制，也可导出为文件，供后续发布流程使用。

### 前后内容模板

导出文本前后可追加预先准备的内容，例如版权声明或作者信息。这部分属于文章发布时的附加文本，不改变原图片的来源，也不代替目标平台的版权或内容设置。

## 适用场景

适用于在本地维护 Markdown，却需要把包含图片的文章复制到支持 Base64 图片的平台，或为单篇文章生成便于转移的文本副本。

对长期维护的原始文稿，可继续使用独立图片文件，按发布需要生成导出稿。

## 适用范围与边界

目标平台必须接受 Base64 图片；有些平台还会限制文章或图片体积。

图片内嵌会显著增加文本长度，因此导出前应确认平台规则和最终文件大小。若文章发布在自己可管理资源的站点，独立同步图片通常更便于缓存与后续维护。
