---
title: Configure a Workspace and Switch Streams
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
sourceHash: 3c400c85b391da6fd1e680d9d856fe3b6f42161359f9fab43ae305d6838f5e4a
translationStatus: translated
generatedBodyHash: 36ffc0f194000c7e156212a7878dc0e8ab09078e6b0819cfa2bdfd9242b7e118
docPage:
  work: p4-stream-switcher
  group: workflows
  slug: normal-switch
  order: 1
---

P4StreamSwitcher selects Perforce stream workspaces and opens P4V on Windows. It supports only the two-level stream layout `//depot/project/branch`.

## Installation and connection

Prepare Windows, Python 3.10 or later with Tkinter, the Perforce CLI, and P4V. Your server account needs permission to access the target streams and create and delete clients, with a valid login. The current host must already have at least one stream client owned by the current user, with Host set to this machine and a Stream assigned.

Obtain the files from the [public source repository](https://github.com/MZSH-Tools/P4StreamSwitcher), then install dependencies and start from the project directory:

```powershell
python -m pip install p4python platformdirs
python Main.py
```

Before starting, configure P4PORT and P4USER in your own Perforce environment and establish a valid session through your normal login process. If connection fails, check the server, account, and network. If no stream client is available, configure one in P4V first.

The repository does not declare a license. Public readability does not grant unrestricted redistribution or commercial use.

## Features and settings

| Feature | Usage and effect |
| --- | --- |
| Workspace tag | Enter a personal tag and click Save to generate “tag_project_branch”. O means valid; X means empty or conflicting. Changing the tag may rename old workspaces after confirmation. |
| Maximum workspaces | Set the pool limit, at least 1 and 5 by default. A full pool attempts to reclaim the oldest workspace. |
| Project and branch | Projects come from mainline streams; branches come from the selected project. Arbitrary stream depths are unsupported. |
| Name preview | Black means an existing workspace; gray means one to be created. |
| Workspace directory | Click to choose a directory. Paths are cached per stream, their origin is indicated, and generated default paths require confirmation. |
| Offline directory | Select when adopting existing local files. Differences are reconciled into the default changelist. |
| Create P4CONFIG | Enabled by default. Switching creates or updates .p4config at the root with server, user, and client values. Other commands still need the appropriate P4CONFIG environment setting to read it. |
| Remove empty directories | Enabled by default. Changing it updates rmdir for local workspaces under the current tag; sync removes empty directories. |
| Line endings | Choose local, unix, mac, win, or share; default win. Follow your team's client policy. The setting is saved and used for new workspaces. On startup, the tool also checks and corrects line endings of existing local workspaces under the current tag to match the saved value. |
| Delete workspace | Delete the selected server client and its local cache records. Check the name before confirming; opened files block deletion. |
| Status and logs | View server, user, used/maximum count, progress, and information, warning, and error logs. |

## First switch

1. Enter and save a unique workspace tag. If another host uses it, choose another tag or coordinate with that user first.
2. Select the target project and branch and check the generated workspace name.
3. Choose a local directory and decide between normal and offline mode. Back up local content you need before using an existing folder.
4. Review the pool limit, .p4config, rmdir, and line-ending settings.
5. Click `切换并打开 P4V` (Switch and open P4V), confirming a default path or directory creation when prompted.
6. Check the current client and changelist in P4V before continuing your normal workflow.

## Existing workspaces and resynchronization

An existing workspace opens directly in P4V without file synchronization when its directory has not been manually changed and no sync flag is pending. This does not update it to the latest server revision; use P4V for later updates.

If you manually change the directory of an existing workspace, the tool updates the server Root and synchronizes. If a nonmanual path differs from the server, the server Root takes precedence. A failed sync retains its pending flag for another attempt on the next switch; inspect logs and directory state before retrying.

## Normal mode

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

## Saved settings and troubleshooting

The tool stores tags, limits, options, usage timestamps, and per-stream directories, offline choices, and sync state in the user cache directory, usually beneath %LOCALAPPDATA% on Windows. These local records are not shared project configuration.

- Connection failure: check P4PORT, P4USER, login status, and server reachability.
- No stream client detected: confirm in P4V that the client belongs to the current user, has this host, and references a Stream.
- Unsaved tag prompt: click Save before switching and handle any rename prompt.
- Missing project or branch: check permissions and the two-level stream layout; projects need a mainline stream.
- Sync failure: inspect error logs, preserve needed files, and resolve connection, permission, or path problems before retrying.

## Related content

- [Work overview](/en/works/p4-stream-switcher/)
- [Development case](/en/cases/perforce-workspace-pool/)
- [Python stream switching blog](/en/blog/python-perforce-stream-switch-safety/)
