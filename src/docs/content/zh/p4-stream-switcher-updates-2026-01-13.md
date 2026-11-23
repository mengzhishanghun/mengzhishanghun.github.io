---
title: 2026-01-13
type: doc
slug: p4-stream-switcher-updates-2026-01-13
draft: false
sitePublish: true
tags:
  - 更新日志
workIds:
  - p4-stream-switcher
docPage:
  work: p4-stream-switcher
  group: changelog
  slug: updates-2026-01-13
  order: 79739887
documentKind: product-manual
websiteRoute: /zh/works/p4-stream-switcher/docs/updates-2026-01-13/
lang: zh
translationKey: doc:p4-stream-switcher:updates-2026-01-13
---

## v1.1.0

- 标记离线目录后，工具通过 `reconcile` 保留本地修改，并把差异放进默认 changelist。
- 工具可直接启动 P4V，并切换到当前客户端。
- 删除文件前会移除只读属性，修复 Perforce 同步时文件无法删除的问题。

此版本已在 [GitHub Release](https://github.com/MZSH-Tools/P4StreamSwitcher/releases/tag/v1.1.0) 发布。
