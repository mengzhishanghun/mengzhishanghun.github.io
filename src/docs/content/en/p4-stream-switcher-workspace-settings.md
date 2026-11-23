---
title: Configure Workspaces and Local Options
type: doc
slug: p4-stream-switcher-workspace-settings
draft: false
sitePublish: true
tags:
  - Perforce
  - Version control
workIds:
  - p4-stream-switcher
documentKind: product-manual
websiteRoute: /en/works/p4-stream-switcher/docs/workspace-settings/
lang: en
translationKey: doc:p4-stream-switcher:workspace-settings
sourceHash: 1460e61c2e6173ce90ef37eafd3411cb1aa4f2d4d994d25573c99ff735ccee67
translationStatus: translated
generatedBodyHash: 01efd74b89aa2a2a391104cf5127542648e07d2ba137a192c3868847c9fce943
docPage:
  work: p4-stream-switcher
  group: features
  slug: workspace-settings
  order: 3
---

## Workspace naming, directories, and sync options

| Feature | Usage and effect |
| --- | --- |
| Workspace tag | Enter a personal tag and click Save to generate “tag_project_branch”. O means valid; X means empty or conflicting. Changing the tag may rename old workspaces after confirmation. |
| Project and branch | Projects come from mainline streams; branches come from the selected project. Arbitrary stream depths are unsupported. |
| Workspace directory | Click to choose a directory. Paths are cached per stream, their origin is indicated, and generated default paths require confirmation. |
| Create P4CONFIG | Enabled by default. Switching creates or updates .p4config at the root with server, user, and client values. Other commands still need the appropriate P4CONFIG environment setting to read it. |
| Remove empty directories | Enabled by default. Changing it updates rmdir for local workspaces under the current tag; sync removes empty directories. |
| Line endings | Choose local, unix, mac, win, or share according to your team’s client policy. The default is win. New workspaces use the saved setting. On startup, the tool also checks and corrects the line ending option for existing local workspaces under the current tag to match that setting. |
| Status and logs | View server, user, used/maximum count, progress, and information, warning, and error logs. |

![P4StreamSwitcher general settings and workspace options](/media-occurrence/doc%3Ap4-stream-switcher%3Aworkspace-settings%3Amedia%3A1)

General settings are at the top of the window, with workspace options in the middle. This view shows where the settings appear. The project, branch, and directory are empty, and no stream switch has run.

## Local settings and workspace tag checks

The tool stores tags, limits, options, usage timestamps, and per-stream directories, offline choices, and sync state in the user cache directory, usually beneath %LOCALAPPDATA% on Windows. These local records are not shared project configuration.

- Unsaved tag prompt: click Save before switching and handle any rename prompt.
