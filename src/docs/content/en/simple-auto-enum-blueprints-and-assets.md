---
title: Use Enums in Blueprints and Data Assets
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
sourceHash: 37626e8845f4f0efdb2f734cbb97198f89819b0a2f9d3e46466c3662707128af
translationStatus: translated
generatedBodyHash: befe5fc068d51650d509c87ccfa00b706271964596041334360a285d6b476920
docPage:
  work: simple-auto-enum
  group: workflows
  slug: blueprints-and-assets
  order: 2
---

## ⚠️ Important Notes and Limitations

### Blueprint Functions
- **Issue**: Blueprint functions store enum values as `FString`, so enum name or position changes may not update automatically
- **Solution**: Right-click the Blueprint function and choose **Refresh** to synchronize current enum values

### DataAssets
- **Behavior**: DataAssets use enum indices and synchronize automatically when names change
- **Warning**: Reordering enum values shifts DataAsset values; for example, swapping positions 1 and 2 causes a DataAsset storing value 1 to refer to position 2
- **Recommendation**: Avoid reordering existing enum entries in production; append new values only

---
