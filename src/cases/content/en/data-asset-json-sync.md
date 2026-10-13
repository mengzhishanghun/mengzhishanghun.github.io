---
title: Synchronizing DataAsset and JSON in Both Directions
description: Using JSON to connect external AI tools with DataAsset and address field conversion, repeated triggers, and writes in bidirectional synchronization.
type: case
slug: data-asset-json-sync
categoryId: ue-projects
categoryName: Unreal Engine Projects
categoryOrder: 0
order: 8
status: Completed
featured: false
draft: false
sitePublish: true
tags:
  - DataAsset
  - JSON
  - AI
coverAlt: Bidirectional synchronization and self-write filtering workflow between DataAsset, JSON, and external AI or scripts
websiteCoverUrl: /assets/cases/data-asset-json-sync.png
lang: en
translationKey: data-asset-json-sync
sourceHash: 5407cf6797c996e0df9170985b4f52722b4c12ea56dbd82772170b7a0dff7f32
translationStatus: translated
generatedBodyHash: 3ff5eca0470f96befe2767b354598ce42240da90b643ad11f1846ec3ea4059c8
---

## Background

To involve AI in game data iteration, I used JSON as an intermediate format between external tools and UE DataAsset. AI handles text data, and the editor synchronizes that data back into assets, reducing manual transfers field by field.

This case focuses on data exchange and synchronization. Whether AI-generated parameters are appropriate still needs to be tested, inspected, and reviewed in the project.

## Reproduction Environment

DataAsset is stored as .uasset files, which external tools cannot easily process directly. JSON is easier to generate, read, and compare as text. On the UE side, `FJsonObjectConverter` handles conversion between properties and JSON.

Synchronization covers asset changes in the editor and JSON changes on disk. Asset writes may also be affected by source control and read-only file states.

## Specific Problem

Manual, one-way import and export can provide basic exchange, but automatic bidirectional synchronization adds new concerns: field name conversion, floating-point representation, asynchronous file notifications, and writability can all affect the result.

In particular, after the editor exports JSON, a directory watcher may import the same change as an external modification, causing repeated triggers. If both sides change while the editor is closed, the synchronization direction also needs to be determined after startup.

## Solution

Starting with JSON conversion, field names and numeric output formats were handled separately rather than leaving property conversion entirely to default behavior. Specific fields still need to be checked against the asset type. For the field conversion and bidirectional synchronization implementation, [read the synchronization implementation details](https://mzsh.me/blog/cnblogs-20159718/).

A synchronization flag was used during synchronization, alongside tracking of file paths written by the system itself. Path tracking identifies file change notifications that arrive asynchronously, covering the timing gap that a synchronization flag alone cannot handle.

Before writing to DataAsset, the workflow checks whether source control is enabled and whether the asset is writable. It also accounts for content comparison, undo transactions, and the directory watcher's lifecycle to reduce unnecessary writes and retain the editor's processing boundaries.

The original approach used file modification times to help determine synchronization direction. This suits scenarios where usually only one side changes. When both sides change, timestamp comparison cannot replace field-level conflict assessment, and the choice of changes needs separate review.

## Final Summary

The work established a bidirectional synchronization approach that allows external AI or scripts to modify DataAsset data through JSON, recording the key stages that automation needs to handle.

Property conversion and numeric round trips need to be checked for each asset, and simultaneous changes on both sides require conflict review. After synchronization, the asset content and actual runtime results still need inspection.
