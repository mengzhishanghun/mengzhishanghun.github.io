---
title: AIDataAsset
description: Link DataAsset properties to JSON files so external programs can read and modify game data.
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
sourcePlatform: CNBlogs
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/20159718
links:
  - label: Original article on CNBlogs
    href: https://www.cnblogs.com/mengzhishanghun/p/20159718
sourceDate: 2026-05-25
lang: en
translationKey: ai-data-asset
sourceHash: 06f30569e2a18c5714827b17939b6fbb162bbeafebd3f4affb4dc14c91a29cc2
translationStatus: translated
generatedBodyHash: f129c11ff6dd82e824487bab1fe5939ec845b1e493f55c8f66ffb24b8dc5eec8
---

## Overview

AIDataAsset maps Unreal Engine DataAsset properties to JSON files, allowing external programs to adjust game data through readable, writable text. Asset changes in the editor can be exported to JSON, and external edits can be imported back into assets.

It targets workflows exchanging configuration between UE and scripts, data tools, or AI programs.

## Background and goals

DataAssets are stored in UE asset format, which external programs cannot easily interpret. Manually copying externally generated data into the editor on every iteration creates repetitive work when there are many fields or frequent updates.

JSON can be processed by common programs and reviewed as text diffs in version control. This work aims to establish a data channel between both sides while addressing precision, naming, and cyclic triggers in bidirectional synchronization.

## Core capabilities

### DataAsset and JSON round trips

DataAsset properties are exported to corresponding JSON, and JSON changes can be imported into the asset. Field name handling makes text properties easier to relate to names shown in the editor. Floating-point output also considers round-trip precision.

JSON is an interchange format. Assets used at runtime must still be updated and saved correctly in UE.

### Change monitoring and synchronization control

File change monitoring detects external edits while distinguishing JSON written by the plugin itself, preventing cycles where export triggers import and import triggers export.

Both sides may have changed before the editor starts. Synchronization direction must be determined from asset and file state; the existence of one side alone is not a reason to overwrite the other.

### Safeguards for editor changes

Importing data writes to DataAssets. The work combines version control checkout and undo transactions for editor modifications. Comparing exported content can reduce unnecessary writes. Asset deletion and the monitoring lifecycle also need management within this data channel.

## Use cases

It suits batch editing of DataAsset data such as character values and skill configurations with external scripts or tools, followed by inspection in UE. It also suits teams reviewing field-level changes, since JSON diffs are clearer than binary asset changes.

External AI may generate or modify JSON, but the project team remains responsible for validating data correctness.

## Scope and limitations

Bidirectional synchronization changes assets and disk files. Confirm which side is authoritative and ensure assets are writable.

Timestamp-based decisions suit cases where edits normally occur on only one side. Concurrent edits on both sides, field structure changes, and invalid JSON still require manual handling. The work provides data exchange, not business rule validation.
