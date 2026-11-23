---
title: 2026-06-13
type: doc
slug: ue-quick-start-updates-2026-06-13
draft: false
sitePublish: true
tags:
  - 更新日志
workIds:
  - ue-quick-start
docPage:
  work: ue-quick-start
  group: changelog
  slug: updates-2026-06-13
  order: 79739387
documentKind: product-manual
websiteRoute: /zh/works/ue-quick-start/docs/updates-2026-06-13/
lang: zh
translationKey: doc:ue-quick-start:updates-2026-06-13
---

## v1.2.0

新增 `--test`：只编译，不打开编辑器或 GUI。有参数时进入 CLI，不加载 Tkinter；无参数时仍打开 GUI。

CLI 从当前工作目录定位项目，因此不必从 EXE 所在目录调用。CLI 保留控制台输出，并将标准输出设为 UTF-8，修复 Windows GBK 编码导致的崩溃。只有 GUI 会隐藏控制台。

此版本已在 [GitHub Release](https://github.com/MZSH-Tools/UEQuickStart/releases/tag/v1.2.0) 发布。
