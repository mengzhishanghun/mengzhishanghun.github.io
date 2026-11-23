---
title: Reclaim and Delete Workspaces
type: doc
slug: p4-stream-switcher-recycle-workspace
draft: false
sitePublish: true
tags:
  - Perforce
  - Version control
workIds:
  - p4-stream-switcher
documentKind: product-manual
websiteRoute: /en/works/p4-stream-switcher/docs/recycle-workspace/
lang: en
translationKey: doc:p4-stream-switcher:recycle-workspace
sourceHash: 548f241bd0a49e5d773458847e01be3128e982b2c2e6bf384d57f3b26845ebbb
translationStatus: translated
generatedBodyHash: 9af7985398cac321f4fd59c20753bc530785890dad4fd56809085c52cbe8799f
docPage:
  work: p4-stream-switcher
  group: features
  slug: recycle-workspace
  order: 4
---

## Automatic reclamation and manual deletion

The workspace pool limit is at least 1 and defaults to 5.

A full pool selects the oldest client using locally stored usage timestamps. Automatic reclamation stops if the candidate has opened files or P4V is detected running. Review and handle changes first, and close P4V when necessary. Do not blindly revert work to bypass a check.

Close any P4V sessions for the workspace before deleting it manually. `删除工作区` (Delete workspace) asks for confirmation and checks opened files, but skips the P4V process check used by automatic reclamation. Deleting removes the server client and the tool’s cache record without clearing the local directory.

Pool management covers workspaces for the current user and host that match the naming convention. Protect local changes that Perforce has not recorded yourself.
