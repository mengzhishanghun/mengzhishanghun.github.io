---
title: AIDataAsset
description: Let AI modify complex DataAsset data through JSON and synchronize it to UE in real time, with support for basic types and most structs.
type: work
slug: ai-data-asset
categoryId: ue-plugins
categoryName: UE plugins
categoryOrder: 0
order: 14
status: Official documentation
featured: false
draft: false
sitePublish: false
tags:
  - DataAsset
  - JSON
  - AI series
sourcePlatform: CNBlogs
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/20159718
links:
  - label: Original article on CNBlogs
    href: https://www.cnblogs.com/mengzhishanghun/p/20159718
sourceDate: 2026-05-25
lang: en
translationKey: ai-data-asset
sourceHash: 0022bb205c5f93364b301db0bae9093ed57479bd77e1ab811fa91af75e6372f7
translationStatus: translated
generatedBodyHash: e12315e0f900afbf193dde632d2bb2f1f5070e8e8c9220c5ec66c4e596b121a9
workInfo:
  channels:
    - kind: sale
      href: https://www.fab.com/listings/e6c92c8b-6e87-4f2f-9975-1c0d85621c60
    - kind: docs
      href: /en/works/ai-data-asset/docs/setup/
websiteCoverUrl: /media/covers/works/ai-data-asset-20261101.webp
coverAlt: AIDataAsset cover
docIds:
  - ai-data-asset-setup
  - ai-data-asset-sync
  - ai-data-asset-ai-edit
---

## Overview

AIDataAsset lets AI read and modify complex DataAsset data through JSON and automatically synchronizes changes back to assets while the UE editor is running. With automatic synchronization enabled, the plugin handles export, file monitoring, and writing changes back, without requiring manual import and export each time.

The plugin supports common primitive types and most structs. Letting AI edit fields in batches or update nested settings saves you from opening and filling in each field in the editor.

## Background and goals

DataAssets are stored in UE asset format, making their fields difficult for AI tools to read and modify directly. Manually transferring AI-generated results creates repetitive work when there are many fields or frequent updates.

AIDataAsset uses JSON to connect external tools with UE assets, allowing AI to handle data modifications while inspection and testing remain in the game project.

## Core capabilities

### DataAsset and JSON round trips

Export properties from existing DataAssets to JSON, then synchronize external edits back to the assets. Field names correspond to those shown in the editor, and floating-point output is formatted by field type. Check round-trip values against your acceptable tolerance.

### Change monitoring and synchronization control

While the editor is running, the plugin automatically monitors asset and JSON changes and prevents repeated triggers between the two synchronization directions. At startup, it also checks files on both sides and chooses a synchronization direction based on modification times.

### Safeguards for editor changes

Imports support undo and redo, with version control checkout and asset saving used to handle modifications. Save failures produce warnings and still require attention in the editor; an in-memory update must not be treated as saved.

## Use cases

When generating level configurations, adjusting character values in batches, or modifying nested structs, AI can read and edit JSON before the results are inspected and tested in UE. LLMs, reinforcement learning systems, and external tools such as Python can all participate in this data workflow.

Designers can also process data centrally with tools such as Excel. For team review, JSON can be output to a directory suitable for version control so field changes can be reviewed as text diffs. The default Saved output directory usually serves only as an intermediate synchronization directory.

## How to use it

For a character DataAsset called `DA_Demo`, you can raise `MaxHealth` from 100 to 120 and set `CritRate` to 0.1.

1. Create the DataAsset in UE and enable automatic synchronization so the plugin generates the matching JSON. The default output directory is `Saved/AIDataAsset/`.
2. Give the AI the file path and the fields to change. Keep the existing JSON structure, including `NativeClass`, and edit only the values you need to adjust.
3. Keep the editor running. After saving the JSON, check the values in the existing asset. If the log reports a save failure, resolve checkout or write access and then save the asset.

![](/media-occurrence/work%3Aai-data-asset%3Amedia%3A1)

![](/media-occurrence/work%3Aai-data-asset%3Amedia%3A2)

See [editing asset data with AI](/en/works/ai-data-asset/docs/ai-edit/) for the full example.

## Scope and limitations

JSON modifies existing DataAssets in UE; adding a JSON file alone does not create a new asset. Automatic monitoring works only while the editor is running and automatic synchronization is enabled.

Startup synchronization chooses its direction by file modification times and does not merge fields edited independently on both sides. Assets must be writable; invalid JSON or changes to field structures may cause imports to fail. Successful synchronization does not mean the data follows game rules, so it still requires validation in the project.

See [Install and Configure Synchronization](/en/works/ai-data-asset/docs/setup/) for installation and output settings, and [Synchronize DataAssets and JSON](/en/works/ai-data-asset/docs/sync/) for startup rules and deletion behavior.


## Technical Details

See the [user manual](/en/works/ai-data-asset/docs/sync/) for JSON selection, conversion APIs, numeric formatting, and asynchronous synchronization.

## Compatibility

- Unreal Engine 5.2–5.8

## Contact and Support

For usage questions or collaboration inquiries, visit the contact page.

- **Contact:** [Contact and Collaboration](https://mzsh.me/contact/)
