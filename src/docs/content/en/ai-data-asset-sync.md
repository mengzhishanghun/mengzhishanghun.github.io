---
title: Sync DataAssets and JSON
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
sourceHash: c75171d208f86239c5b7479fe22086d5c4b837453e65146ca4eae0c393c42c4a
translationStatus: translated
generatedBodyHash: 25e1444c1b944d6d465c2acaa8d3f84347e2f300a652eefa6032d46f7ac6f6a4
docPage:
  work: ai-data-asset
  group: workflows
  slug: sync
  order: 1
---

Read and modify existing DataAssets through JSON, letting AI or other external tools process their data and automatically synchronize it back to UE. Supported data includes common basic types and most structs, including nested structs and properties in common containers such as TArray, TMap, and TSet.

DataAssets are stored as UE-serialized .uasset files and commonly hold skill tables, character attributes, loot tables, and AI behavior parameters. External AI tools cannot easily edit these fields directly. JSON provides a channel for modifying basic fields, nested structs, and containers without manually copying AI output into the editor. LLM-generated level configurations, reinforcement-learning balance adjustments, and batch edits by designers can use this channel; results still need checking and testing in UE.

See the [AIDataAsset work page](/en/works/ai-data-asset/) for its purpose and use cases.

## Features

- **Two-way synchronization**: DataAsset property changes are automatically exported to JSON; JSON changes are automatically imported back into DataAsset
- **Initial synchronization**: With automatic synchronization enabled, editor startup chooses a direction using asset and JSON file modification times; equal times are skipped
- **Orphan cleanup**: Attempts to remove JSON without a corresponding DataAsset when startup scanning reaches cleanup; cleanup is skipped if no DataAssets are found
- **Version control integration**: When version control is enabled, attempts to check out files through the configured Perforce/Git/SVN provider before saving
- **Loop prevention**: Avoids repeated import/export triggered by the plugin’s own synchronization results
- **Floating-point output**: The historical implementation uses `%.9f` for float and `%.17g` for double; round-trip precision must be checked against the actual numeric range and serialization path
- **Property name restoration**: JSON field names match the editor display instead of UE's internal camelCase form
- **Smart writes**: Writes files only when content actually changes, avoiding meaningless changes in version control

## Installation

1. Copy the `AIDataAsset` folder into your project's `Plugins/` directory
2. Restart the Unreal Editor
3. If it is not enabled automatically, enable it under Edit > Plugins

## Configuration

Open **Project Settings > Plugins > AIDataAsset**:

| Setting | Default | Description |
|--------|--------|------|
| JSON Output Directory | `Saved/AIDataAsset` | JSON storage directory, relative to the project root |
| Enable Auto Sync | `true` | Enable/disable automatic synchronization |

**Output directory and version control.** The default `Saved/AIDataAsset/` directory holds intermediate synchronization files and normally should not be tracked in version control. Runtime data remains in UE assets. To track JSON, change `JSON Output Directory` here to a directory within the project that should be tracked, then add the generated JSON files to version control. An AI tool can help edit this setting; check the actual output location afterward.

## How It Works

### JSON as an Intermediate Format and Property Conversion

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

### Floating-Point Output and Property Names

Output formatting affects readability and round-trip results. The implementation notes used an editor value of `0.3` exporting as `0.30000000000000004` as an example relevant to damage multipliers, probability weights, and physics parameters. Such decimal representations can also arise from binary floating point itself; this example does not establish that all UE JSON conversions lose precision.

The implementation chose a custom JSON PrintPolicy: `%.9f` for float (nine decimal places) and `%.17g` for double (17 significant digits for IEEE 754 double precision). The original notes aimed for identical DataAsset → JSON → DataAsset results, but fixed decimal places are not significant digits. These format strings alone cannot guarantee lossless round trips for floats of every magnitude. Check field types, serialization paths, and acceptable error.

`FJsonObjectConverter` lowercases the first letter of property names when serializing: `MaxHealth` becomes `maxHealth`. This mismatch can confuse AI tools, and a field written using the editor's capitalization may fail to match during deserialization.

The solution recursively restores uppercase initials after export and applies the reverse conversion before import. Check abbreviations, nested structures, and name collisions against the actual fields; initial-letter conversion cannot be assumed reversible for every asset.

### Startup Synchronization and Deletion Rules

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

### Preventing Synchronization Loops

Two-way synchronization can repeatedly follow this path:

1. The user edits a DataAsset in the editor.
2. Monitoring exports the change to JSON.
3. The file system reports a JSON change.
4. Monitoring imports it into the DataAsset.
5. The cycle returns to step 2.

The implementation uses two layers of protection:

- **Synchronization flag `bIsSyncing`**: Set during startup synchronization and directory-change handling. Property, add, delete, rename, and package-reload callbacks return while synchronization is active, preventing another export during import.
- **Self-written path set `PendingSelfChanges`**: Records the normalized path after export writes a file. When directory monitoring receives that path's notification, it removes the marker and skips the notification.

File notifications can arrive after the flag resets, so path tracking is also needed. Export compares existing files with the generated JSON text; import compares the current asset's serialized text with the file. Identical strings are skipped. This is a text comparison, not a semantic JSON comparison that ignores whitespace or field order.

During editor operation, `OnObjectPropertyChanged` skips continuous `Interactive` events; other DataAsset property changes and asset additions export JSON. Renaming attempts to delete the old JSON path before exporting the new one. Package reload exports the updated asset during `PostPackageFixup`.

Directory monitoring attempts import only for added or modified `.json` files. It loads an existing DataAsset by path; a missing asset produces a warning and returns without creating an asset. Deleting JSON does not delete the asset.

### Asset Import, Checkout, and Saving

Version-controlled .uasset files, including those managed by Perforce, may be read-only, so asset saving also needs handling.

The current implementation first calls `Modify()` in an undo transaction, writes JSON data into the in-memory asset, and calls `PostEditChange()`. It then checks whether `ISourceControlModule` is enabled, attempts Checkout through the current provider when enabled, and calls `UPackage::Save`.

The Checkout result is not checked here. Only a successful save means the asset on disk has been updated. A failed save marks the package for saving and logs a warning; in-memory property changes alone do not establish persistence.

### Synchronization Manager Lifecycle

Import uses `FScopedTransaction` for undo and redo. Plugin shutdown unregisters `IDirectoryWatcher` and asset/property callbacks so listeners cannot continue referencing a destroyed synchronization manager.

## Supported Engine Versions

- Unreal Engine 5.2–5.8

## Version History



Open **Edit → Project Settings**, go to the AI DataAsset settings page, and set **Language** to **English** or **Chinese**. English is the default. User-facing interfaces, prompts, notifications, and functional logs update immediately without restarting the editor; public API names and module startup/shutdown logs always remain in English.

## Technical Source

The two-way synchronization implementation notes were published on [CNBlogs](https://www.cnblogs.com/mengzhishanghun/p/20159718) on 2026-05-25.

## Contact

For usage questions or collaboration inquiries, visit the contact page.

- **Contact:** [Contact and Collaboration](https://mzsh.me/contact/)
