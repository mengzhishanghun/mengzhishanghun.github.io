---
title: 2026-04-17
type: doc
slug: plugin-auto-packer-updates-2026-04-17
draft: false
sitePublish: true
tags:
  - 更新日志
workIds:
  - plugin-auto-packer
docPage:
  work: plugin-auto-packer
  group: changelog
  slug: updates-2026-04-17
  order: 79739583
documentKind: product-manual
websiteRoute: /zh/works/plugin-auto-packer/docs/updates-2026-04-17/
lang: zh
translationKey: doc:plugin-auto-packer:updates-2026-04-17
---

## v1.2.0

新增 CLI 模式。无参数启动仍进入 GUI；带参数可以用 `build` 打包，或用 `engines`、`plugins` 查看已配置的引擎和项目插件。`build` 支持用 `--engines` 指定引擎、用 `--all` 打包所有引擎、用 `--output` 指定输出目录，或用 `--no-post` 跳过后处理。

CLI 退出码为 `0`（全部成功）、`1`（部分失败）、`2`（参数错误）和 `130`（Ctrl+C）。CLI 可在命令提示符中显示输出，启动 GUI 时也会打开控制台。

此版本已在 [GitHub Release](https://github.com/MZSH-Tools/UEPluginAutoPacker/releases/tag/v1.2.0) 发布。
