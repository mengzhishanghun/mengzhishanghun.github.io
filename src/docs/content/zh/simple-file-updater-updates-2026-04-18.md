---
title: 2026-04-18
type: doc
slug: simple-file-updater-updates-2026-04-18
draft: false
sitePublish: true
tags:
  - 更新日志
workIds:
  - simple-file-updater
docPage:
  work: simple-file-updater
  group: changelog
  slug: updates-2026-04-18
  order: 79739582
documentKind: product-manual
websiteRoute: /zh/works/simple-file-updater/docs/updates-2026-04-18/
lang: zh
translationKey: doc:simple-file-updater:updates-2026-04-18
---

## v1.0.1

修复了 Windows 中文控制台打印 `✔`、`❌` 等符号时的崩溃。默认 GBK 码页无法编码这些符号，同步可能在下载第一个文件后就中断。此版将标准输出和标准错误输出设为 UTF-8。

此版本已在 [GitHub Release](https://github.com/MZSH-Tools/SimpleFileUpdater/releases/tag/v1.0.1) 发布。
