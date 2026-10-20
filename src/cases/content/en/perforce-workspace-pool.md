---
title: Managing Perforce branch workspaces and local caches
description: Organize branch switching with a workspace pool, separate server synchronization from offline directory adoption, and define cache protection and cleanup boundaries.
type: case
slug: perforce-workspace-pool
categoryId: desktop-automation
categoryName: Desktop and automation
categoryOrder: 1
status: Development case
featured: false
draft: false
sitePublish: true
tags:
  - Perforce
  - Development tools
productIds:
  - p4-stream-switcher
lang: en
translationKey: perforce-workspace-pool
sourceHash: 98f17e244d5c2039e382035126a7d73a7719e836cea3b826ca52efedfe35b6c7
translationStatus: translated
generatedBodyHash: 41d155afdadc8e681ff0c0c6a1f8d6e41da4d2234fab542f63167c96c8ea30f0
---

## Background and constraints

P4StreamSwitcher targets Perforce development across multiple projects and branches. Workspace counts need to be controlled while branch directories may contain local UE caches. Repeatedly changing client configuration by hand makes workspace, stream, and directory associations harder to track.

This case describes the implementation in the source. Its scope is Windows and the two-level stream layout `//depot/project/branch`.

## Breaking down the problem

Switching branches involves locating a workspace, deciding whether to create a client, selecting a directory, and deciding whether to update it from the server or preserve local content. Treating all of this as an unconditional sync misses the difference between existing workspaces and offline directories.

A full pool also requires reclaiming clients. Deleting by name alone does not account for usage order or opened files.

## Implementation

The tool identifies workspaces as “tag_project_branch” and stores the directory, offline option, and pending synchronization flag per stream. An existing workspace opens directly in P4V when no sync is needed. A manually changed Root or an unfinished previous sync triggers the synchronization process again.

The pool chooses an eviction candidate using local timestamps, then checks its opened files and whether P4V is running before deletion. Tag conflict checks help prevent hosts from sharing a tag; ordinary manually created workspaces outside the naming convention are excluded from the pool.

Directory handling follows two paths. Normal mode updates the have list, applies built-in cache protection and .p4ignore rules, removes extra files, then downloads changed or missing files. Offline mode updates the have list and runs reconcile, opening local additions, edits, and deletions in the default changelist for user review.

## Results and boundaries

The implementation provides workspace selection, count management, and two directory handling modes, with logs and sync status in the interface. It does not provide automatic backups, and an empty opened-file list does not prove that no untracked local modifications exist on disk.

Normal cleanup can delete extra local files that are not ignored; offline mode changes pending records. Directory selection and mode confirmation are therefore required before use. Source capabilities described here are not production test results, and no guarantee of zero cache loss or fixed performance gains is made.

## Related content

- [P4StreamSwitcher work](/en/works/p4-stream-switcher/)
- [Usage guide](/en/docs/tools/p4-stream-switcher/)
- [Python stream switching blog](/en/blog/python-perforce-stream-switch-safety/)

## Discuss your project

If your Perforce workflow involves multiple branch directories, local caches, or attaching offline directories, start with P4StreamSwitcher and its guide. We can also discuss adapting it to your naming, directory, or switching rules.

Describe the stream structure, workspace count, and local content that needs to be retained so we can define the boundaries for synchronization, cleanup, and pending changes.

If you have a related project, [get in touch](https://mzsh.me/en/contact/) to discuss it.
