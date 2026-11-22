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
sourceHash: ce4f90e8906c7580bf2fbda4f09de96508f3274dc75c8c5b8371ca54665a366a
translationStatus: translated
generatedBodyHash: 057f283a4649d41550f5cb714f91937f12f1330c5ba806f5442d145610e99610
docPage:
  work: p4-case-sync
  group: case-fixes
  slug: check-and-fix
  order: 1
---

## Path Checks and Color Indicators

The tool reads pending files from `p4 opened`, uses `p4 where` to locate them, and compares the case of each path component against the disk. It lists `edit / add / move/add` actions and filters out deletions.

- **Gray**: The path is unchanged.
- **Green**: The new path differs from the original and matches the automatic suggestion.
- **Red**: The manually edited path differs from the automatic suggestion.

## List Display

- The top shows a **color legend** and an “Only show files needing changes” toggle  
- Rows show “Before / After”; double-click anywhere in the row to edit “After” in a dialog. The color updates as soon as you edit the path.

## Review and Apply Path Changes

1. Open the tool and select a **Changelist**. The default is `default`.
2. Check the paths in the before and after columns. To adjust a target path, double-click its row and edit it in the dialog.
3. After reviewing the list, click **Apply Changes**. The tool runs `p4 move` for each change and verifies consistency. If verification fails, it moves the file to a temporary name, then to the target name, and checks it again. If the paths still differ, it marks the item as failed.
4. Review the resulting changelist, then submit it through the usual P4V or command-line workflow.

## Display and Path Issues

- **The local path does not exist:** The tool corrects case as far as the deepest accessible parent directory. Edit the remaining path manually if needed.
- **An X appears instead of a check mark:** Icons depend on the system theme. The tool prefers Windows `vista/xpnative` themes; a custom icon is another option.
- **Gray bars or remnants after refresh:** The earlier rendering issue was fixed. Refresh removes the old list controls, including separators.
