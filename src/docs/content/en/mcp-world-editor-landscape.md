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
sourceHash: ad4615c3df1c9cde1458c2a25d4e7484267d41a8f68380bad3bbf9d9437c6a7d
translationStatus: translated
generatedBodyHash: 3e8f104546574e965d74ed4e4070c228ccfcf6518613124ed2fafc979f212f73
docPage:
  work: mcp-world-editor
  group: features
  slug: landscape
  order: 16
---

## Sampling bounds and write preflight

`GetLandscapeHeightData` and `SetLandscapeHeightData` exchange row-major `uint16` height samples directly in JSON; they never probe or read caller-selected files. Regions use inclusive Landscape vertex coordinates and are limited to 65,536 samples per call. The target must be the main `ALandscape` actor, and the complete region must be loaded and owned by that actor. UE 5.8 and newer require an exact GUID for a standard `EditLayerGuid`; procedural and spline layers are rejected, and `SetLandscapeHeightData` also rejects locked layers while the read tool may inspect them. UE 5.2-5.7 reject landscapes that contain Edit Layers because those versions need a separate layer-aware contract.

`SetLandscapeHeightData` defaults to `bDryRun=true`. Preflight returns `CurrentDataHash` and `ProposedDataHash` without changing editor state. Applying requires `bDryRun=false`, the exact fresh `ExpectedCurrentDataHash`, and the matching `ExpectedProposedDataHash`; stale state or changed proposed samples are rejected before the transaction. A write is read back and verified. If verification fails, the original samples are restored and verified before the transaction is cancelled; an unverified rollback is reported as potentially state-changing. Rollback covers the region written by one call. If you import a whole landscape across several calls, those regions cannot be rolled back together. Neither tool saves the level or assets.

Read the target region first and check its endpoints and sample order. Then prepare the complete row-major samples for that region. Preview again if you change the proposed samples or another edit changes the region. Confirm the scope of this call before applying it, since later batches have separate rollback boundaries.
