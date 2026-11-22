---
title: Find Inherited Component Problems
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
sourceHash: bc7a6b04c58ea40d5b722a30b729b191e99bbdf500c7dc97f2f5a2a71517e336
translationStatus: translated
generatedBodyHash: 687f624d72ec47799c264b62030bfc987b33132a3eeb1d9fae304652e5eccf6c
docPage:
  work: simple-bp-inherit-fix
  group: workflows
  slug: find-components
  order: 1
---

**Supported Unreal Engine versions**: 5.2–5.8

Fix component pollution in Actor Blueprint inheritance chains with one click.

> ⚠️ This plugin modifies multiple Blueprints in the inheritance chain. Changes are conservative, but check that automatically checked-out files match expectations before submitting to version control.

---

## SimpleBPInheritFix User Guide

SimpleBPInheritFix handles specific component-state anomalies in Actor Blueprint inheritance chains.

See the [SimpleBPInheritFix work page](/en/works/simple-bp-inherit-fix/) for its purpose and use cases.

## Component Anomalies to Check

Actor Blueprint inheritance can exhibit these component anomalies:

- **Cut / Delete is disabled in the parent Blueprint** even though the component belongs to that parent.
- **A child Blueprint's property changes write back to the parent**: Even toggling a bool can affect the parent template rather than creating an isolated child override.

## Why Component Templates Become Abnormal

### 1.1 Root Cause

UE's `UActorComponent` records how a component was created in `CreationMethod`:

| Value | Meaning |
| --- | --- |
| `Native` | Created in a C++ constructor |
| `SimpleConstructionScript` | Added through the Blueprint editor's Components panel; the normal Blueprint component case |
| `UserConstructionScript` | Created dynamically in ConstructionScript nodes |
| `Instance` | Added to a particular Actor instance; it should not describe these Blueprint component templates |

The anomaly examined here occurs when a component template's `CreationMethod` is incorrectly set to `Instance`. The editor no longer treats it as a component defined by the Blueprint. Cut / Delete follows a different branch and becomes disabled; child property changes are treated as instance changes and written to the parent template rather than producing a child override.

### 1.2 What Triggers It

The triggering operations have not formed a stable reproduction path. Similar symptoms alone cannot establish the cause; check the component template's `CreationMethod`. Once present, the anomaly may persist and does not repair itself when saved.

### 1.3 Why Manual Repair Is Difficult

Repair restores abnormal `CreationMethod` values to `SimpleConstructionScript`, but several locations need checking:

1. Components can appear in both SCS nodes and ICH records; both locations need attention.
2. Multiple Blueprints in the inheritance chain may be affected; changing one may be insufficient.
3. Descendant Blueprints may also be affected.
4. Source-controlled files can be read-only and need individual checkout.

The property panel cannot edit this field directly. Scripted repair requires knowing where Blueprint component records are stored.

## Scanning Inheritance Chains and Component Records

### Inheritance Chain Scan Scope

Collect Blueprints in both directions:

- **Upward**: Follow `ParentClass` from the anchor Blueprint to gather its Blueprint ancestors.
- **Downward**: Use UE's `AssetRegistry.GetDerivedClassNames()` to gather derived Blueprint classes.

Merge and deduplicate the sets to establish the inheritance range to inspect.

### Component Records in SCS and ICH

Inherited component information appears in two locations, both of which must be checked:

- **SCS nodes** (`SimpleConstructionScript.AllNodes`): Components defined directly by the Blueprint.
- **ICH records** (`InheritableComponentHandler.CreateRecordIterator()`): Child overrides of components inherited from a parent.

Scan both locations for each Blueprint to find records with `CreationMethod == Instance`.
