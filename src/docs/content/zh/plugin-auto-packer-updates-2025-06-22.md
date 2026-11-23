---
title: 2025-06-22
type: doc
slug: plugin-auto-packer-updates-2025-06-22
draft: false
sitePublish: true
tags:
  - 更新日志
workIds:
  - plugin-auto-packer
docPage:
  work: plugin-auto-packer
  group: changelog
  slug: updates-2025-06-22
  order: 79749378
documentKind: product-manual
websiteRoute: /zh/works/plugin-auto-packer/docs/updates-2025-06-22/
lang: zh
translationKey: doc:plugin-auto-packer:updates-2025-06-22
---

## v1.1.2

修复自动插入版权声明时可能在第二行误写 BOM 的问题。这类编码异常可能导致 `GENERATED_BODY` 被跳过。工具会检查原文件是否带 BOM，沿用原有编码。添加版权声明时会跳过 `ThirdParty`。

此版本已在 [GitHub Release](https://github.com/MZSH-Tools/UEPluginAutoPacker/releases/tag/v1.1.2) 发布。
