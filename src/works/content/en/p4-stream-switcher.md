---
title: P4StreamSwitcher
description: Manage a pool of Perforce stream workspaces, switch branches, reuse local directories, and choose between synchronization and offline directory adoption.
type: work
slug: p4-stream-switcher
categoryId: open-source-tools
categoryName: Open-source tools
categoryOrder: 1
order: 1
status: Public source
workInfo:
  channels:
    - kind: docs
      href: /docs/zh/tools/p4-stream-switcher/
  compatibility:
    - platforms:
        - Windows
      requirements:
        - Python 3.10+, Tkinter, P4Python, platformdirs
        - Perforce CLI, P4V, and a valid server account
        - "Two-level streams: //depot/project/branch"
featured: false
draft: false
sitePublish: true
tags:
  - Perforce
  - Version control
links:
  - label: Public source repository
    href: https://github.com/MZSH-Tools/P4StreamSwitcher
lang: en
translationKey: p4-stream-switcher
sourceHash: 46d278e87b4db46d7aa2774d0b6589ca35f68b6870bed5eebb96c3c10c466c5c
translationStatus: translated
generatedBodyHash: b79994a66f0b3557d8d90e8f507da8b8e4ddf01bc5b25938c7ab8a9b57c65c09
coverAlt: P4StreamSwitcher cover
websiteCoverUrl: /assets/covers/p4-stream-switcher.png
---

## Overview

P4StreamSwitcher is a Windows tool for switching Perforce stream workspaces, built with Python, Tkinter, and P4Python. Select a project and branch to generate a workspace name from a personal tag, manage the workspace count, and open the corresponding P4V client.

It supports the two-level stream layout `//depot/project/branch`. The source repository is public but does not declare a license.

## The problem

Working across projects and branches involves repeatedly selecting clients and local directories. Keeping a workspace for every branch also consumes the available workspace count. UE projects contain local caches such as Saved, Intermediate, and DerivedDataCache, which must be distinguished from versioned files when reusing a directory.

The tool puts naming, cached directories, pool limits, and synchronization modes in one interface to reduce manual client configuration.

## Core capabilities

- Name workspaces as “tag_project_branch” and check tag conflicts across hosts; saving a new tag can rename old workspaces after confirmation.
- Set a pool limit. At capacity, select the oldest workspace using local timestamps and check opened files and the P4V process before attempting eviction.
- Open an existing workspace directly in P4V when its directory has not been manually changed and no synchronization flag is pending; otherwise run the relevant synchronization process.
- In normal mode, use the have list, difference detection, and ignore rules to clean and download files. In offline mode, treat the local directory as authoritative and reconcile differences into the default changelist.
- Cache directories and offline options per stream, optionally create .p4config, configure rmdir and line endings, and display status and leveled logs.

## Scope and limitations

Normal synchronization deletes local files that are absent from the have list and are not protected by ignore rules. Inspect existing directories and back up files you need before using them. Offline mode opens add, edit, and delete records that require review in P4V.

The pool manages workspaces for the current host and user that match its naming format. Its checks do not provide a complete backup of local changes. The tool does not submit changes for you, and no measurements establish a fixed switching speedup.

## Related content

- [Usage guide](/en/docs/tools/p4-stream-switcher/)
- [Workspace pool development case](/en/blog/perforce-workspace-pool/)
- [Python stream switching blog](/en/blog/python-perforce-stream-switch-safety/)
- [Public source repository](https://github.com/MZSH-Tools/P4StreamSwitcher)
