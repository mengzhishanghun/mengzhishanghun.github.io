---
title: 为 Actor 添加组件
type: doc
slug: mcp-world-editor-actor-components
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-world-editor
docPage:
  work: mcp-world-editor
  group: actors
  slug: actor-components
  order: 6
documentKind: product-manual
websiteRoute: /zh/works/mcp-world-editor/docs/actor-components/
lang: zh
translationKey: doc:mcp-world-editor:actor-components
---

## 选择组件类

`AddComponent` 接受精确的完整组件类路径，或在当前已加载类中唯一匹配的短类名；短名存在多个候选时会返回排序后的完整路径并拒绝创建。工具会拒绝非 `ActorComponent`、抽象、弃用、已被新版本替代以及 `ClassWithin` 与目标 Actor 不兼容的类。实例组件按 Unreal Editor 的创建顺序加入序列化数组、通知创建并注册；附加、设为根组件或注册失败时会清理新组件并取消事务。
