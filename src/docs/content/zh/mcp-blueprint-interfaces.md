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
  group: features
  slug: interfaces
  order: 7
documentKind: product-manual
websiteRoute: /zh/works/mcp-blueprint/docs/interfaces/
lang: zh
translationKey: doc:mcp-blueprint:interfaces
---

## 读取现有接口并指定新接口

先用 `GetBlueprintOverview` 确认目标 `BlueprintPath`，并看列表里是否已有所需接口。需要添加时，把接口的类路径交给 `AddInterface`。添加后可再看同一蓝图的接口列表，需要保留时调用 `SaveAsset`。
