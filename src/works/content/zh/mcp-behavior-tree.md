---
title: MCPBehaviorTree
description: MCPBehaviorTree 是开发中的 UE 编辑器 MCP 插件，围绕行为树与黑板资产提供工具接口。当前功能与兼容性仍在验证。
type: work
slug: mcp-behavior-tree
categoryId: ue-plugins
categoryName: UE插件
categoryOrder: 0
order: 17
status: 开发中
workInfo:
  stage: developing
  channels:
    - kind: docs
      href: /zh/works/mcp-behavior-tree/docs/connect-and-inspect/
featured: false
draft: false
sitePublish: true
tags:
  - 行为树与黑板资产
  - MCP 系列
docIds:
  - mcp-behavior-tree-connect-and-inspect
  - mcp-behavior-tree-edit-tree
  - mcp-behavior-tree-blackboard-keys
coverAlt: MCPBehaviorTree封面
websiteCoverUrl: /media/covers/works/mcp-behavior-tree-20261101.webp
lang: zh
translationKey: mcp-behavior-tree
---

## 作品简介

MCPBehaviorTree 是开发中的 UE 编辑器 MCP 插件。外部 AI 工具可通过 MCP 创建和检查行为树与黑板，也可调整树结构、管理黑板键，并在保存前验证行为树。工具范围与诊断反馈仍可能调整。

## 开发方向

### 行为树结构与节点

读取节点层级、根级装饰器、黑板和子树引用，获取节点 ID 后，再调整 Composite、Task、Decorator 和 Service。编辑 `SimpleParallel` 的后台子树时，要明确指定 `Background` 输出引脚。[查看行为树编辑文档](/zh/works/mcp-behavior-tree/docs/edit-tree/)

### 黑板与键绑定

可以创建黑板、将黑板关联到行为树，并添加或移除键。移除前，工具会扫描项目中的行为树；如果发现引用或扫描未完成，默认拒绝删除。只有明确传入 `bForce=true` 才能接受这项风险。验证会检查无效键绑定，也会报告结构错误、缺失类、无效的装饰器中止模式或未连接节点。[查看黑板键文档](/zh/works/mcp-behavior-tree/docs/blackboard-keys/)

## 使用流程

例如，要搭建一棵敌人 AI 行为树，先按[连接说明](/zh/works/mcp-behavior-tree/docs/connect-and-inspect/)接入编辑器，再创建黑板和所需的键。创建引用该黑板的行为树，在 `Root` 下先放 Composite，再加任务、装饰器和服务。用 `GetBehaviorTreeDetail` 核对节点和属性，运行 `ValidateBehaviorTree` 并处理报告的问题，最后对每个改过的行为树或黑板分别调用 `SaveAsset`。在显式保存前，改动只留在内存中。

## 开发状态

项目处于开发阶段。UE 5.2–5.8 相关版本仍在开发，兼容性待确认，各版本的测试尚未全部完成。[查看 MCPBehaviorTree 教程](/zh/works/mcp-behavior-tree/docs/connect-and-inspect/)

## 支持

反馈请发送至 [mzsh.me@icloud.com](mailto:mzsh.me@icloud.com)。
