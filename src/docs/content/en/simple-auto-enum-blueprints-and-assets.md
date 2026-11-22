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
sourceHash: 491068f6e070900a176bf635eb28f45fc61c3e7716256c620cee5c3b67ac95da
translationStatus: translated
generatedBodyHash: de1d37b63bbb050efa6c65a327c1d4ca1d4762af47e1ccce21c013cae434cb7b
docPage:
  work: simple-auto-enum
  group: usage
  slug: blueprints-and-assets
  order: 1
---

## Blueprint Function Limitations

- **Issue**: Blueprint functions store enum values as `FString`, so enum name or position changes may not update automatically
- **Solution**: Right-click the Blueprint function and choose **Refresh** to synchronize current enum values

## Default Values in DataAssets

- **Behavior**: DataAssets use enum indices and synchronize automatically when names change
- **Warning**: Reordering enum values shifts DataAsset values; for example, swapping positions 1 and 2 causes a DataAsset storing value 1 to refer to position 2
- **Recommendation**: Avoid reordering existing enum entries in production; append new values only
