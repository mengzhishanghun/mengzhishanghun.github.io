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
sourceHash: 3169e4c3cf53087cbf6612142c51cf6ffa208ec6a25a6e0551399ee650c2cdce
translationStatus: translated
generatedBodyHash: 64eabc0b5679b5607c9fb08bb4360dc96d97e4bb515a5a9922ceb3dff6349a68
docPage:
  work: p4-stream-switcher
  group: workspaces
  slug: workspace-settings
  order: 1
---

## Workspace naming, directories, and sync options

| Feature | Usage and effect |
| --- | --- |
| Workspace tag | Enter a personal tag and click Save to generate “tag_project_branch”. O means valid; X means empty or conflicting. Changing the tag may rename old workspaces after confirmation. |
| Project and branch | Projects come from mainline streams; branches come from the selected project. Arbitrary stream depths are unsupported. |
| Workspace directory | Click to choose a directory. Paths are cached per stream, their origin is indicated, and generated default paths require confirmation. |
| Create P4CONFIG | Enabled by default. Switching creates or updates .p4config at the root with server, user, and client values. Other commands still need the appropriate P4CONFIG environment setting to read it. |
| Remove empty directories | Enabled by default. Changing it updates rmdir for local workspaces under the current tag; sync removes empty directories. |
| Line endings | Choose local, unix, mac, win, or share; default win. Follow your team's client policy. The setting is saved and used for new workspaces. On startup, the tool also checks and corrects line endings of existing local workspaces under the current tag to match the saved value. |
| Status and logs | View server, user, used/maximum count, progress, and information, warning, and error logs. |

## Local settings and workspace tag checks

The tool stores tags, limits, options, usage timestamps, and per-stream directories, offline choices, and sync state in the user cache directory, usually beneath %LOCALAPPDATA% on Windows. These local records are not shared project configuration.

- Unsaved tag prompt: click Save before switching and handle any rename prompt.
