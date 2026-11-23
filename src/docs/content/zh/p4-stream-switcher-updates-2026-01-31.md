---
title: 2026-01-31
type: doc
slug: p4-stream-switcher-updates-2026-01-31
draft: false
sitePublish: true
tags:
  - 更新日志
workIds:
  - p4-stream-switcher
docPage:
  work: p4-stream-switcher
  group: changelog
  slug: updates-2026-01-31
  order: 79739869
documentKind: product-manual
websiteRoute: /zh/works/p4-stream-switcher/docs/updates-2026-01-31/
lang: zh
translationKey: doc:p4-stream-switcher:updates-2026-01-31
---

## v1.4.1

勾选“创建 P4CONFIG”后，每次切换都会更新 `.p4config`，无论是新建还是已有工作区。

此版本已在 [GitHub Release](https://github.com/MZSH-Tools/P4StreamSwitcher/releases/tag/v1.4.1) 发布。

## v1.4.0

缓存统一保存到 `config.json`。修改 `auto_rmdir` 时，工具会将设置同步到所有本地工作区。

切换 stream 时，优先从 P4 服务器读取已有工作区的 `Root`，即使本地没有缓存也能找到路径。其次使用 `stream_cache`；两个来源都没有路径时，才生成默认路径。

此版本已在 [GitHub Release](https://github.com/MZSH-Tools/P4StreamSwitcher/releases/tag/v1.4.0) 发布。
