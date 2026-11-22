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
sourceHash: 6171aeabb3f9bb1da14c775bd22b4b96e7f5ec2b7e64ceba9269265db7f488d9
translationStatus: translated
generatedBodyHash: fc886e6788171ecef52fff211e9fe0a6a29236b11fede4a1408e1626efeb59a9
docPage:
  work: simple-bp-inherit-fix
  group: workflows
  slug: repair-components
  order: 2
---

## 📝 How to Use

1. Install the plugin and compile successfully
2. In the Content Browser, **right-click any affected Actor Blueprint**, whether ancestor, self, or descendant
3. Select **Component Repair → Fix Inheritance Pollution**
4. Open the Output Log and filter `LogSBIF` to monitor execution
5. The editor shows a save dialog — **save the Blueprints marked dirty** to finish

---

## ❓ Frequently Asked Questions

**The scan returns 0 findings despite visible corruption?**  
You may have a problem outside this plugin's scope (rare). Paste the complete `LogSBIF` log for diagnosis.

**What if CheckOut fails?**  
The plugin continues repairing in memory, but you must resolve checkout manually before saving (`p4 edit` / `git lfs lock` / `svn lock`). Common causes include another user's lock, an unreachable server, or a mapping that excludes the file.

**Which Blueprint should be the anchor?**  
Choose any — ancestors, self, and descendants are scanned, yielding the same result.

**Can I use it without Perforce?**  
- Git: CheckOut is effectively a no-op; files are writable by default
- Git LFS: Sends an LFS lock request
- SVN: Runs `svn lock`
- No version control: Skips the CheckOut stage

---

## ⚠️ Limitations

- Handles only the specific component pollution covered by this plugin; other Blueprint issues are outside its scope
- Does not scan components created dynamically in Construction Script

---

## Version History



Open **Edit → Project Settings**, go to SimpleBPInheritFix settings, and set **Language** to **English** or **Chinese**. English is the default. User-facing interfaces, prompts, notifications, and functional logs update immediately without restarting the editor; public API names and module startup/shutdown logs always remain in English.

## Contact

For usage questions or collaboration inquiries, visit the contact page.

- **Contact:** [Contact and Collaboration](https://mzsh.me/contact/)

## Procedure

1.  Install the plugin and compile successfully
2.  Right-click any affected Actor Blueprint in the Content Browser
3.  Select **Component Repair → Fix Inheritance Pollution**
4.  Open the Output Log, filter `LogSBIF`, and review execution
5.  When the editor shows the save dialog, **save the Blueprints marked dirty** to finish

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
