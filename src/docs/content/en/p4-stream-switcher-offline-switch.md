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
sourceHash: 319f851257e02ee826409777721b10b4d7f56ad3ceb4ba3f3578342eb88274f3
translationStatus: translated
generatedBodyHash: 2945972357672cdad1139bf0588cb4499ac0d23eebb71a60d467519e99ece0a0
docPage:
  work: p4-stream-switcher
  group: features
  slug: offline-switch
  order: 2
---

## Switch using local files and review the changes

To use the files you already have, choose their directory and select `离线目录` (Offline directory). Confirm the path, then switch. When the tool creates a client or handles a pending sync, it updates the have list and runs reconcile against the local files. Adds, edits, and deletes appear in the default changelist.

Review every difference in P4V and decide whether to submit or revert through the project's normal process. The tool does not submit automatically. Selecting offline mode alone does not force an existing workspace with no pending sync to run reconcile again.
