---
title: 插件开发到发布的工具链
description: 围绕插件管理与多版本打包，把开发中分散的操作整理成专用工具。
slug: plugin-release-workflow
categoryId: tooling
categoryName: 工具实践
categoryOrder: 0
order: 0
status: 已完成
featured: true
productIds: [plugin-auto-packer, plugin-manager]
---
## 背景
插件安装位置、依赖和引擎版本分别影响开发与发布，靠手动整理容易遗漏。

## 主要方案
UEPluginManager 负责查找插件与梳理依赖；UEPluginAutoPacker 负责多版本构建、日志与发布包整理。两款工具各自聚焦一段工作。

## 最终效果
形成插件管理和打包两个可独立使用的工具。具体支持范围和操作步骤见产品与文档。
