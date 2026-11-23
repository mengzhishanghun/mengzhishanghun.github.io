---
title: 配置 Enhanced Input 动作和映射
type: doc
slug: mcp-dev-tools-enhanced-input
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-dev-tools
docPage:
  work: mcp-dev-tools
  group: features
  slug: enhanced-input
  order: 9
documentKind: product-manual
websiteRoute: /zh/works/mcp-dev-tools/docs/enhanced-input/
lang: zh
translationKey: doc:mcp-dev-tools:enhanced-input
---

## 启用 Enhanced Input

InputAction 和 InputMappingContext 工具还要求启用 EnhancedInput；创建这两类资产需要 InputEditor 模块可用。

## InputAction 与 InputMappingContext

| 类型 | 工具 | 用途与主要参数 |
|---|---|---|
| InputAction | `GetInputAction`、`CreateInputAction`、`SetInputAction` | 读取设置及其 Trigger、Modifier、PlayerMappable 实例；修改时提交 `ExpectedSettings`、`ExpectedTriggers`、`ExpectedModifiers`、`ExpectedPlayerMappableKeySettings` 和相应的新 `Properties`、`Triggers`、`Modifiers`、`PlayerMappableKeySettings`。 |
| InputMappingContext | `GetInputMappingContext`、`CreateInputMappingContext`、`SetInputMappingContext` | 读取设置、有序默认 `Mappings` 和版本支持的 `MappingProfileOverrides`；修改时提交 `ExpectedSettings`、`ExpectedMappings`、新 `Properties` 和完整新 `Mappings`。支持 profiles 的版本还必须提交 `ExpectedMappingProfileOverrides` 与完整新 `MappingProfileOverrides`。 |

## 实例格式与引擎版本差异

Input 的 Trigger、Modifier 和 PlayerMappable 设置是资产持有的实例，不是普通对象引用。替换实例使用 `{ "ClassPath": "/Script/EnhancedInput.InputTriggerHold", "Properties": {} }` 形态；数组保持输入顺序，`PlayerMappableKeySettings` 可为该对象形态或 `null`。InputMappingContext 的每条映射包含 `Properties`、`Triggers`、`Modifiers`，可选 `PlayerMappableKeySettings`；`MappingProfileOverrides` 是 profile 名到完整映射数组的对象。UE 5.8 暴露 profiles，UE 5.2 不提供该字段，传入 profile 参数会报错。先从 `GetInputMappingContext` 取得当前引擎的 `bProfileOverridesSupported` 与完整旧值。

例如，要改一条默认按键映射，先读取 InputMappingContext。在完整新数组中修改这一项，其余映射沿用原值和顺序；旧数组也完整提交。当前版本支持 profiles 时，同样准备完整的旧配置和新配置。先预览，执行后读回确认，再单独保存；见[预览和保存规则](/zh/works/mcp-dev-tools/docs/connect/)。
