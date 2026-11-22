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
  group: plugins
  slug: folder-actions
  order: 3
documentKind: product-manual
websiteRoute: /zh/works/plugin-manager/docs/folder-actions/
lang: zh
translationKey: doc:plugin-manager:folder-actions
---

## 移动、删除与修正目录名

操作前先关闭 UE 编辑器。项目插件与商城插件可互相移动；引擎插件不能移动或删除。删除会将插件送到回收站；目录修正会将乱码文件夹改为插件同名。工具会自动移除只读属性，兼容 Perforce 等版本控制环境。同名插件需先移除其中一个才能移动另一个。

## 目录与列表快捷操作

- **打开目录** - 一键打开项目/引擎/插件目录
- **关闭项目** - 尝试关闭 UE 编辑器
- **重新加载** - 外部修改后刷新插件列表
