---
title: 2025-06-18
type: doc
slug: plugin-auto-packer-updates-2025-06-18
draft: false
sitePublish: true
tags:
  - 更新日志
workIds:
  - plugin-auto-packer
docPage:
  work: plugin-auto-packer
  group: changelog
  slug: updates-2025-06-18
  order: 79749382
documentKind: product-manual
websiteRoute: /zh/works/plugin-auto-packer/docs/updates-2025-06-18/
lang: zh
translationKey: doc:plugin-auto-packer:updates-2025-06-18
---

## v1.1.1

Fab 整理支持在打包后为 `.h`、`.cpp` 和 `.Build.cs` 添加版权声明，跳过 `ThirdParty`。自动生成的 `FilterPlugin.ini` 排除 `Binaries`、`Intermediate`、`Resources`、`Source` 和 `Config`。

Fab 整理选项保存在 `%LOCALAPPDATA%/UEPluginPacker/Config.json`，下次启动时恢复勾选状态。没有配置时默认不勾选，修复了以前启动时总显示全部勾选的问题。

此版本已在 [GitHub Release](https://github.com/MZSH-Tools/UEPluginAutoPacker/releases/tag/v1.1.1) 发布。
