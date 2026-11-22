---
title: Break Level Instances
type: doc
slug: simple-static-mesh-merger-split-level-instance
draft: false
sitePublish: true
tags:
  - StaticMesh
  - Instancing
workIds:
  - simple-static-mesh-merger
documentKind: product-manual
websiteRoute: /en/works/simple-static-mesh-merger/docs/split-level-instance/
lang: en
translationKey: doc:simple-static-mesh-merger:split-level-instance
sourceHash: 7217f1366a1ca8e94310aa8022e298ebc2725d2ba0fbb7b07f22e01b0f41316b
translationStatus: translated
generatedBodyHash: 37a7cce618b106855bd0a174d4e25453207e69bb517871ca33e0b397e740332a
docPage:
  work: simple-static-mesh-merger
  group: workflows
  slug: split-level-instance
  order: 2
---

## 🏗️ Breaking LevelInstances

### Functionality

Clicking `Break Level Instances` recursively breaks all LevelInstances in the scene:

- ✅ Automatically handles nested LevelInstances
- ✅ Smart deduplication (duplicate instances with same path are deleted)
- ✅ Real-time progress notifications (flowing display of current item)
- ✅ UI auto-refreshes after each iteration

### Processing Strategy

| Scenario | Processing | Result |
|----------|------------|--------|
| First encounter of path | Add to cache → Break | Content moved to main scene |
| Same-level duplicate | Detect → Delete | Avoids duplicate content |
| Nested duplicate | Detect → Delete | Avoids circular references |

---
