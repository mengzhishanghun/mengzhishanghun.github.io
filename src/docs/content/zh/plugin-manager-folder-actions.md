---
title: 管理插件目录
type: doc
slug: plugin-manager-folder-actions
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
  group: features
  slug: folder-actions
  order: 3
documentKind: product-manual
websiteRoute: /zh/works/plugin-manager/docs/folder-actions/
lang: zh
translationKey: doc:plugin-manager:folder-actions
---

## 移动、删除与修正目录名

操作前先关闭 UE 编辑器，并从项目或商城标签页选中插件。

- 移动：在项目目录与商城目录之间移动插件。如果有同名项，先移除其中一个。
- 删除：将插件移至回收站。
- 修正目录名：将乱码文件夹改为与插件同名。

引擎插件不能移动或删除。工具会自动移除只读属性，以便处理 Perforce 等版本控制环境下的文件。

## 目录与列表快捷操作

- **打开目录** - 一键打开项目/引擎/插件目录
- **关闭项目** - 尝试关闭 UE 编辑器
- **重新加载** - 外部修改后刷新插件列表
