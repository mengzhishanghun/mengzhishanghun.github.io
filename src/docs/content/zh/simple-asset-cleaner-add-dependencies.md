---
title: 添加未纳入版本控制的依赖
type: doc
slug: simple-asset-cleaner-add-dependencies
draft: false
sitePublish: true
tags:
  - 资产管理
  - 引用分析
workIds:
  - simple-asset-cleaner
docPage:
  work: simple-asset-cleaner
  group: dependencies
  slug: add-dependencies
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/simple-asset-cleaner/docs/add-dependencies/
lang: zh
translationKey: doc:simple-asset-cleaner:add-dependencies
---

## 提交时检查依赖

`Enable Auto Add Dependencies` 默认开启。提交 changelist 时，插件检查待提交资产的依赖。已跟踪的文件无需处理；其余文件在弹窗中列出，由你勾选并确认添加。团队日常可以保持开启，避免其他成员因遗漏依赖无法构建。

## 右键检查选定资产

在 Content Browser 选择一个或多个资产或文件夹，在 **Simple Asset Cleaner** 右键子菜单中选择 **添加未控制依赖**。检查选定范围内尚未跟踪的依赖，勾选并确认需要添加的文件。
