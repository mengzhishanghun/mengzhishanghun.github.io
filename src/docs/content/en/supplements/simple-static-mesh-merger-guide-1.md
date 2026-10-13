---
title: SimpleStaticMeshMerger User Guide
description: Preview and filter StaticMeshActor groups and organize selected objects into ISM/HISM instances.
type: doc
slug: simple-static-mesh-merger-guide
categoryId: ue-tools
categoryName: UE tools
categoryOrder: 0
order: 0
status: Official documentation
date: 2025-11-09
draft: false
sitePublish: false
tags:
  - SimpleStaticMeshMerger
  - UE tools
sourcePlatform: 博客园
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19204715
links:
  - label: Original Cnblogs article
    href: https://www.cnblogs.com/mengzhishanghun/p/19204715
workIds:
  - simple-static-mesh-merger
lang: en
translationKey: doc:simple-static-mesh-merger-guide:supplement:1
sourceHash: e22fe5bf80d9dc9e236aae71c4f738aae6471fbbadfb95a7255c551d7f7d6fd9
translationStatus: translated
generatedBodyHash: 34466ab4295ad18779c3d3a8d0edde889b8b5172766966d4f3bd50a84ae6ffdd
---

# SimpleStaticMeshMerger User Guide

Preview StaticMeshActor groups in the tool window, filter the objects to merge, then generate instanced meshes.

## Features and Filters

**1\. Process LevelInstances**

Click `Break Level Instances`:

- Automatically breaks all nested LevelInstances recursively
- Displays progress in real time (Breaking: \[name\])
- Automatically refreshes the merge preview when complete

**2\. Group Preview**

The plugin automatically **groups** StaticMeshActors in the scene **strictly** by:

- Mesh (same model)
- Mobility (Static/Stationary/Movable)
- Complete collision configuration (Profile + ObjectType + 32 channel responses)
- Materials (materials in all slots)

**3\. Live Filtering and Exclusion**

- **Mobility filter**: Show only Static/Stationary/Movable Actors
- **Minimum instance count**: Filter out groups with too few instances (default 2, meaning at least 3 are needed to merge)
- **Actor exclusion**: Uncheck Actors you do not want to merge in the right-hand list

**4\. Merge Selected Objects**

Click `Merge Selected`:

- Automatically creates an HISM/ISM Actor
- Copies collision, material, and mobility settings
- Deletes the original Actors
- Automatically selects and navigates to the newly created Actor

## Steps

```
Workflow:
1. Window → Static Mesh Merger (open the plugin window)
2. Click Break Level Instances (if the scene contains LevelInstances)
3. Configure filters:
   ☑ Static  ☑ Stationary  ☐ Movable
   Min Instance Count: 2
4. Check the groups to merge on the left
5. Exclude unwanted Actors on the right (optional)
6. Click Merge Selected
7. Done! Automatically navigate to the newly created HISM Actor
```

**Before merging:**

```
Scene Outliner
├── TreeActor_1
├── TreeActor_2
├── TreeActor_3
├── ...
└── TreeActor_125  (125 separate Actors)
```

**After merging:**

```
Scene Outliner
└── MergedActor_SM_Tree_01 (1 HISM Actor containing 125 instances)
```

## Checks Before and After the Operation

- Keep a recoverable scene version; merging replaces the original Actors.
- Check each group's mesh, materials, mobility, and collision settings.
- After merging, review instance counts and check the scene's appearance and behavior.
- Measure actual load times and frame rates in the target project.

---

Originally published on 2025-11-09 on [Cnblogs](https://www.cnblogs.com/mengzhishanghun/p/19204715).
