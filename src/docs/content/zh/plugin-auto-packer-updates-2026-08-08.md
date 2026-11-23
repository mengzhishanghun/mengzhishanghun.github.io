---
title: 2026-08-08
type: doc
slug: plugin-auto-packer-updates-2026-08-08
draft: false
sitePublish: true
tags:
  - 更新日志
workIds:
  - plugin-auto-packer
docPage:
  work: plugin-auto-packer
  group: changelog
  slug: updates-2026-08-08
  order: 79739192
documentKind: product-manual
websiteRoute: /zh/works/plugin-auto-packer/docs/updates-2026-08-08/
lang: zh
translationKey: doc:plugin-auto-packer:updates-2026-08-08
---

## v1.2.2

修复插件打包后 `Source` 中的中文、Unicode 破折号、箭头等有效 UTF-8 字符丢失的问题。处理 UTF-8 文件时会严格解码，支持带或不带 BOM，并保留原换行。无法解码的字符不会再被静默丢弃。替换版权头时会保留独立注释、尾随代码和未闭合的块注释。

此版本已在 [GitHub Release](https://github.com/MZSH-Tools/UEPluginAutoPacker/releases/tag/v1.2.2) 发布。
