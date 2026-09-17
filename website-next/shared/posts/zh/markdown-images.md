---
title: Markdown 本地图片，发布时该怎么处理？
description: 相对路径、独立图片文件和 Base64 内嵌各有适用场景；先看目标平台，再选择导出方式。
lang: zh
slug: markdown-images
categoryId: writing
categoryName: 写作与发布
categoryOrder: 0
order: 0
status: 已发布
featured: true
translationKey: markdown-images
date: 2026-09-12
draft: false
tags: [Markdown, 写作工具]
productIds: [md-blog-packer]
workIds: [markdown-publishing]
docIds: [md-blog-packer]
---

一篇 Markdown 在本机显示正常，不代表把文字复制到另一个网站后，图片还能出现。图片语法中的相对路径只说明文件的位置，图片本身并没有随文字一起移动。

## 自己的网站：保留独立图片

如果能控制网站文件，通常可以把文章和图片一起放进仓库，让构建过程生成可访问的图片地址。独立图片便于替换、压缩和缓存，日常写作也更容易维护。

## 复制到其他平台：检查图片接收方式

有的平台要求上传图片，有的平台接受远程图片地址，也有的平台允许 Base64 内嵌。发布前先用一张小图片检查目标编辑器和最终页面的表现，不能只看粘贴时的预览。

Base64 把图片数据放进文本，因此无需依赖原来的本地路径。代价是编码后的数据通常比原始二进制大约增加三分之一，也不再像独立图片那样方便单独缓存。大量高清图片更适合独立文件或平台提供的上传方式。

## MDBlogPacker 适合放在哪一步

MDBlogPacker 可以读取标准 Markdown 图片引用和 Wiki 图片引用，把本地图片转换为 Base64，并复制结果或导出到文件。网络图片与已内嵌的图片默认保留原状。

因此，可以在日常写作时保留原始 Markdown 和图片，只在需要跨平台发布时生成一份导出文本。这样修改原图不必直接编辑一大段编码，发布副本也不会替代原稿。

## 发布前的简短检查

- 确认目标平台允许内嵌图片，并检查正式预览。
- 控制图片尺寸，避免导出文本过大。
- 保留原稿与图片文件，后续修改更方便。

工具行为依据 [MDBlogPacker 的公开 README](https://github.com/MZSH-Tools/MDBlogPacker#readme) 整理，具体操作见下方关联文档。
