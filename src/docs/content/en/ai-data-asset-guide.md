---
title: AIDataAsset User Manual
description: Complete English product manual for AIDataAsset
type: doc
slug: ai-data-asset-guide
categoryId: ue-plugins
categoryName: UE Plugins
categoryOrder: 0
draft: false
sitePublish: true
tags:
  - DataAsset
  - JSON
workIds:
  - ai-data-asset
documentKind: product-manual
websiteRoute: /docs/zh/guides/ue-tools/ai-data-asset-guide/
lang: en
translationKey: ai-data-asset-guide
sourceHash: 1b1733efbc4bdcfc88146bee061da98ce390234d4d0f7caf6b64ed9fa47466db
translationStatus: translated
generatedBodyHash: 4820c4ad829f529823bea77a8d6bda1d6e79b651a66519c2744cb293474a0b24
---

# AI DataAsset

Read and modify existing DataAssets through JSON, letting AI or other external tools process their data and automatically synchronize it back to UE. Supported data includes common basic types and most structs, including nested structs and properties in common containers such as TArray, TMap, and TSet.

## Features

- **Two-way synchronization**: DataAsset property changes are automatically exported to JSON; JSON changes are automatically imported back into DataAsset
- **Initial synchronization**: With automatic synchronization enabled, editor startup chooses a direction using asset and JSON file modification times; equal times are skipped
- **Orphan cleanup**: Attempts to remove JSON without a corresponding DataAsset when startup scanning reaches cleanup; cleanup is skipped if no DataAssets are found
- **Version control integration**: When version control is enabled, attempts to check out files through the configured Perforce/Git/SVN provider before saving
- **Loop prevention**: Avoids repeated import/export triggered by the plugin’s own synchronization results
- **High-precision output**: JSON export uses full-precision floating-point values
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

**Choosing data at startup.** With automatic synchronization enabled, the plugin scans DataAssets after project asset scanning completes, performs initial synchronization with a progress display, and then monitors subsequent changes. It uses modification times of the asset and JSON files on disk:

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

**Deletion and recovery.** Deleting a UE asset attempts to delete its JSON. Deleting only JSON does not delete the asset or immediately regenerate JSON. If automatic synchronization is enabled and the asset still exists and can be loaded, the next editor startup exports JSON from it again. Another edit to that asset may regenerate JSON earlier.

**Importing and saving.** Import updates the DataAsset in the editor, supports undo and redo, and notifies the editor that properties have changed. When version control is enabled, the plugin attempts to check out the asset before saving it to disk. Failed saves produce a warning and leave the asset marked for saving. Resolve write-access or save problems first, then inspect the asset on disk; values shown in the editor alone do not establish that saving succeeded.

## AI Integration

First create the required DataAsset in UE and let the plugin generate its JSON, then tell the AI where the file is and what to change.

### JSON File Location

JSON files are stored in the project's `Saved/AIDataAsset/` directory (configurable). Paths correspond directly to the Content Browser structure:

| Asset path in UE | JSON file path |
|-------------------|--------------|
| `/Game/DA_Demo` | `Saved/AIDataAsset/Content/DA_Demo.json` |
| `/Game/Data/Characters/DA_Warrior` | `Saved/AIDataAsset/Content/Data/Characters/DA_Warrior.json` |

### JSON Format

Consider the `CharacterStatsData` DataAsset in the editor:

![](/media-occurrence/doc%3Aai-data-asset-guide%3Amedia%3A1)

The plugin automatically exports the following JSON:

![](/media-occurrence/doc%3Aai-data-asset-guide%3Amedia%3A2)

```json
{
    "DisplayName": "",
    "MaxHealth": 100,
    "AttackDamage": 10,
    "MoveSpeed": 600,
    "CritRate": 0.15000000596046448,
    "NativeClass": "/Script/CoreUObject.Class'/Script/UEPluginDev.CharacterStatsData'"
}
```

> **Note**: Field names match the UE editor display (for example, `MaxHealth` rather than `maxHealth`). Floating-point values use full precision to avoid data loss during round trips.

### AI Workflow Example

1. **Tell the AI where the data files are**:

   ```
   Game character data is in:
   D:/MyProject/Saved/AIDataAsset/Content/

   Read DA_Demo.json, increase MaxHealth by 20%, reduce CritRate to 0.1,
   then save the file.
   ```

2. **The AI reads JSON, modifies values, and writes the file back**:

   ```json
   {
       "DisplayName": "",
       "MaxHealth": 120,
       "AttackDamage": 10,
       "MoveSpeed": 600,
       "CritRate": 0.10000000149011612,
       "NativeClass": "/Script/CoreUObject.Class'/Script/UEPluginDev.CharacterStatsData'"
   }
   ```

3. **The plugin detects the change and imports it into the existing DataAsset**: Keep the UE editor running with automatic synchronization enabled, then save JSON to see changes in the editor. The plugin next attempts checkout and asset saving. If a save warning appears, follow the log to resolve it.

### Recommendations

- Keep the UE editor running with automatic synchronization enabled while editing JSON. Monitoring does not run while the editor is closed; edits made then are handled at the next startup under the rules above.
- Create the UE asset first, then edit its JSON. Creating JSON alone does not create a DataAsset, and orphan JSON may be removed during startup cleanup.
- Preserve the exported JSON structure, including the sample’s `NativeClass` field. It describes exported type information. Current import finds an existing asset by the JSON path rather than using this field to create one. Changing it cannot make the plugin generate a new asset type.
- Invalid JSON or asset field-structure changes may cause import to fail. Check logs and actual asset contents after editing, and test in UE. Synchronization does not replace game-rule validation.

**Common situations.** If JSON is not updating, check that automatic synchronization is enabled, the editor is running, and the path corresponds to an existing asset. If asset values changed but a save warning appeared, check file write access and version-control checkout status before saving. JSON not regenerating immediately after deletion follows the deletion rules above; it does not mean the UE asset was deleted.

## Supported Engine Versions

- Unreal Engine 5.2–5.8

## Version History



Open **Edit → Project Settings**, go to the AI DataAsset settings page, and set **Language** to **English** or **Chinese**. English is the default. User-facing interfaces, prompts, notifications, and functional logs update immediately without restarting the editor; public API names and module startup/shutdown logs always remain in English.

## Contact

For usage questions or collaboration inquiries, visit the contact page.

- **Contact:** [Contact and Collaboration](https://mzsh.me/contact/)
