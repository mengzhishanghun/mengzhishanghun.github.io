---
title: Edit Components, Inheritance, and Class Defaults
type: doc
slug: mcp-blueprint-components-and-inheritance
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-blueprint
documentKind: product-manual
websiteRoute: /en/works/mcp-blueprint/docs/components-and-inheritance/
lang: en
translationKey: doc:mcp-blueprint:components-and-inheritance
sourceHash: 8048ab43481358286ba55e6ad7f67db69af283e86d325001c03dfaa6a2a787fa
translationStatus: translated
generatedBodyHash: b687511bd0f0b050f954b27e17c586a624bde230f80050bdc8e5f49677856ab1
docPage:
  work: mcp-blueprint
  group: workflows
  slug: components-and-inheritance
  order: 3
---

### 4. `SetComponentProperties`: SCS template properties

Use `GetComponents` to find the local SCS `ComponentName`. Supply `Properties` as a map of property names to UE-text values, for example `RelativeLocation: "(X=0,Y=0,Z=50)"` or `bHiddenInGame: "True"`. The tool edits only component templates added by this Blueprint. An invalid property rolls back the whole call and reports the property name with a format hint. Save separately with `SaveAsset` when needed.

### 5. `SetClassDefaults`: CDO defaults and inherited properties

Use `GetClassDefaults` to find editable, case-sensitive reflected property names. Supply a UE-text `Properties` map, such as `bReplicates: "True"` or `JumpMaxCount: "2"`. This changes the Blueprint CDO defaults used by future placed or spawned instances without overrides; it does not retroactively replace existing instance values. It can also access properties inherited from a C++ or Blueprint parent, which `ModifyVariable` cannot edit as declarations. Use `SaveAsset` when you want to keep the change.

### 6. `ReparentBlueprint` and `ReparentComponent`: class and component parents

`ReparentBlueprint` changes class inheritance. Supply `NewParentClassPath` as a full native path, a unique loaded short name, or a Blueprint-generated class. Start with `bDryRun=true` to inspect the risks. Explicit `bAllowPotentialDataLoss=true` is required if the new parent is not a subclass of the old parent, the old parent is missing, or interfaces conflict. The tool refreshes graphs and attempts Undo rollback on failure.

`ReparentComponent` changes the attachment tree of local SceneComponents within the same Actor Blueprint. Supply the component name and new `NewParentName`. A component cannot attach to itself or a descendant, and non-SceneComponents cannot be reparented. Use `SetRootComponent` for the actual local root.

## Components and class defaults

Read the current component hierarchy before adding, renaming, duplicating, reparenting, setting a root, editing template properties, or removing components. Class-default tools read or edit supported Blueprint defaults; instance values are not presented as class defaults.
