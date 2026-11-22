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
sourceHash: 69132a8e03ef8a9709e0e5c1a6a6be4ab889cfaad9fe149b1556c0aa8cfb2b0d
translationStatus: translated
generatedBodyHash: 05463e1c0ec818a5d410d4a10bfde4d9ec12e15b5ad8522a97818247c03a0bd9
docPage:
  work: simple-static-mesh-merger
  group: workflows
  slug: merge-actors
  order: 1
---

This guide provides detailed instructions on how to use the SimpleStaticMeshMerger plugin to merge static mesh instances in Unreal Engine and optimize scene performance.

## Compatibility

- Unreal Engine 5.2–5.8
- Version 1.1.0 (Version 2)

---

## 🛠️ Opening the Tool Window

After enabling the plugin, find the tool entry in the editor menu:

### Steps:

1. Open Unreal Engine Editor
2. Click top menu `Window > Static Mesh Merger`
3. The tool window will open as a dockable panel

---

## 🎨 Interface Overview

The tool window consists of three main areas:

### 1. Toolbar (Top)

- **Break Level Instances**: Recursively breaks all LevelInstances in the scene (including nested ones)
- **Refresh**: Manually refresh the merge preview
- **Type Dropdown**: Select merge type (HISM or ISM, default HISM)
- **Merge Selected**: Execute merge operation on selected groups

### 2. Configuration Options (Below Toolbar)

#### Mobility Filter (Filter)
- ☑ **Static**: Include static objects
- ☑ **Stationary**: Include stationary objects
- ☐ **Movable**: Include movable objects
- Default: Static + Stationary checked

#### Min Instance Count
- Range: 0 - 1000
- Default: 2 (only show groups with at least 2 instances, at least 2 checkable instances required for merge)
- Purpose: Filter out groups with too few instances where optimization benefits are minimal

### 3. Dual-Panel Layout

#### Left Panel: Merge Groups Preview
Displays all qualifying merge groups, each containing:
- ☑ **Checkbox**: Select groups to participate in merge
- **Group Name**: Uses the first non-excluded instance's name (dynamically updated)
- **Instance Details**: Shows "Instance Count • Type • Mobility" (e.g., `5 Instances • HISM • Static`)

Top features:
- **Search Box**: Fuzzy search by instance name (tokenized + sequential matching)
- **Select All**: Batch check/uncheck currently displayed groups

#### Right Panel: Included Actors
Displays all instances in the selected left panel group:
- ☑ **Checkbox**: Check to include in merge, uncheck to exclude instance
- **Actor Name**: Instance label in the scene
- **[⊙] Locate Button**: Click to jump to the Actor in scene and select in Outliner

Top features:
- **Toggle All**: Batch check/uncheck all instances

---

## 🔍 Search Functionality

### Search Rules

Supports **tokenized fuzzy search** where keywords must appear in order:

**Example**: Search `SM 02`
- ✅ Match: `SM_Rock_02` ("SM" before "02")
- ✅ Match: `SM_000002` ("SM" before "02")
- ❌ No match: `02_SM_Rock` (wrong order)
- ❌ No match: `Rock_02` (missing "SM")

### Search Behavior

- **Display Only**: Doesn't modify data, clearing search box restores all groups
- **Group-Level Filter**: If any instance in a group matches, the entire group is shown (with all instances)
- **Merge Limitation**: Only merges currently displayed and checked groups

---

## ⚙️ Grouping Rules

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

---

## 🚀 Usage Workflow

### Basic Merge Workflow

1. **Open Tool**: `Window > Static Mesh Merger`
2. **(Optional) Break LevelInstances**: Click `Break Level Instances` button
3. **Configure Filter**:
   - Check desired mobility types
   - Set min instance count threshold
4. **View Preview**: Left panel displays all merge groups
5. **(Optional) Filter with Search**: Enter keywords in search box
6. **Check Groups**:
   - Click `Select All` to batch check
   - Or manually check groups to merge
7. **(Optional) Exclude Instances**:
   - Click group in left panel to view instance list on right
   - Uncheck instances you don't want to merge
8. **Execute Merge**: Click `Merge Selected` button
9. **View Results**: After merge completes, automatically selects newly created ISM/HISM Actors

### Advanced Tips

#### Precisely Control Merge Objects
1. Use search box to narrow scope (e.g., search `Tree` to only show tree-related groups)
2. Uncheck unwanted groups
3. Enter right panel to exclude individual instances
4. Click merge to only process currently displayed and checked groups

#### Locate Scene Objects
- Click `[⊙]` button in right instance list
- Editor viewport jumps to that Actor
- Outliner synchronizes selection

#### Auto Uncheck
When excluding instances causes checkable count < min instance count, the group automatically unchecks

---

## 📊 Instance Count Rules

### Display Rule
- Total Actor count >= Min instance count

### Checkable Rule
- Checkable Actor count >= Min instance count

### Merge Execution
- Actual participating Actor count >= Min instance count

**Example** (Min instance count = 2):
- Group has 5 instances
- Uncheck 3 instances
- 2 checkable instances remain
- **Can merge** (2 >= 2)

---

## ✅ Notes

### Merge Rules
- Only merges Actors in **main scene (PersistentLevel)**
- Does not include Actors inside LevelInstances (must break first)
- All properties must be identical to be grouped together

### Collision Preservation
- Completely copies collision profiles
- Accurately copies object type and all 32 channel responses
- Collision behavior after merge is identical to original Actors

### Min Instance Count
- Default 2: At least 2 instances required to merge
- Filters out groups with too few instances (minimal optimization benefit)
- Can adjust as needed (range 0-1000)

### Scene Monitoring
- Auto-monitors Actor additions/deletions (refreshes after 500ms delay)
- Map switches clear list (requires manual Refresh click)

### State Caching Mechanism
- **Excluded List Persistence**: Unchecked instances are recorded in the exclusion list
- **State Maintained on Refresh**: Clicking Refresh button or auto-refresh on scene changes **preserves** exclusion state
- **Window-Level Lifecycle**: All instances reset to default checked state only when closing and reopening the window
- **Use Case**: Can gradually adjust excluded instances, refresh multiple times to verify results without repeating operations

### After Merge
- Automatically selects all newly created ISM/HISM Actors
- Viewport jumps to first newly created Actor
- Original Actors are destroyed

---

## 🎯 Performance Optimization Tips

### Merge Strategy

1. **Prioritize Large Duplicates**: More instances = better optimization
2. **Batch Merge**: Use search to merge by category (e.g., merge trees first, then rocks)
3. **Preserve Necessary Grouping**: Don't merge objects that need individual control

### HISM vs ISM

- **HISM** (Default Recommended):
  - Supports LOD
  - Supports occlusion culling
  - Better performance for large-scale instances

- **ISM**:
  - Simpler and lighter
  - Lower overhead for small-scale instances

---

## Version History


Open **Edit → Project Settings**, select the SimpleStaticMeshMerger settings page, and set **Language** to **English** or **Chinese**. English is the default. Available user-facing UI, tooltips, notifications, and functional logs update immediately without restarting the editor. Public API names and module startup/shutdown logs remain in English.

## Support

For usage questions or collaboration, please visit the contact page.

- **Contact:** [Contact and collaboration](https://mzsh.me/contact/)

## SimpleStaticMeshMerger User Guide

Preview StaticMeshActor groups in the tool window, filter the objects to merge, then generate instanced meshes.

## Loading cost of separate actors and instanced components

When a large scene loads, serializing many separate StaticMeshActors, initializing their components and registering them in the scene can take time. The tree example compares two ways to organize repeated meshes.

### 1.1 Load separate actors

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

### 1.2 Load ISM or HISM instances

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

**Work during loading**

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

## Merge manually and preserve actor properties

### Create the instances and transfer properties

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

Instancing can reduce the number of separate actors and components. The reduction does not translate into the same percentage improvement in performance. Measure loading time, memory and frame rate in the target scene.

- Keep a version of the scene you can restore, since the merge replaces the original actors.
- Check the mesh, materials, mobility and collision settings for each group.
- After merging, check the instance count and inspect the scene.
- Measure loading time, memory use and frame rate in the target project.

---

Originally published on 2025-11-09 on [Cnblogs](https://www.cnblogs.com/mengzhishanghun/p/19204715).
