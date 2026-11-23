---
title: 启用与禁用插件
type: doc
slug: plugin-manager-enable-disable
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
  slug: enable-disable
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/plugin-manager/docs/enable-disable/
lang: zh
translationKey: doc:plugin-manager:enable-disable
---

## 修改启用状态

在列表中选中插件，然后用右侧按钮启用、禁用或恢复默认。启用和禁用会把选择写入 `.uproject`。如果弹出依赖变更提示，先核对受影响的插件，再确认。恢复默认会移除 `.uproject` 中针对该插件的显式设置，之后按插件默认状态处理。

## 处理同名冲突

如果项目里有同名插件，先核对它们的来源，再移除其中一个。之后才能启用留下的插件。
