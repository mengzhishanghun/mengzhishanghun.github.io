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
sourceHash: 45045200bc450137cc8961ced2e083f7d9852f70931f1c8090ccd25b0b35def1
translationStatus: translated
generatedBodyHash: c069be4c6ddab4c675f14d524dfb23aac457a8c77f6091008bdcdcc45cb0a786
docPage:
  work: p4-stream-switcher
  group: workspaces
  slug: recycle-workspace
  order: 2
---

## Automatic reclamation and manual deletion

The workspace pool limit is at least 1 and defaults to 5.

A full pool selects the oldest client using locally stored usage timestamps. Automatic reclamation stops if the candidate has opened files or P4V is detected running. Review and handle changes first, and close P4V when necessary. Do not blindly revert work to bypass a check.

The separate `删除工作区` (Delete workspace) action asks for confirmation and checks opened files. It does not perform the P4V process check used by automatic reclamation; close related sessions yourself. It deletes the server client and tool cache records, rather than clearing the entire local directory.

Pool management covers workspaces for the current user and host that match the naming convention. Protect local changes that Perforce has not recorded yourself.
