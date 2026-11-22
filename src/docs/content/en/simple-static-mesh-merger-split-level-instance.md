---
title: Break LevelInstances
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
sourceHash: 5d2904af289eeef6a98f5380abcc67a422eaa28912ecb907bf75500cb5274335
translationStatus: translated
generatedBodyHash: 439c6db55fea8e15bf9f69c57abe13f036651acdedb683d14ee3c908c26c33b4
docPage:
  work: simple-static-mesh-merger
  group: workflow
  slug: split-level-instance
  order: 2
---

## Break Instances Recursively and Refresh the Preview

Clicking `Break Level Instances` recursively breaks all LevelInstances in the scene:

- ✅ Automatically handles nested LevelInstances
- ✅ Smart deduplication (duplicate instances with same path are deleted)
- ✅ Real-time progress notifications (flowing display of current item)
- ✅ UI auto-refreshes after each iteration

## How First and Repeated Paths Are Handled

| Scenario | Processing | Result |
|----------|------------|--------|
| First encounter of path | Add to cache → Break | Content moved to main scene |
| Same-level duplicate | Detect → Delete | Avoids duplicate content |
| Nested duplicate | Detect → Delete | Avoids circular references |
