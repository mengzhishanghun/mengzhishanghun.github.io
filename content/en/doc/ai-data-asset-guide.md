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
sourceHash: bac7c5c17951d508349e277004b51c7f3c276541e554f0497472bccedb75af69
translationStatus: translated
generatedBodyHash: ffa8b4895ed3d440fb90b9d09dcbed8558b17f6dd0cac07617468ec51872fc46
---

# AI DataAsset

DataAsset and JSON files are automatically bound for two-way synchronization, allowing AI to modify DataAsset directly.

## Features

- **Two-way synchronization**: DataAsset property changes are automatically exported to JSON; JSON changes are automatically imported back into DataAsset
- **Initial synchronization**: On editor startup, timestamps are compared and the latest version is synchronized
- **Orphan cleanup**: Automatically deletes JSON files whose corresponding DataAsset no longer exists
- **Version control integration**: Automatically checks out files through Perforce/Git/SVN before saving
- **Loop prevention**: Built-in protection prevents infinite synchronization loops
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

## How It Works

1. When DataAsset properties change in the editor, the plugin automatically exports a JSON file
2. When an external tool, such as an AI tool, changes the JSON file, the plugin automatically imports the changes into DataAsset
3. On startup, the plugin performs initial synchronization using file timestamps

## AI Integration

This plugin is designed for AI workflows. The following explains how to connect AI tools to DataAsset.

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

3. **The plugin detects the file change and automatically imports it into DataAsset** — no manual action is needed. Changes appear immediately in the UE editor.

### Recommendations

- Keep the UE editor running while AI modifies JSON files — file monitoring is active only in the editor
- Do not delete or rename the `NativeClass` field — it is required for deserialization
- AI can create new JSON files using the same path rules — the plugin automatically creates corresponding DataAssets on the next editor startup

## Supported Engine Versions

- Unreal Engine 5.2–5.8

## Version History

See [CHANGELOG.md](../CHANGELOG.md).


Open **Edit → Project Settings**, go to the AI DataAsset settings page, and set **Language** to **English** or **Chinese**. English is the default. User-facing interfaces, prompts, notifications, and functional logs update immediately without restarting the editor; public API names and module startup/shutdown logs always remain in English.

## Contact

For usage questions or collaboration inquiries, visit the contact page.

- **Contact:** [Contact and Collaboration](https://mzsh.me/contact/)
