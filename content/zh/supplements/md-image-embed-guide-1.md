---
title: MDImageEmbed 使用指南
description: 在 Obsidian 中把 Markdown 的本地图片转换为 Base64 内嵌格式后复制。
type: doc
slug: md-image-embed-guide
categoryId: writing-tools
categoryName: 写作工具
categoryOrder: 1
order: 0
status: 正式文档
date: 2025-12-21
draft: false
sitePublish: false
tags:
  - MDImageEmbed
  - 写作工具
sourcePlatform: 博客园
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19379394
links:
  - label: 博客园原文
    href: https://www.cnblogs.com/mengzhishanghun/p/19379394
workIds:
  - md-image-embed
lang: zh
translationKey: doc:md-image-embed-guide:supplement:1
---

# MDImageEmbed 使用指南

MDImageEmbed 是 Obsidian 插件，通过右键菜单把本地图片转换为 Base64 内嵌格式后复制。这里保留原文章中的插件操作方式。

## 安装

**安装：** 下载 `main.js`、`manifest.json`、`styles.css` 放入 `<Vault>/.obsidian/plugins/md-image-embed/`，重启 Obsidian 并启用。

**支持格式：** PNG, JPG, JPEG, GIF, WebP, SVG, BMP

## 功能介绍

### 一键转换

右键 `.md` 文件 → **Copy as Base64 format** → 粘贴到目标平台即可。

### 智能路径解析

支持标准 Markdown 语法和 Obsidian 的 Wiki 链接语法，自动识别各种相对路径。

### 防转载保护

可配置前缀/后缀模板文件，转换时自动添加版权声明或作者信息。

### 智能过滤

自动跳过网络图片和已有的 Base64 图片。

## 使用演示：发布到博客园

**Step 1**：在 Obsidian 中右键文件，选择 **Copy as Base64 format**

![](/media-occurrence/doc%3Amd-image-embed-guide%3Amedia%3A1)

**Step 2**：粘贴到博客园编辑器，点击右下角 **提取图片**

![](/media-occurrence/doc%3Amd-image-embed-guide%3Amedia%3A2)

**Step 3**：Base64 自动转换为博客园图床链接，发布完成

![](/media-occurrence/doc%3Amd-image-embed-guide%3Amedia%3A3)

## 使用边界

目标平台需要接受 Base64 图片，或提供将其提取为平台图片资源的功能。内嵌格式会增大文本体积，日常编辑仍保留独立图片文件。

---

原文于 2025-12-21 发表于[博客园](https://www.cnblogs.com/mengzhishanghun/p/19379394)。
