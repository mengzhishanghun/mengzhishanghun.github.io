---
title: 启动并扫描项目
type: doc
slug: plugin-manager-setup
draft: false
sitePublish: true
tags:
  - UnrealEngine
  - 插件
  - 依赖分析
workIds:
  - plugin-manager
docPage:
  work: plugin-manager
  group: setup
  slug: setup
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/plugin-manager/docs/setup/
lang: zh
translationKey: doc:plugin-manager:setup
---

## 启动并识别引擎

1. 从 Release 下载 `UEPluginManager.exe`，放在 UE 项目目录并运行。
2. 启动后，工具会识别项目关联的引擎并扫描项目、商城和引擎插件。它通过注册表识别安装版引擎，通过 GUID 识别源码版引擎。
