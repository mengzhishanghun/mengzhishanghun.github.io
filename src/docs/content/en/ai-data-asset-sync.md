---
title: Synchronize DataAssets and JSON
type: doc
slug: ai-data-asset-sync
draft: false
sitePublish: true
tags:
  - DataAsset
  - JSON
workIds:
  - ai-data-asset
documentKind: product-manual
websiteRoute: /en/works/ai-data-asset/docs/sync/
lang: en
translationKey: doc:ai-data-asset:sync
sourceHash: 4cb7af920812023b4c271c888abccb8a15d92d4394c2388722ee50e3ebf4ea2b
translationStatus: translated
generatedBodyHash: f7402d36251ed181be80275ad79afb72e84ff966fb5b259f142e969efa891b9c
docPage:
  work: ai-data-asset
  group: data
  slug: sync
  order: 1
---

Read and modify existing DataAssets through JSON, letting AI or other external tools process their data and automatically synchronize it back to UE. Supported data includes common basic types and most structs, including nested structs and properties in common containers such as TArray, TMap, and TSet.

DataAssets are stored as UE-serialized .uasset files and commonly hold skill tables, character attributes, loot tables, and AI behavior parameters. External AI tools cannot easily edit these fields directly. JSON provides a channel for modifying basic fields, nested structs, and containers without manually copying AI output into the editor. LLM-generated level configurations, reinforcement-learning balance adjustments, and batch edits by designers can use this channel; results still need checking and testing in UE.

See the [AIDataAsset work page](/en/works/ai-data-asset/) for its purpose and use cases.

## When Synchronization Runs

Synchronization follows editor and file state. At startup the plugin checks both files; while the editor is running it monitors asset and JSON changes.

**Choosing data at startup.** With automatic synchronization enabled, the plugin scans DataAssets after project asset scanning completes, performs initial synchronization with a progress display, and then monitors subsequent changes. The scan excludes assets under `/Engine/`, finishes initial synchronization, and then registers asset and directory monitoring for the running editor. It uses modification times of the asset and JSON files on disk:

| Asset and JSON state | Result |
| --- | --- |
| The UE asset exists but its JSON is missing | Export JSON from the existing asset |
| Both exist and the asset file is newer | Update JSON with asset contents |
| Both exist and the JSON file is newer | Import JSON into the existing asset and attempt to save automatically |
| Both files have the same modification time | Skip this synchronization pass |
| JSON exists but the corresponding UE asset does not | Do not create an asset. If scanning reaches orphan cleanup, attempt to delete the JSON. If no DataAssets are found, end the scan early without cleaning up orphan JSON |

If both sides have changed, modification times still determine the direction; the plugin does not merge their individual field changes. Back up important edits before synchronizing to avoid overwriting the older side.

**While the editor is running.**

- DataAsset property changes automatically export the corresponding JSON. Temporary changes during continuous interactions such as dragging a slider are skipped rather than exported individually.
- Adding a DataAsset generates its JSON. Renaming an asset attempts to remove JSON at the old path, then exports to the new path. Reloading an asset and finishing reference updates also triggers export.
- When AI adds or modifies JSON corresponding to an existing asset, its properties are imported into that asset. The plugin first finds the existing DataAsset by the JSON path. If the asset cannot be found or loaded, it neither imports the file nor creates an asset.
- Import or export is skipped when the generated JSON text exactly matches the existing contents, avoiding unnecessary writes. The plugin also avoids repeatedly treating its own file writes as external edits.

**Deletion and recovery.** Startup cleanup identifies orphan JSON using the asset paths collected in that scan. If no DataAssets are found, scanning returns early without cleanup. Deleting a UE asset attempts to delete its JSON. Deleting only JSON does not delete the asset or immediately regenerate JSON. If automatic synchronization is enabled and the asset still exists and can be loaded, the next editor startup exports JSON from it again. Another edit to that asset may regenerate JSON earlier.

**Importing and saving.** Import updates the DataAsset in the editor, supports undo and redo, and notifies the editor that properties have changed. When version control is enabled, the plugin attempts to check out the asset before saving it to disk. Failed saves produce a warning and leave the asset marked for saving. Resolve write-access or save problems first, then inspect the asset on disk; values shown in the editor alone do not establish that saving succeeded.

## Import Results and Save Failures

Version-controlled `.uasset` files may be read-only. If Perforce, Git, or SVN is enabled, the plugin attempts checkout through the active provider.

The current implementation first calls `Modify()` in an undo transaction, writes JSON data into the in-memory asset, and calls `PostEditChange()`. It then checks whether `ISourceControlModule` is enabled, attempts Checkout through the current provider when enabled, and calls `UPackage::Save`.

The Checkout result is not checked here. Only a successful save means the asset on disk has been updated. A failed save marks the package for saving and logs a warning; in-memory property changes alone do not establish persistence.

## Repeated Notifications and Identical Content

The plugin uses `bIsSyncing` to skip asset callbacks during synchronization. It also tracks paths it writes in `PendingSelfChanges` so a delayed directory notification does not treat an export as an outside edit. Import and export both skip identical JSON text. A change in whitespace or field order can still trigger synchronization.

`OnObjectPropertyChanged` skips `Interactive` events. Reloaded assets are exported after reference updates at `PostPackageFixup`. The directory watcher attempts import only for new or modified `.json` files.

## Shutdown and Undo

Import uses `FScopedTransaction` for undo and redo. Plugin shutdown unregisters `IDirectoryWatcher` and asset/property callbacks so listeners cannot continue referencing a destroyed synchronization manager.

## JSON Property Conversion

DataAssets and external tools need a format they can both process. CSV, XML, and YAML are alternatives; I chose JSON because:

- Nearly all programming languages and AI frameworks support it natively.
- It is human-readable and convenient for debugging.
- Text diffs let reviewers compare individual field changes.
- Its flexible structure represents common nested UE data.

UE's built-in `FJsonObjectConverter` provides two main conversion functions:

- **UStructToJsonObject** serializes a UStruct, including a DataAsset's UPROPERTY fields, into FJsonObject.
- **JsonObjectToUStruct** performs the reverse conversion.

It handles most UPROPERTY types: basic values, FString, FName, enums, nested UStructs, TArray, TMap, TSet, and soft references such as FSoftObjectPath. Check specific property types and soft references against the engine version and asset definition.

For manual, one-way exchange, an editor button is sufficient: export JSON, let an AI tool edit it, then import it manually. Continuous monitoring is only needed for automatic synchronization in both directions.

## Floating-Point Output and Property Names

Output formatting affects readability and round-trip results. The implementation notes used an editor value of `0.3` exporting as `0.30000000000000004` as an example relevant to damage multipliers, probability weights, and physics parameters. Such decimal representations can also arise from binary floating point itself; this example does not establish that all UE JSON conversions lose precision.

The implementation chose a custom JSON PrintPolicy: `%.9f` for float (nine decimal places) and `%.17g` for double (17 significant digits for IEEE 754 double precision). The original notes aimed for identical DataAsset → JSON → DataAsset results, but fixed decimal places are not significant digits. These format strings alone cannot guarantee lossless round trips for floats of every magnitude. Check field types, serialization paths, and acceptable error.

`FJsonObjectConverter` lowercases the first letter of property names when serializing: `MaxHealth` becomes `maxHealth`. This mismatch can confuse AI tools, and a field written using the editor's capitalization may fail to match during deserialization.

The solution recursively restores uppercase initials after export and applies the reverse conversion before import. Check abbreviations, nested structures, and name collisions against the actual fields; initial-letter conversion cannot be assumed reversible for every asset.
