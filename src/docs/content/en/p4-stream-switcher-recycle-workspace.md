---
title: Recycle and Delete Workspaces
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
sourceHash: 0426604a6be4b0eb6eab6558a0e4a9e6c4c178598f43413bb5a1d926810ed7ca
translationStatus: translated
generatedBodyHash: f256bc71d453c83e88b12375dfc5cf8b0c6096adf4b79df8e1e80f0915f60eb2
docPage:
  work: p4-stream-switcher
  group: workflows
  slug: recycle-workspace
  order: 3
---

## Workspace reclamation and deletion

A full pool selects the oldest client using locally stored usage timestamps. Automatic reclamation stops if the candidate has opened files or P4V is detected running. Review and handle changes first, and close P4V when necessary. Do not blindly revert work to bypass a check.

The separate `删除工作区` (Delete workspace) action asks for confirmation and checks opened files. It does not perform the P4V process check used by automatic reclamation; close related sessions yourself. It deletes the server client and tool cache records, rather than clearing the entire local directory.

Pool management covers workspaces for the current user and host that match the naming convention. Protect local changes that Perforce has not recorded yourself.
