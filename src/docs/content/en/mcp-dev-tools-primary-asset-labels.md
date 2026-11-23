---
title: Create and Edit Primary Asset Labels
type: doc
slug: mcp-dev-tools-primary-asset-labels
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-dev-tools
documentKind: product-manual
websiteRoute: /en/works/mcp-dev-tools/docs/primary-asset-labels/
lang: en
translationKey: doc:mcp-dev-tools:primary-asset-labels
sourceHash: 75958bc3663250cbef1579584754d2532013e42842608032f6694ac01348ba27
translationStatus: translated
generatedBodyHash: 84c20b8001cd2bedb13b93d2c6059e780d7fd9d0c4822c210f30cf9f4d49a392
docPage:
  work: mcp-dev-tools
  group: features
  slug: primary-asset-labels
  order: 3
---

## Read and write

| Type | Tools | Purpose and main parameters |
|---|---|---|
| PrimaryAssetLabel | `GetPrimaryAssetLabel`, `CreatePrimaryAssetLabel`, `SetPrimaryAssetLabel` | Read native labels, create labels, or change editable fields with `Properties` and `ExpectedValues`. Derived bundle data is read-only. |

Before editing an existing label, read its fields. Put the values you want to change in `Properties` and supply the corresponding `ExpectedValues`. Apply after the preview passes, then read the label again. The rules you read back confirm the current asset settings only. Cook results, actual Chunk output, and behavior with non-empty ExplicitBlueprints remain unconfirmed.

Preview changes before applying them, then save separately. See the [preview and save workflow](/en/works/mcp-dev-tools/docs/connect/).
