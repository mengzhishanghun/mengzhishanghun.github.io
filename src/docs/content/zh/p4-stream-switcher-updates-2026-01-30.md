---
title: 2026-01-30
type: doc
slug: p4-stream-switcher-updates-2026-01-30
draft: false
sitePublish: true
tags:
  - 更新日志
workIds:
  - p4-stream-switcher
docPage:
  work: p4-stream-switcher
  group: changelog
  slug: updates-2026-01-30
  order: 79739870
documentKind: product-manual
websiteRoute: /zh/works/p4-stream-switcher/docs/updates-2026-01-30/
lang: zh
translationKey: doc:p4-stream-switcher:updates-2026-01-30
---

## v1.3.2

程序启动时会检查是否已有实例在运行，防止同时打开多个实例。

此版本已在 [GitHub Release](https://github.com/MZSH-Tools/P4StreamSwitcher/releases/tag/v1.3.2) 发布。

## v1.3.1

修复默认工作区路径的计算错误，支持正斜杠和反斜杠。删除 PyInstaller 临时目录失败时的弹窗问题也已修复。

此版本已在 [GitHub Release](https://github.com/MZSH-Tools/P4StreamSwitcher/releases/tag/v1.3.1) 发布。

## v1.3.0

日志新增 `[HH:MM:SS]` 时间戳，信息、警告和错误分别用黑色、橙色和红色显示。如果新建工作区时同步失败，工具会在下次切换时重试。也修复了 `P4Exception.errors` 为空时不显示错误信息的问题。

此版本已在 [GitHub Release](https://github.com/MZSH-Tools/P4StreamSwitcher/releases/tag/v1.3.0) 发布。
