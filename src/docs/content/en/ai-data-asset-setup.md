---
title: Install and Configure Synchronization
type: doc
slug: ai-data-asset-setup
draft: false
sitePublish: true
tags:
  - DataAsset
  - JSON
workIds:
  - ai-data-asset
documentKind: product-manual
websiteRoute: /en/works/ai-data-asset/docs/setup/
lang: en
translationKey: doc:ai-data-asset:setup
sourceHash: 2b5888f9f34c905ee82c041f1e30af4a409493b08a4921655e8a3a0690d9b6a2
translationStatus: translated
generatedBodyHash: 102042bb98655125ddcefa736e815a04032a2c6b48310dcf87b857635d3e4867
docPage:
  work: ai-data-asset
  group: getting-started
  slug: setup
  order: 1
---

## Installation

1. Copy the `AIDataAsset` folder into your project's `Plugins/` directory
2. Restart the Unreal Editor
3. If it is not enabled automatically, enable it under Edit > Plugins

## Synchronization Settings

To check the setup, enable automatic synchronization and save a test DataAsset. Then look for its JSON in the configured output directory.

Open **Project Settings > Plugins > AIDataAsset**:

| Setting | Default | Description |
|--------|--------|------|
| JSON Output Directory | `Saved/AIDataAsset` | JSON storage directory, relative to the project root |
| Enable Auto Sync | `true` | Enable/disable automatic synchronization |

**Output directory and version control.** The default `Saved/AIDataAsset/` directory holds intermediate synchronization files and normally should not be tracked in version control. Runtime data remains in UE assets. To track JSON, change `JSON Output Directory` here to a directory within the project that should be tracked, then add the generated JSON files to version control. An AI tool can help edit this setting; check the actual output location afterward.

## Interface Language

Open **Edit → Project Settings**, go to the AI DataAsset settings page, and set **Language** to **English** or **Chinese**. English is the default. User-facing interfaces, prompts, notifications, and functional logs update immediately without restarting the editor; public API names and module startup/shutdown logs always remain in English.
