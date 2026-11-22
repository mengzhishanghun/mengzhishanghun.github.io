---
title: Switch Streams with an Offline Directory
type: doc
slug: p4-stream-switcher-offline-switch
draft: false
sitePublish: true
tags:
  - Perforce
  - Version control
workIds:
  - p4-stream-switcher
documentKind: product-manual
websiteRoute: /en/works/p4-stream-switcher/docs/offline-switch/
lang: en
translationKey: doc:p4-stream-switcher:offline-switch
sourceHash: 7ed11ca29336e6d6e5df4cb5beb28ef77a7149538e6c4cdba7ba2ebdd8268bb8
translationStatus: translated
generatedBodyHash: 98aa5f3fb03cedcf061c50171348c4358087b839486965e199fc7d3f4a54c3c9
docPage:
  work: p4-stream-switcher
  group: switching
  slug: offline-switch
  order: 2
---

## Switch using local files and review the changes

Select `离线目录` (Offline directory) when adopting an existing local directory, confirm the path, and switch. After creating the client or entering a pending sync, the tool updates the have list, then treats local files as authoritative and runs reconcile, opening additions, edits, and deletions in the default changelist.

Review every difference in P4V and decide whether to submit or revert through the project's normal process. The tool does not submit automatically. Selecting offline mode alone does not force an existing workspace with no pending sync to run reconcile again.
