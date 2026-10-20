---
title: SimpleBPInheritFix User Guide
description: Check component inheritance anomalies through the Actor Blueprint context menu and handle checkout, logs, and saving.
type: doc
slug: simple-bp-inherit-fix-guide
categoryId: ue-tools
categoryName: UE Tools
categoryOrder: 0
order: 0
status: Official Documentation
date: 2026-05-13
draft: false
sitePublish: false
tags:
  - SimpleBPInheritFix
  - UE Tools
sourcePlatform: CNBlogs
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/20030737
links:
  - label: Original CNBlogs article
    href: https://www.cnblogs.com/mengzhishanghun/p/20030737
workIds:
  - simple-bp-inherit-fix
lang: en
translationKey: doc:simple-bp-inherit-fix-guide:supplement:1
sourceHash: 13b905613767f94b1b22029ddf92e81a45926003797606a4a528c760fc3f5e82
translationStatus: translated
generatedBodyHash: 669249f69e7f3a6ce84533969160ddcc2723b916ff25d945acf96b88ae315c61
---

# SimpleBPInheritFix User Guide

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

## Procedure

1.  Install the plugin and compile successfully
2.  Right-click any affected Actor Blueprint in the Content Browser
3.  Select **Component Repair → Fix Inheritance Pollution**
4.  Open the Output Log, filter `LogSBIF`, and review execution
5.  When the editor shows the save dialog, **save the Blueprints marked dirty** to finish

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

## Repair Stages

Collect the inheritance chain and identify affected components before checkout, field updates, and saving.

| Stage | Action |
| --- | --- |
| 1. **GatherChain** | Collect parents, the current Blueprint, and descendants |
| 2. **ScanChain** | Scan each Blueprint's SCS and ICH for `CreationMethod=Instance` records |
| 3. **CheckOutFindings** | Check out the affected uasset files through source control |
| 4. **ApplyFindings** | Change `CreationMethod` from `Instance` to `SimpleConstructionScript` |
| 5. **MarkDirty** | Mark changed Blueprints dirty and prompt the user to save manually |

A complete log looks roughly like this:

```
[SBIF] ==============================================
[SBIF]  Fix Inheritance Pollution started (anchor: BP_MyActor)
[SBIF] ==============================================
[SBIF] -------- Stage 1 / Gather Inheritance Chain --------
[SBIF]   Self: BP_MyActor
[SBIF]   Ancestor: BP_BaseActor
[SBIF]   Descendant: BP_MyActorExt
[SBIF]   Total 3 blueprints (ancestors+self 2 / descendants 1)
[SBIF] -------- Stage 2 / Scan Instance-corrupted Nodes --------
[SBIF]   [BP_BaseActor / SCS] 'MeshComp'  (Template=MeshComp_GEN_VARIABLE)
[SBIF]   Scan complete: 1 Instance-corrupted nodes total
[SBIF] -------- Stage 3 / SourceControl CheckOut --------
[SBIF]   ✅ [BP_BaseActor]  /Content/BP_BaseActor.uasset
[SBIF] -------- Stage 4 / Repair CreationMethod --------
[SBIF]   [BP_BaseActor / SCS] 'MeshComp'  Instance -> SimpleConstructionScript
[SBIF] -------- Stage 5 / Mark Blueprints Dirty --------
[SBIF]   Dirty: BP_BaseActor
[SBIF]   1 blueprints marked dirty, manual save required
```

## Frequently Asked Questions

### The Scan Finds 0 Items Despite Pollution?

When the scan returns 0, use the `LogSBIF` log to determine whether this is the component-state anomaly handled by this tool.

### What If CheckOut Fails?

The plugin still completes in-memory repair, but checkout must be resolved manually before saving. Common causes:

-   The file is locked by another user
-   The source control server is unreachable
-   Workspace mapping does not include the file

Resolve checkout manually first, then return to UE and save.

### Could It Damage Normal Components?

The repair scope is **only the `CreationMethod` field** (`Instance → SimpleConstructionScript`); no other properties are changed. Check the component state of affected Blueprints before saving.

### Does Choosing the Wrong Anchor Matter?

The entry Blueprint locates the inheritance chain; scanning covers ancestors, the current Blueprint, and descendants.

### Does It Work without Perforce?

-   **Git**: Checkout is essentially a no-op because files are already writable
-   **Git LFS**: Automatically requests an LFS lock
-   **SVN**: Runs `svn lock`
-   **No source control**: Skips checkout entirely and proceeds to repair

## Scope

This concerns CreationMethod anomalies in Actor Blueprint component templates, not every Blueprint fault. Components created dynamically in Construction Script need separate assessment; the same repair rules cannot be applied automatically.

-   Handles only the component anomaly covered by this plugin (`CreationMethod=Instance` pollution); other Blueprint issues are outside its scope
-   Dynamically created Construction Script components are not scanned because they do not use SCS/ICH
-   Supports only Actor Blueprints; non-Actor Blueprints do not have this issue

---

Originally published on 2026-05-13 on [CNBlogs](https://www.cnblogs.com/mengzhishanghun/p/20030737).
