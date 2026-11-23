---
title: 2026-06-19
type: doc
slug: plugin-auto-packer-updates-2026-06-19
draft: false
sitePublish: true
tags:
  - 更新日志
workIds:
  - plugin-auto-packer
docPage:
  work: plugin-auto-packer
  group: changelog
  slug: updates-2026-06-19
  order: 79739381
documentKind: product-manual
websiteRoute: /zh/works/plugin-auto-packer/docs/updates-2026-06-19/
lang: zh
translationKey: doc:plugin-auto-packer:updates-2026-06-19
---

## v1.2.1

CLI 的 `build` 新增 `--keep-binaries`，可以覆盖删除 `Binaries` 的配置，让产物保留已编译的 DLL，便于放到安装版引擎的 `Engine/Plugins/Marketplace/`。不加此参数时，产出供 Fab 上架的源码包，安装版引擎加载时需要重新构建模块。GUI 仍按配置的 Fab 选项处理 `Binaries`。

此版本已在 [GitHub Release](https://github.com/MZSH-Tools/UEPluginAutoPacker/releases/tag/v1.2.1) 发布。
