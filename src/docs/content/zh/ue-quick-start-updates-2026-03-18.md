---
title: 2026-03-18
type: doc
slug: ue-quick-start-updates-2026-03-18
draft: false
sitePublish: true
tags:
  - 更新日志
workIds:
  - ue-quick-start
docPage:
  work: ue-quick-start
  group: changelog
  slug: updates-2026-03-18
  order: 79739682
documentKind: product-manual
websiteRoute: /zh/works/ue-quick-start/docs/updates-2026-03-18/
lang: zh
translationKey: doc:ue-quick-start:updates-2026-03-18
---

## v1.1.0

编译前会把 LF 或 CR 换行转换成 CRLF，适用于 `.h`、`.c`、`.cpp`、`.cs` 和 `.inl`。扫描项目的 `Source/`、`ThirdParty/`，以及 `Plugins/` 下的 `Source/` 和 `ThirdParty/`。只读文件也会处理，已有 CRLF 的文件会跳过。单个文件出错时，工具会继续处理其他文件。

此版本已在 [GitHub Release](https://github.com/MZSH-Tools/UEQuickStart/releases/tag/v1.1.0) 发布。
