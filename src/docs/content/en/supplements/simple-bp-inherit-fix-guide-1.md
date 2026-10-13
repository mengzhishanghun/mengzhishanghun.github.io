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
sourceHash: f40fb641e968646d0906f709d66b12306d6c8f9ff533fbce5f60d9d73e29db22
translationStatus: translated
generatedBodyHash: 2b288871d4da81f54c625d075920ae73f68dd227d8e42fbb1c04b316b58329f2
---

# SimpleBPInheritFix User Guide

SimpleBPInheritFix handles specific component-state anomalies in Actor Blueprint inheritance chains.

## Procedure

1.  Install the plugin and compile successfully
2.  Right-click any affected Actor Blueprint in the Content Browser
3.  Select **Component Repair → Fix Inheritance Pollution**
4.  Open the Output Log, filter `LogSBIF`, and review execution
5.  When the editor shows the save dialog, **save the Blueprints marked dirty** to finish

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

-   Handles only the component anomaly covered by this plugin (`CreationMethod=Instance` pollution); other Blueprint issues are outside its scope
-   Dynamically created Construction Script components are not scanned because they do not use SCS/ICH
-   Supports only Actor Blueprints; non-Actor Blueprints do not have this issue

---

Originally published on 2026-05-13 on [CNBlogs](https://www.cnblogs.com/mengzhishanghun/p/20030737).
