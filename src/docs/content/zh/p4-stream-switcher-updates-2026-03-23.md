---
title: 2026-03-23
type: doc
slug: p4-stream-switcher-updates-2026-03-23
draft: false
sitePublish: true
tags:
  - 更新日志
workIds:
  - p4-stream-switcher
docPage:
  work: p4-stream-switcher
  group: changelog
  slug: updates-2026-03-23
  order: 79739677
documentKind: product-manual
websiteRoute: /zh/works/p4-stream-switcher/docs/updates-2026-03-23/
lang: zh
translationKey: doc:p4-stream-switcher:updates-2026-03-23
---

## v1.5.0

- 没有缓存时，从同名分支的现有工作区推断最常用的根目录。新增的删除按钮会删除服务器上的工作区，并清理本地缓存。
- `sync -k` 和 `reconcile` 会实时显示已处理文件数。通用设置新增换行符选项，默认 `win`；启动时会自动修正所有工作区的换行设置。
- 修复空 stream 的错误识别，避免同步失败后 `NeedSync` 无限重试。工具也能正确识别 `reconcile` 无差异和 `have` 查不到客户端文件的情况。切换到已有工作区时，不再覆盖手动指定的目录。

此版本已在 [GitHub Release](https://github.com/MZSH-Tools/P4StreamSwitcher/releases/tag/v1.5.0) 发布。
