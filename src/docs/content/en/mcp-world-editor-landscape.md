---
title: Read and Edit Landscape Heights
type: doc
slug: mcp-world-editor-landscape
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-world-editor
documentKind: product-manual
websiteRoute: /en/works/mcp-world-editor/docs/landscape/
lang: en
translationKey: doc:mcp-world-editor:landscape
sourceHash: 7c265e733b15645ab4314f55b6eaf0c10a1a462ca19fe2f308a5a702e2c8a3e6
translationStatus: translated
generatedBodyHash: d9e329eabd0407101c3f88956f4b8653b7c6628191f7db53c8342fc133133252
docPage:
  work: mcp-world-editor
  group: landscape
  slug: landscape
  order: 1
---

## Sampling bounds and write preflight

`GetLandscapeHeightData` and `SetLandscapeHeightData` exchange row-major `uint16` height samples directly in JSON; they never probe or read caller-selected files. Regions use inclusive Landscape vertex coordinates and are limited to 65,536 samples per call. The target must be the main `ALandscape` actor, and the complete region must be loaded and owned by that actor. UE 5.8 and newer require an exact GUID for a standard `EditLayerGuid`; procedural and spline layers are rejected, and `SetLandscapeHeightData` also rejects locked layers while the read tool may inspect them. UE 5.2-5.7 reject landscapes that contain Edit Layers because those versions need a separate layer-aware contract.

`SetLandscapeHeightData` defaults to `bDryRun=true`. Preflight returns `CurrentDataHash` and `ProposedDataHash` without changing editor state. Applying requires `bDryRun=false`, the exact fresh `ExpectedCurrentDataHash`, and the matching `ExpectedProposedDataHash`; stale state or changed proposed samples are rejected before the transaction. A write is read back and verified. If verification fails, the original samples are restored and verified before the transaction is cancelled; an unverified rollback is reported as potentially state-changing. The atomic boundary is one region call, not a multi-call whole-landscape import, and neither tool saves the level or assets.
