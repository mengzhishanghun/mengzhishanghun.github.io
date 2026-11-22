---
title: Configure Enhanced Input Actions and Mappings
type: doc
slug: mcp-dev-tools-enhanced-input
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-dev-tools
documentKind: product-manual
websiteRoute: /en/works/mcp-dev-tools/docs/enhanced-input/
lang: en
translationKey: doc:mcp-dev-tools:enhanced-input
sourceHash: 571e9687334e0a2592b1889b030cf7092ddeb5fe23f23335c4042b298297477c
translationStatus: translated
generatedBodyHash: 30feeecbe46156b3dd1a8e4884cb33ae1fe396269de039c200546969916dd7f9
docPage:
  work: mcp-dev-tools
  group: data
  slug: enhanced-input
  order: 7
---

## Enable Enhanced Input

InputAction and InputMappingContext tools also require EnhancedInput. Creating either asset type requires the InputEditor module.

## Input actions and mapping contexts

| Type | Tools | Purpose and main parameters |
|---|---|---|
| InputAction | `GetInputAction`, `CreateInputAction`, `SetInputAction` | Read settings and their Trigger, Modifier, and PlayerMappable instances; edit with `ExpectedSettings`, `ExpectedTriggers`, `ExpectedModifiers`, `ExpectedPlayerMappableKeySettings`, and the corresponding new `Properties`, `Triggers`, `Modifiers`, and `PlayerMappableKeySettings`. |
| InputMappingContext | `GetInputMappingContext`, `CreateInputMappingContext`, `SetInputMappingContext` | Read settings, ordered default `Mappings`, and version-supported `MappingProfileOverrides`; edit with `ExpectedSettings`, `ExpectedMappings`, new `Properties`, and complete new `Mappings`. Versions that support profiles also require `ExpectedMappingProfileOverrides` and complete new `MappingProfileOverrides`. |

## Instance format and engine versions

Input Trigger, Modifier, and PlayerMappable settings are instances owned by the asset, rather than ordinary object references. Replace an instance using the shape `{ "ClassPath": "/Script/EnhancedInput.InputTriggerHold", "Properties": {} }`. Arrays retain input order, and `PlayerMappableKeySettings` accepts that object shape or `null`. Each InputMappingContext mapping contains `Properties`, `Triggers`, and `Modifiers`, with optional `PlayerMappableKeySettings`. `MappingProfileOverrides` is an object mapping profile names to complete mapping arrays. UE 5.8 exposes profiles; UE 5.2 has no such field and rejects profile parameters. First read `bProfileOverridesSupported` and the complete old values for the current engine from `GetInputMappingContext`.

Preview changes before applying them, then save separately. See the [preview and save workflow](/en/works/mcp-dev-tools/docs/connect/).
