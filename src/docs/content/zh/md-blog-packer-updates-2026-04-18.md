---
title: 2026-04-18
type: doc
slug: md-blog-packer-updates-2026-04-18
draft: false
sitePublish: true
tags:
  - 更新日志
workIds:
  - md-blog-packer
docPage:
  work: md-blog-packer
  group: changelog
  slug: updates-2026-04-18
  order: 79739582
documentKind: product-manual
websiteRoute: /zh/works/md-blog-packer/docs/updates-2026-04-18/
lang: zh
translationKey: doc:md-blog-packer:updates-2026-04-18
---

## v1.0.0

首个正式版本。工具把 Markdown 引用的本地图片批量转换为内嵌 Base64 图片，转换结果会自动复制到剪贴板，可粘贴到支持 Base64 图片的博客平台。

- GUI 可选文件、编辑多行前文和后文，并一键转换、复制。CLI 支持管道、文件输出以及前文和后文模板文件。
- 支持标准 Markdown 和 Obsidian 图片语法。工具向上查找 `.obsidian/` 来定位库根，识别 `/附件/xxx.png` 这类路径。
- 这个版本把 Markdown 文件路径、前文和后文保存在 `%LOCALAPPDATA%\MDBlogPacker\Config.json`，下次启动自动填回。
- 单文件 EXE 支持 Windows 10 及以上，无需另装 Python。

此版本已在 [GitHub Release](https://github.com/MZSH-Tools/MDBlogPacker/releases/tag/v1.0.0) 发布。
