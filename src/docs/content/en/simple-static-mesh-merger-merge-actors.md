---
title: Filter and Merge Static Mesh Actors
type: doc
slug: simple-static-mesh-merger-merge-actors
draft: false
sitePublish: true
tags:
  - StaticMesh
  - Instancing
workIds:
  - simple-static-mesh-merger
documentKind: product-manual
websiteRoute: /en/works/simple-static-mesh-merger/docs/merge-actors/
lang: en
translationKey: doc:simple-static-mesh-merger:merge-actors
sourceHash: 0517a11d4ef846ca879e06bb7673a9ca256ecccc088dc3469345a49dcfb69319
translationStatus: translated
generatedBodyHash: 571b24fe1b5d7c22a9ef0ba2d290606e78e437dabbc659f441a213b318f77270
docPage:
  work: simple-static-mesh-merger
  group: workflow
  slug: merge-actors
  order: 1
---

## Merge Scope and Grouping Criteria

The plugin automatically groups Actors with **identical properties** into the same group, including:

1. **Static Mesh**: The static mesh asset used
2. **Mobility**: Mobility type (Static/Stationary/Movable)
3. **Full Collision Settings**:
   - Collision enabled type (NoCollision/QueryOnly/PhysicsOnly, etc.)
   - Collision profile name
   - Collision object type
   - Responses for all 32 collision channels
4. **Materials**: Material list

**Only Actors with all identical properties will be merged into one group.**

Merging is limited to actors in the `PersistentLevel`. To include actors inside a LevelInstance, follow the separate chapter on breaking LevelInstances first.

## Filter by Mobility and Instance Count

- ☑ **Static**: Include static objects
- ☑ **Stationary**: Include stationary objects
- ☐ **Movable**: Include movable objects
- Default: Static + Stationary checked

Set `Min Instance Count` from 0 to 1000; the default is 2. The total count governs visibility, the eligible count governs selection, and the participating count governs execution. Whether a group whose count exactly equals the threshold can be merged depends on the preview and execution result in the current release.

## Preview Groups, Search, and Locate Instances

Displays all qualifying merge groups, each containing:

- ☑ **Checkbox**: Select groups to participate in merge
- **Group Name**: Uses the first non-excluded instance's name (dynamically updated)
- **Instance Details**: Shows "Instance Count • Type • Mobility" (e.g., `5 Instances • HISM • Static`)

Top features:

- **Search Box**: Fuzzy search by instance name (tokenized + sequential matching)
- **Select All**: Batch check/uncheck currently displayed groups

Displays all instances in the selected left panel group:

- ☑ **Checkbox**: Check to include in merge, uncheck to exclude instance
- **Actor Name**: Instance label in the scene
- **[⊙] Locate Button**: Click to jump to the Actor in scene and select in Outliner

- **Toggle All**: Batch check/uncheck all instances

Supports **tokenized fuzzy search** where keywords must appear in order:

**Example**: Search `SM 02`

- ✅ Match: `SM_Rock_02` ("SM" before "02")
- ✅ Match: `SM_000002` ("SM" before "02")
- ❌ No match: `02_SM_Rock` (wrong order)
- ❌ No match: `Rock_02` (missing "SM")

- **Display Only**: Doesn't modify data, clearing search box restores all groups
- **Group-Level Filter**: If any instance in a group matches, the entire group is shown (with all instances)
- **Merge Limitation**: Only merges currently displayed and checked groups

If exclusions bring the eligible count below the threshold, the group is automatically unchecked.

## Refresh and Keep Exclusions

- Auto-monitors Actor additions/deletions (refreshes after 500ms delay)
- Map switches clear list (requires manual Refresh click)

- **Excluded List Persistence**: Unchecked instances are recorded in the exclusion list
- **State Maintained on Refresh**: Clicking Refresh button or auto-refresh on scene changes **preserves** exclusion state
- **Window-Level Lifecycle**: All instances reset to default checked state only when closing and reopening the window
- **Use Case**: Can gradually adjust excluded instances, refresh multiple times to verify results without repeating operations

## Merge Groups and Check the Result

Save a recoverable scene version first, because merging replaces the original actors. Check the mesh, materials, mobility, and collision of each group. Filter and select the groups as shown below, then click **Merge Selected**. The plugin copies the collision configuration, including object type and all 32 channel responses. Afterward, check instance counts and scene behavior. The editor selects the new actors and jumps to the first one.

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

## Choose ISM or HISM

1. **Prioritize Large Duplicates**: More instances = better optimization
2. **Batch Merge**: Use search to merge by category (e.g., merge trees first, then rocks)
3. **Preserve Necessary Grouping**: Don't merge objects that need individual control

- **HISM** (Default Recommended):
  - Supports LOD
  - Supports occlusion culling
  - Better performance for large-scale instances

- **ISM**:
  - Simpler and lighter
  - Lower overhead for small-scale instances

## Loading Costs and What to Measure

When a large scene loads, serializing many separate StaticMeshActors, initializing their components and registering them in the scene can take time. The tree example compares two ways to organize repeated meshes.

Consider a scene with 500 identical trees stored as separate actors:

```cpp
// 场景中：500个AStaticMeshActor
for (int i = 0; i < 500; i++)
{
    AStaticMeshActor* Tree = SpawnActor<AStaticMeshActor>();
    Tree->SetStaticMesh(TreeMesh);
    Tree->SetActorLocation(Locations[i]);
}
```

**Work during loading**

1. Deserialize 500 sets of objects (an AStaticMeshActor and UStaticMeshComponent for each tree).
2. Create, initialize and register 500 components.
3. Build collision for each component, even when the settings match.
4. Register 500 components with the renderer, each submitting its own data.

**Where the cost comes from**

- Additional actors and components mean more serialization.
- Component initialization involves virtual calls and scene registration.
- Collision work repeats even for matching settings.
- Scattered allocations can reduce cache locality.

The same example using HISM:

```cpp
// 合并后：1个AStaticMeshActor + 1个UHierarchicalInstancedStaticMeshComponent
UHierarchicalInstancedStaticMeshComponent* HISM = CreateDefaultSubobject<UHierarchicalInstancedStaticMeshComponent>();
HISM->SetStaticMesh(TreeMesh);

for (int i = 0; i < 500; i++)
{
    HISM->AddInstance(FTransform(Locations[i])); // 只添加Transform数据
}
```

1. Deserialize one AStaticMeshActor.
2. Deserialize one HISM component and an array of 500 transforms.
3. Process collision data for the instanced component.
4. Register the component with the renderer and submit the instances together.
5. Build the spatial data used for instance culling.

**What changes**

- One actor replaces 500 actors, reducing serialization work.
- One component replaces 500 components, reducing initialization work.
- Instance transforms are serialized in a contiguous array.
- The instanced component organizes the meshes and transforms.
- It manages rendering data for the instances as a batch.

The 500-tree example compares data organization. The code is illustrative and some calls depend on context. Count actors, components and instance transforms separately; these figures do not represent the exact number of UObjects in the whole scene. Collision, culling and memory improvements depend on the settings and engine version.

A reduction in actor count does not imply a proportional performance gain. Measure loading time, memory use, and frame rate in the target scene.

## Check Properties When Merging Manually

An ISM or HISM setup can be created by hand:

1. Create an actor and add an `InstancedStaticMeshComponent` or `HierarchicalInstancedStaticMeshComponent`.
2. Add each matching StaticMeshActor's transform to the ISM or HISM component.
3. Delete the original actors.

Directly maintaining the instance array in code changes how artists edit the scene:

**Editing workflow**

- Artists need code to add instances in this workflow.
- Repositioning requires editing the transform array.
- Standard move, rotate and duplicate tools are unavailable for those edits.

**Copying properties**

- Copy mobility, collision, materials and rendering settings by hand.
- Leaving out a property can change behavior, such as disabling collision.
- Collision includes 32 channel responses, so copying it by hand is easy to get wrong.

**Large scenes**

- Consider 100 distinct meshes with tens to hundreds of instances each.
- Creating 100 ISM or HISM actors requires sorting thousands of objects by hand.
- Scene changes can require repeating the merge.

**Nested Level Instances**

- Breaking nested Level Instances by hand takes time.
- Breaking one level can reveal more nested instances that need the same operation.

These editing constraints apply to an instance array maintained directly in code. Other instanced objects can be edited in the editor. SimpleStaticMeshMerger previews groups based on their actual properties, lets you filter or exclude actors and then merges the selection. Check the result after merging.
