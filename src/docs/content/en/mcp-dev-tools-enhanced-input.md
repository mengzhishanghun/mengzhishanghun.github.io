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
sourceHash: 550ee2d3d6b9d013a331509d5807b1655efa687573328fd5c76a0d146f1d0728
translationStatus: translated
generatedBodyHash: dae2b97665df21fbe72d41b644fb2455f6ac01b63261c50aacd4a0e8b0f02306
docPage:
  work: mcp-dev-tools
  group: features
  slug: enhanced-input
  order: 9
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

To change one default key mapping, read the InputMappingContext first. Edit that entry in the complete new array, keeping the other entries and their order. Send the complete old array too. If your engine version supports profiles, prepare the full old and new profile configurations as well. Preview the change, apply it, and read it back before saving separately; see the [preview and save workflow](/en/works/mcp-dev-tools/docs/connect/).
