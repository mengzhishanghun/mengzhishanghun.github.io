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
  group: plugins
  slug: enable-disable
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/plugin-manager/docs/enable-disable/
lang: zh
translationKey: doc:plugin-manager:enable-disable
---

## 修改启用状态

找到插件后，使用右侧的按钮启用、禁用或恢复默认。启用及禁用写入 `.uproject`，影响依赖链时工具会请你确认。恢复默认会移除 `.uproject` 中的对应配置。

## 处理同名冲突

如果项目里有同名插件，先移除其中一个才能启用剩下的插件。
