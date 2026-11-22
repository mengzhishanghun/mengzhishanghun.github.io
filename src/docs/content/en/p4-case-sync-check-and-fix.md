---
title: Check and Fix Filename Case
type: doc
slug: p4-case-sync-check-and-fix
draft: false
sitePublish: true
tags:
  - Perforce
  - Version Control
workIds:
  - p4-case-sync
documentKind: product-manual
websiteRoute: /en/works/p4-case-sync/docs/check-and-fix/
lang: en
translationKey: doc:p4-case-sync:check-and-fix
sourceHash: e96c88dcf198bf2bb22cc48fdf15167622f52142e1e1876f8a6a8e385bcc4fde
translationStatus: translated
generatedBodyHash: 965994c823dd1e87d35e0cdbd1566807e1df89739c5df2310afbbf0fd10335f5
docPage:
  work: p4-case-sync
  group: case-fixes
  slug: check-and-fix
  order: 1
---

## Path Checks and Color Indicators

The tool reads pending files from `p4 opened`, uses `p4 where` to locate them, and compares the case of each path component against the disk. It lists `edit / add / move/add` actions and filters out deletions.

- **Gray**: The path is unchanged.
- **Green**: The new path matches the automatic suggestion.
- **Red**: The manually edited path differs from the automatic suggestion.

## List Display

- The top shows a **color legend** and an “Only show files needing changes” toggle  
- Rows show “Before / After”; double-click a row to edit “After”

## Review and Apply Path Changes

1. Open the tool and select a **Changelist**. The default is `default`.
2. Check the paths in the before and after columns. To adjust a target path, double-click its row and edit it in the dialog.
3. After reviewing the list, click **Apply Changes**. The tool runs `p4 move` for each change and verifies consistency. If verification fails, it tries the two-step move fallback and marks the item as failed if it still does not match.
4. Review the resulting changelist, then submit it through the usual P4V or command-line workflow.

## Display and Path Issues

- **The local path does not exist:** The tool corrects case as far as the deepest accessible parent directory. Edit the remaining path manually if needed.
- **An X appears instead of a check mark:** Icons depend on the system theme. The tool prefers Windows `vista/xpnative` themes; a custom icon is another option.
- **Gray bars or remnants after refresh:** The earlier rendering issue was fixed. Refresh removes the old list controls, including separators.
