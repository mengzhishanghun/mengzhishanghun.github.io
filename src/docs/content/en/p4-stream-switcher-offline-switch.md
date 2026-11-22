---
title: Switch Streams with Offline Directories
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
sourceHash: a44c259bb04ff6b9a9cf341210810e800c6660540ae6f540f9e4877e11a6a541
translationStatus: translated
generatedBodyHash: 0ae8ff52fc217205e8b38cb2e4409d400a07ace966710ea332869c41ca822243
docPage:
  work: p4-stream-switcher
  group: workflows
  slug: offline-switch
  order: 2
---

## Offline directory mode

Select `离线目录` (Offline directory) when adopting an existing local directory, confirm the path, and switch. After creating the client or entering a pending sync, the tool updates the have list, then treats local files as authoritative and runs reconcile, opening additions, edits, and deletions in the default changelist.

Review every difference in P4V and decide whether to submit or revert through the project's normal process. The tool does not submit automatically. Selecting offline mode alone does not force an existing workspace with no pending sync to run reconcile again.
