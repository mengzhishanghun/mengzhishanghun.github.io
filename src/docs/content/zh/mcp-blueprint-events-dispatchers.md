---
title: 添加事件与管理事件分发器
type: doc
slug: mcp-blueprint-events-dispatchers
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-blueprint
docPage:
  work: mcp-blueprint
  group: features
  slug: events-dispatchers
  order: 6
documentKind: product-manual
websiteRoute: /zh/works/mcp-blueprint/docs/events-dispatchers/
lang: zh
translationKey: doc:mcp-blueprint:events-dispatchers
---

## 创建事件或编辑事件分发器

| 工具 | 用途 | 注意事项 |
| --- | --- | --- |
| `CreateCustomEvent` | 在 Event Graph 中创建自定义事件。 | 目标必须是实际的 Event Graph。 |
| `AddEventNode` | 添加受支持的事件节点。 | 需指定蓝图和事件类型。 |
| `AddBoundEvent` | 为组件或委托添加绑定事件。 | 组件和委托必须能被解析。 |
| `AddEventDispatcher` | 添加事件分发器。 | 指定名称和签名。 |
| `RemoveEventDispatcher` | 删除事件分发器。 | 有引用或无法安全恢复时会被阻止。 |

先判断要添加的是 Event Graph 里的事件节点，还是可声明签名的事件分发器。创建组件绑定事件前，确认目标组件和委托可解析。创建事件分发器时可以指定签名。Custom Event 和 Event Dispatcher 的签名修改选项少于普通函数。

## 示例：Actor 生命周期与组件绑定

第一张图右侧是组件事件的辅助函数。第二张图中，橙色框是 Actor 生命周期节点，红色框里是组件的重叠事件与后续连线，下方的自定义事件显示了它的参数 Pin。

![组件事件辅助函数图](/media-occurrence/doc%3Amcp-blueprint%3Aevents-dispatchers%3Amedia%3A1)

![Actor 生命周期、组件绑定事件与可变 Pin 流程](/media-occurrence/doc%3Amcp-blueprint%3Aevents-dispatchers%3Amedia%3A2)
