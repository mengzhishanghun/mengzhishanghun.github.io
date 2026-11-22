---
title: 为蓝图添加接口
type: doc
slug: mcp-blueprint-interfaces
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-blueprint
docPage:
  work: mcp-blueprint
  group: members-types
  slug: interfaces
  order: 4
documentKind: product-manual
websiteRoute: /zh/works/mcp-blueprint/docs/interfaces/
lang: zh
translationKey: doc:mcp-blueprint:interfaces
---

## 读取现有接口并指定新接口

先用 `GetBlueprintOverview` 核对目标 `BlueprintPath` 和已实现的接口，再把接口类路径交给 `AddInterface`。如需保留改动，调用 `SaveAsset`。
