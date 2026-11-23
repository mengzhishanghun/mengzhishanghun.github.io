---
title: Create Montages and Edit Sections
type: doc
slug: mcp-animation-montage-and-blendspace
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-animation
documentKind: product-manual
websiteRoute: /en/works/mcp-animation/docs/montage-and-blendspace/
lang: en
translationKey: doc:mcp-animation:montage-and-blendspace
sourceHash: 23f4a3bd5641ba659be8be81febaefe6ceeac5197a9eae50395dbf05f951d593
translationStatus: translated
generatedBodyHash: 59f32b24b25b16853d5aa19d9b117c1408dabd6256cf57001db5a9d4ced7062a
docPage:
  work: mcp-animation
  group: features
  slug: montage-and-blendspace
  order: 3
---

## Find, create, and edit montages

| Tool | Purpose |
|---|---|
| `ListMontages` / `GetMontageDetail` | Discover Montages and read sections, slots, segments, notifies, and blend settings. |

| Tool | Purpose |
|---|---|
| `CreateMontage` | Create a Montage from an AnimSequence. |
| `AddMontageSection` / `SetMontageSection` / `RemoveMontageSection` | Manage Montage sections. |

For an existing Montage, get its path from the list and use the details to locate the section. To create one, find the source AnimSequence, then call `CreateMontage`. After adding, changing, or removing a section, read the details again to check that you edited the intended section.

For paths, transactions, and saving, see how to [open and save animation assets](/en/works/mcp-animation/docs/find-assets/).
