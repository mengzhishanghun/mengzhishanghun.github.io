---
title: Identify Inherited Component Issues
type: doc
slug: simple-bp-inherit-fix-find-components
draft: false
sitePublish: true
tags:
  - Blueprints
  - Inheritance Chain
workIds:
  - simple-bp-inherit-fix
documentKind: product-manual
websiteRoute: /en/works/simple-bp-inherit-fix/docs/find-components/
lang: en
translationKey: doc:simple-bp-inherit-fix:find-components
sourceHash: 5c7cbd8f273da9b833ae781d47cf9dfbf436629513d5c9ec94ae0d241a568d85
translationStatus: translated
generatedBodyHash: 990cf2ae3bb64dcda8f5acfb1d10cf652e744516f0c8e6ec7ef4d0728b6bf38d
docPage:
  work: simple-bp-inherit-fix
  group: components
  slug: find-components
  order: 1
---

## Supported Symptoms

Actor Blueprint inheritance can exhibit these component anomalies:

- **Cut / Delete is disabled in the parent Blueprint** even though the component belongs to that parent.
- **A child Blueprint's property changes write back to the parent**: Even toggling a bool can affect the parent template rather than creating an isolated child override.

## Scan Scope

Collect Blueprints in both directions:

- **Upward**: Follow `ParentClass` from the anchor Blueprint to gather its Blueprint ancestors.
- **Downward**: Use UE's `AssetRegistry.GetDerivedClassNames()` to gather derived Blueprint classes.

Merge and deduplicate the sets to establish the inheritance range to inspect.

## Component Records in SCS and ICH

Inherited component information appears in two locations, both of which must be checked:

- **SCS nodes** (`SimpleConstructionScript.AllNodes`): Components defined directly by the Blueprint.
- **ICH records** (`InheritableComponentHandler.CreateRecordIterator()`): Child overrides of components inherited from a parent.

Scan both locations for each Blueprint to find records with `CreationMethod == Instance`.

## The CreationMethod Field

UE's `UActorComponent` records how a component was created in `CreationMethod`:

| Value | Meaning |
| --- | --- |
| `Native` | Created in a C++ constructor |
| `SimpleConstructionScript` | Added through the Blueprint editor's Components panel; the normal Blueprint component case |
| `UserConstructionScript` | Created dynamically in ConstructionScript nodes |
| `Instance` | Added to a particular Actor instance; it should not describe these Blueprint component templates |

The anomaly examined here occurs when a component template's `CreationMethod` is incorrectly set to `Instance`. The editor no longer treats it as a component defined by the Blueprint. Cut / Delete follows a different branch and becomes disabled; child property changes are treated as instance changes and written to the parent template rather than producing a child override.

## Known Conditions

The triggering operations have not formed a stable reproduction path. Similar symptoms alone cannot establish the cause; check the component template's `CreationMethod`. Once present, the anomaly may persist and does not repair itself when saved.
