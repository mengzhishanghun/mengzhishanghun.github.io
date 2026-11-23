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
sourceHash: 2c6682aa6f89b29e78fea5519278e2be8fd45546c2f1b9d4f508d47e5cc41f8a
translationStatus: translated
generatedBodyHash: d78a8d482113e37ba31b667f8d69140e41d620e9ae44550a8254c5e028d6e2cd
docPage:
  work: simple-static-mesh-merger
  group: features
  slug: split-level-instance
  order: 2
---

## Break Instances Recursively and Refresh the Preview

Breaking instances changes the scene. Keep a recoverable copy of the level before you start. Once progress finishes, check the actors that were moved out and the duplicates that were removed in the Outliner, then review the merge preview.

Clicking `Break Level Instances` recursively breaks all LevelInstances in the scene:

- ✅ Automatically handles nested LevelInstances
- ✅ Smart deduplication (duplicate instances with same path are deleted)
- ✅ Progress notifications show which object the tool is processing
- ✅ UI auto-refreshes after each iteration

## How First and Repeated Paths Are Handled

| Scenario | Processing | Result |
|----------|------------|--------|
| First encounter of path | Add to cache → Break | Content moved to main scene |
| Same-level duplicate | Detect → Delete | Avoids duplicate content |
| Nested duplicate | Detect → Delete | Avoids circular references |
