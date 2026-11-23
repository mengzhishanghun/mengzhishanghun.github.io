---
title: 2025-06-10
type: doc
slug: plugin-auto-packer-updates-2025-06-10
draft: false
sitePublish: true
tags:
  - 更新日志
workIds:
  - plugin-auto-packer
docPage:
  work: plugin-auto-packer
  group: changelog
  slug: updates-2025-06-10
  order: 79749390
documentKind: product-manual
websiteRoute: /zh/works/plugin-auto-packer/docs/updates-2025-06-10/
lang: zh
translationKey: doc:plugin-auto-packer:updates-2025-06-10
---

## v1.1.0

工具从插件目录生成 `FilterPlugin.ini`，界面移除了手动编辑框。这一版排除 `.uplugin` 文件和 `Binaries`、`Intermediate`、`Resources`、`Source` 目录。

版权声明从 `.uplugin` 的 `CreatedBy` 读取作者，识别并替换 `.h`、`.cpp`、`.Build.cs` 中的原有版权块。打包日志会显示生成的过滤配置、版权内容和写入文件的相对路径。

此版本已在 [GitHub Release](https://github.com/MZSH-Tools/UEPluginAutoPacker/releases/tag/v1.1.0) 发布。
