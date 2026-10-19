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
workInfo:
  channels:
    - kind: open-source
      href: https://github.com/MZSH-Tools/MDBlogPacker
    - kind: docs
      href: /docs/zh/tools/md-blog-packer/
  compatibility:
    - platforms:
        - Markdown 工具（操作系统待核实）
      requirements: []
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

不同平台接收图片的方式不同：有的平台要求上传图片，有的平台接受远程图片地址，也有的平台允许 Base64 内嵌。MDBlogPacker 面向接受内嵌图片的一次性发布或迁移，把图片数据随导出文本带走，减少逐张重新处理本地图片的工作。

## 核心能力

### 识别本地图片引用

工具同时处理标准 Markdown 图片写法与 Obsidian Wiki 图片引用，覆盖两种常见的笔记写作方式。

识别后只转换本地图片；网络图片地址和原本已是 Base64 的内容保留原状，避免重复改写图片引用。

### 批量转换与交付

一篇文章里的多个本地图片可在一次处理中转换为文本内嵌内容。图形界面适合手动检查和复制结果；CLI 适合已采用命令行的整理流程。处理结果可直接复制，也可导出为文件，供后续发布流程使用。

### 前后内容模板

导出文本前后可追加预先准备的内容，例如版权声明或作者信息。这些是发布时的附加文本，不改变原图片的来源，也不代替目标平台的版权或内容设置。

## 适用场景

适用于在本地维护 Markdown，却需要把包含图片的文章复制到支持 Base64 图片的平台，或为单篇文章生成便于转移的文本副本。

日常写作可保留原始 Markdown 和独立图片文件，只在跨平台发布时生成导出稿。这样修改原图不必编辑一大段编码，发布副本也不会替代原稿。

## 适用范围与边界

目标平台必须接受 Base64 图片；有些平台还会限制文章或图片体积。发布前可先用一张小图片检查目标编辑器和最终页面，不能只看粘贴时的预览。

Base64 编码后的图片数据通常比原始二进制大约增加三分之一，也不便单独缓存。导出前应控制图片尺寸并确认平台规则和最终文件大小；大量高清图片更适合独立文件或平台提供的上传方式。

若文章发布在自己可管理资源的站点，可让构建过程把文章和图片一起发布。独立图片更便于替换、压缩、缓存与后续维护。

操作步骤和参数说明见 [使用教程](/zh/docs/tools/md-blog-packer/)。
