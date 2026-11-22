---
title: Repair Inherited Components
type: doc
slug: simple-bp-inherit-fix-repair-components
draft: false
sitePublish: true
tags:
  - Blueprints
  - Inheritance Chain
workIds:
  - simple-bp-inherit-fix
documentKind: product-manual
websiteRoute: /en/works/simple-bp-inherit-fix/docs/repair-components/
lang: en
translationKey: doc:simple-bp-inherit-fix:repair-components
sourceHash: fed61244653ce5a7b5960674253d219a34a15628ffb6fe9572e7445d97ea0b73
translationStatus: translated
generatedBodyHash: 86555c38fbe9237ba40330fb2d1bf3796b5c38b7d94cc98672b54311c6baa3e6
docPage:
  work: simple-bp-inherit-fix
  group: components
  slug: repair-components
  order: 2
---

## Run the Repair

1. Install the plugin and confirm it compiles.
2. In the Content Browser, right-click an affected Actor Blueprint and choose **Component Repair → Fix Inheritance Pollution**.
3. Filter the Output Log by `LogSBIF` and check the scan scope, checkout, and repairs.
4. Review the affected files in the save dialog, then save the Blueprints marked dirty.

## Review and Save the Repair

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

## Repair Scope

The repair only changes `CreationMethod` on affected templates from `Instance` to `SimpleConstructionScript`. It excludes components created dynamically in Construction Script and unrelated Blueprint issues. Before saving, review the affected components and the files checked out by the tool.

## Troubleshoot Repair Results

Start with `LogSBIF` to check scan results and checkout status.

## The Scan Finds No Issues

A result of zero may indicate an issue outside the tool’s scope. Check the full `LogSBIF` output to see which Blueprints and component records were scanned.

## Checkout Fails

The plugin still repairs the Blueprint in memory when checkout fails. Check for an existing lock, server reachability, and workspace mappings. If manual checkout is needed, use `p4 edit`, `git lfs lock`, or `svn lock` as appropriate, then save in UE.

## Checkout by Source Control Provider

-   **Git**: Checkout is essentially a no-op because files are already writable
-   **Git LFS**: Automatically requests an LFS lock
-   **SVN**: Runs `svn lock`
-   **No source control**: Skips checkout entirely and proceeds to repair

## Interface Language

Open **Edit → Project Settings**, go to SimpleBPInheritFix settings, and set **Language** to **English** or **Chinese**. English is the default. User-facing interfaces, prompts, notifications, and functional logs update immediately without restarting the editor; public API names and module startup/shutdown logs always remain in English.
