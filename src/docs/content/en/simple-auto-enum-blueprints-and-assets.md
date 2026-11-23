---
title: Use Enums in Blueprints and DataAssets
type: doc
slug: simple-auto-enum-blueprints-and-assets
draft: false
sitePublish: true
tags:
  - Configuration Management
  - Enums
workIds:
  - simple-auto-enum
documentKind: product-manual
websiteRoute: /en/works/simple-auto-enum/docs/blueprints-and-assets/
lang: en
translationKey: doc:simple-auto-enum:blueprints-and-assets
sourceHash: f3550791b03fc70c862cb9bfff454838d7b800963cdb0ccae3e512f0385de80a
translationStatus: translated
generatedBodyHash: 6f08d7ed5c04b75bae5b7f60d4bbe2f98a5b7fcb3f0e82b96d8b68e1779dae21
docPage:
  work: simple-auto-enum
  group: features
  slug: blueprints-and-assets
  order: 2
---

## Blueprint Function Limitations

- **Issue**: Blueprint functions store enum values as `FString`, so enum name or position changes may not update automatically
- **Solution**: Right-click the Blueprint function and choose **Refresh** to synchronize current enum values

## Default Values in DataAssets

After appending entries, open a Blueprint and DataAsset that use the enum. Check that existing selections still point to the original entries, then try selecting a new one. If you have already reordered the entries, review the affected defaults individually.

- **Behavior**: DataAssets use enum indices and synchronize automatically when names change
- **Warning**: Reordering enum values shifts DataAsset values; for example, swapping positions 1 and 2 causes a DataAsset storing value 1 to refer to position 2
- **Recommendation**: In production, append new enum values to the existing list without reordering its entries.
