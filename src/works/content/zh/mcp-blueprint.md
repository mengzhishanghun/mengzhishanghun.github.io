---
title: MCPBlueprint
description: 通过 MCP 连接 AI 工具，编辑 Unreal Engine 蓝图、管理成员与组件，并获取编译反馈。
type: work
slug: mcp-blueprint
categoryId: ue-plugins
categoryName: UE插件
categoryOrder: 0
order: 18
status: 在售
workInfo:
  channels:
    - kind: sale
      href: https://www.fab.com/listings/22073900-edb6-456b-b840-753db7205713
    - kind: docs
      href: /zh/works/mcp-blueprint/docs/connect/
  compatibility:
    - platforms:
        - Windows (Win64)
        - macOS
        - Linux
      requirements:
        - UE 5.2–5.8（使用与引擎小版本匹配的发行包）
featured: false
draft: false
sitePublish: true
tags:
  - 蓝图发现、编辑与编译反馈
  - MCP 系列
docIds:
  - mcp-blueprint-connect
  - mcp-blueprint-asset-lifecycle
  - mcp-blueprint-graphs
  - mcp-blueprint-graph-screenshots
  - mcp-blueprint-variables
  - mcp-blueprint-members-and-types
  - mcp-blueprint-events-dispatchers
  - mcp-blueprint-interfaces
  - mcp-blueprint-user-defined-structs
  - mcp-blueprint-user-defined-enums
  - mcp-blueprint-components-and-inheritance
  - mcp-blueprint-class-defaults
  - mcp-blueprint-class-inheritance
coverAlt: MCPBlueprint封面
websiteCoverUrl: /media/covers/works/mcp-blueprint-20261101.webp
lang: zh
translationKey: mcp-blueprint
---

## 作品简介

MCPBlueprint 是一款 Unreal Engine 编辑器插件，让支持 MCP 的 AI 客户端直接读取和编辑项目中的蓝图。连接后，你可以让 AI 查找蓝图、理解图表结构、创建节点和连线、调整变量与函数，并在编辑器中检查修改结果。

插件也支持组件、类默认值、用户定义 Struct 和 Enum 的管理。你可以从读取一个已有蓝图开始，逐步完成修改、编译检查和保存；也可以创建新的蓝图资产和函数，组织需要的逻辑。

[安装并连接 MCPBlueprint](/zh/works/mcp-blueprint/docs/connect/) · [在 Fab 购买](https://www.fab.com/listings/22073900-edb6-456b-b840-753db7205713)

## 主要功能

Fab 已发布版本提供 55 个工具，覆盖以下蓝图编辑工作。当前可用工具和参数以编辑器会话的 `tools/list` 为准。

### 查找与管理蓝图资产

按路径查找项目中的蓝图，读取父类、图表、变量、组件和接口概览。修改之前，先了解目标蓝图的结构，确定要处理的资产与成员。

支持创建、复制、重命名和移动资产，也可以打开蓝图编辑器、获取编译诊断，并明确保存所需改动。磁盘重载和删除资产具有额外的影响检查与批准要求。

[查看资产管理与编译文档](/zh/works/mcp-blueprint/docs/asset-lifecycle/)

### 编辑节点、连线与图表布局

读取图表中的节点、Pin、连线和位置，搜索当前可创建的节点，再应用节点与连线修改。可以添加、移动或删除节点，调整连接关系，设置未连接输入 Pin 的默认值。

整理已有图表时，可以选择 Balanced、Straight 或 Compact 布局，添加注释框，并对支持可变 Pin 的节点增删 Pin。图表截图工具可截取完整图表或聚焦某个节点，方便查看和分享结果。

[查看图表编辑文档](/zh/works/mcp-blueprint/docs/graphs/) · [查看图表截图文档](/zh/works/mcp-blueprint/docs/graph-screenshots/)

### 管理变量与函数

添加或删除成员变量和函数局部变量，调整成员变量的名称、类型、声明默认值、分类、提示文字及实例可编辑设置。已有引用等情况会限制部分修改。

支持创建、重命名和删除用户函数，以及添加、重命名、删除函数参数或修改参数类型。涉及调用点更新时，先检查影响，再按工具要求批准引用更新。

[查看变量文档](/zh/works/mcp-blueprint/docs/variables/) · [查看函数文档](/zh/works/mcp-blueprint/docs/members-and-types/)

### 添加事件、分发器与接口

创建自定义事件、添加受支持的事件节点，为组件或委托添加绑定事件。可以创建带签名的事件分发器，并在满足引用与恢复条件时删除分发器。

读取蓝图已实现的接口后，可以指定接口类路径，为蓝图添加接口。事件和分发器的签名编辑范围与普通函数不同，具体以对应文档为准。

[查看事件与分发器文档](/zh/works/mcp-blueprint/docs/events-dispatchers/) · [查看接口文档](/zh/works/mcp-blueprint/docs/interfaces/)

### 创建与调整 Struct、Enum

创建和读取用户定义 Struct，添加、调整或删除字段；创建和读取用户定义 Enum，查看并调整条目、数值与显示名。

修改已有类型时，可以先预检引用影响。可能造成数据丢失或改变已有序列化值含义的操作，需要明确批准。

[查看 Struct 文档](/zh/works/mcp-blueprint/docs/user-defined-structs/) · [查看 Enum 文档](/zh/works/mcp-blueprint/docs/user-defined-enums/)

### 管理组件、类默认值与继承关系

读取 Actor 蓝图的组件树，添加、重命名、复制或删除本地 SCS 组件，调整 SceneComponent 的附着父级和根组件。也可以读取并修改本蓝图添加的组件模板属性。

类默认值工具用于修改蓝图生成类的默认属性，包括可编辑的继承属性。更改蓝图父类则通过独立工具预检和执行；调整组件附着关系与更改蓝图父类使用不同工具。

[查看组件文档](/zh/works/mcp-blueprint/docs/components-and-inheritance/) · [查看类默认值文档](/zh/works/mcp-blueprint/docs/class-defaults/) · [查看类继承文档](/zh/works/mcp-blueprint/docs/class-inheritance/)

## 实际效果

### 创建计算函数

下面的 `CalculateScore` 将三个输入参数组合为计算逻辑：先把基础分与奖励分相加，再乘以倍率，并把结果传给返回节点。

```text
FinalScore = (BaseScore + Bonus) × Multiplier
```

![Unreal Engine 蓝图编辑器中的 CalculateScore 计算函数](/media-occurrence/work%3Amcp-blueprint%3Amedia%3A1)

这个示例包含函数创建、节点搜索、节点与连线修改，以及图表布局。[查看完整操作示例](/zh/works/mcp-blueprint/docs/graphs/)。

### 修改已有业务逻辑

已有蓝图也可以继续调整。例如，将订单的固定折扣 `500` 改为小计的 5%：读取原有图表后，修改计算节点与连线，使折扣变为 `SubtotalCents / 20`。

修改前，计算结果为固定折扣 `500`：

![修改前：订单使用固定折扣 500](/media-occurrence/work%3Amcp-blueprint%3Amedia%3A2)

修改后，折扣按小计的 5% 计算：

![修改后：订单折扣按 SubtotalCents / 20 计算](/media-occurrence/work%3Amcp-blueprint%3Amedia%3A3)

图表文档还包含首单免运费、积分计算排除运费的修改示例。你可以[查看节点与连线的修改过程](/zh/works/mcp-blueprint/docs/graphs/)，或[查看完整订单结算图](/zh/works/mcp-blueprint/docs/graph-screenshots/)。

## 使用流程

1. **连接 AI 客户端。** 安装匹配引擎版本的插件包，将编辑器工具栏显示的实际 MCP 端点交给客户端。
2. **读取并定位目标。** 查找蓝图，读取概览和图表细节，确定要修改的资产、节点或成员。
3. **预检后应用修改。** 工具支持时先使用 dry-run，查看影响范围与限制；涉及引用更新或数据变化时，按要求明确批准。
4. **检查、编译与保存。** 在编辑器中检查结果，读取编译反馈，修正问题后明确保存需要保留的改动。

普通编辑只标记资产有改动，不会自动写入磁盘。需要保存时调用 `SaveAsset`。预检也不等于最终结果检查，修改后的蓝图仍需在编辑器中确认。

## 环境与使用范围

- 支持 UE 5.2–5.8 Editor，插件发行包必须与引擎小版本匹配。
- 支持 Windows（Win64）、macOS 和 Linux。
- 需要支持本机 HTTP 服务的 MCP 客户端，服务只绑定本机。
- 插件安装在引擎的 Marketplace 插件目录，每个引擎安装一次；不需要为每个项目重复复制或添加项目依赖。
- 用于编辑器中的资产与蓝图编辑，不提供 Runtime / Shipping 模块。

组件工具主要操作 Actor 蓝图的本地 SCS 组件模板；类默认值修改不会追溯覆盖场景中已有实例。插件目前也没有通用工具来调用任意蓝图函数并返回运行结果。

## 购买与文档

插件已在 [Fab 商品页](https://www.fab.com/listings/22073900-edb6-456b-b840-753db7205713)发售。首次使用请从[安装并连接 MCPBlueprint](/zh/works/mcp-blueprint/docs/connect/)开始。

使用文档按功能组织，包含资产与图表、成员与类型、类结构等内容。每篇说明对应功能的使用方法、必要参数和限制，网站文档对应已发布版本。

## 支持

如有问题或反馈，请使用[统一联系页面](https://mzsh.me/contact/)。
