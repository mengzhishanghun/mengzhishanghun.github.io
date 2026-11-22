---
title: Edit DataAssets with AI
type: doc
slug: ai-data-asset-ai-edit
draft: false
sitePublish: true
tags:
  - DataAsset
  - JSON
workIds:
  - ai-data-asset
documentKind: product-manual
websiteRoute: /en/works/ai-data-asset/docs/ai-edit/
lang: en
translationKey: doc:ai-data-asset:ai-edit
sourceHash: 8fb9509afe40b2837215e320b9c0972c9a4aa13ad89f4fd5ff544e4378aaae65
translationStatus: translated
generatedBodyHash: 5571b26901cb3f26c5ac64dc14a33f0e4c12051ea3cf2607c1f34c0524cfccd2
docPage:
  work: ai-data-asset
  group: workflows
  slug: ai-edit
  order: 2
---

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

![](/media-occurrence/doc%3Aai-data-asset%3Aai-edit%3Amedia%3A1)

The plugin automatically exports the following JSON:

![](/media-occurrence/doc%3Aai-data-asset%3Aai-edit%3Amedia%3A2)

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

> **Note**: Field names match the UE editor display (for example, `MaxHealth` rather than `maxHealth`). The fixed decimal places in float’s `%.9f` cannot guarantee exact round trips across its full range; double uses `%.17g`. Check actual fields and acceptable error after editing.

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
