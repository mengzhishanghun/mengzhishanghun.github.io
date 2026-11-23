---
title: Switch Streams and Resynchronize
type: doc
slug: p4-stream-switcher-normal-switch
draft: false
sitePublish: true
tags:
  - Perforce
  - Version control
workIds:
  - p4-stream-switcher
documentKind: product-manual
websiteRoute: /en/works/p4-stream-switcher/docs/normal-switch/
lang: en
translationKey: doc:p4-stream-switcher:normal-switch
sourceHash: e46799a1efbb4e55f29323aff93f3a1f68d8b59aeb8c451cff880edab0d0da7b
translationStatus: translated
generatedBodyHash: d011a659fdec9f3d5daccaa334e3f9ba8390a85475b986373babb9644bf4159c
docPage:
  work: p4-stream-switcher
  group: features
  slug: normal-switch
  order: 1
---

## First switch in normal mode

1. Enter and save a unique workspace tag. If another host uses it, choose a different tag or coordinate with its user first.
2. Select the project and branch and check the workspace name. Black indicates an existing workspace; gray indicates one the tool will create.
3. Choose a local directory. If you reuse a directory, back up the files you need first. Normal sync removes some local files and may overwrite files that differ from the target revision. To keep the local files as the starting point for reconciliation, use [offline directory mode](/en/works/p4-stream-switcher/docs/offline-switch/).
4. Check the pool limit, .p4config, rmdir, and line ending settings.
5. Click `切换并打开 P4V` (Switch and open P4V), then confirm the default or newly created directory when prompted.
6. In P4V, check the active client and changelist.

## Open an existing workspace and resynchronize

An existing workspace opens directly in P4V without file synchronization when its directory has not been manually changed and no sync flag is pending. This does not update it to the latest server revision; use P4V for later updates.

If you manually change the directory of an existing workspace, the tool updates the server Root and synchronizes. If a nonmanual path differs from the server, the server Root takes precedence. A failed sync retains its pending flag for another attempt on the next switch; inspect logs and directory state before retrying.

## What normal sync cleans up

When creating a workspace or when synchronization is required, the tool configures the client, updates the have list, reads .p4ignore, removes extra files, and uses diff -se and diff -sd to find changed or missing files. It downloads those files and opens P4V.

This process deletes local files absent from the have list unless ignore rules protect them, and may overwrite files differing from the target revision. Do not put the only copy of needed files in an unchecked target directory.

Built-in protection covers Saved/, Intermediate/, DerivedDataCache/, Binaries/, .vs/, .vscode/, .idea/, .git/, .p4config, and *.log. Add rules for other files to preserve in a root .p4ignore file:

```text
MyCache/
*.tmp
Config/Local/*
!keep.txt
```

A trailing / matches directory names; other patterns match filenames or paths, and ! removes an ignore. The tool uses its own pattern matching, which is not a complete backup guarantee.

## Troubleshoot project, branch, and sync issues

- Missing project or branch: check permissions and the two-level stream layout; projects need a mainline stream.
- Sync failure: inspect error logs, preserve needed files, and resolve connection, permission, or path problems before retrying.
