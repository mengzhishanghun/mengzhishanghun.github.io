---
title: P4CaseSync
description: Check and correct the path capitalization of opened Perforce files against their actual local paths before submitting.
type: work
slug: p4-case-sync
categoryId: open-source-tools
categoryName: Open-source tools
categoryOrder: 1
order: 0
status: Official documentation
featured: false
draft: false
sitePublish: false
tags:
  - Perforce
  - Version control
links:
  - label: GitHub
    href: https://github.com/MZSH-Tools/P4CaseSync
lang: en
translationKey: p4-case-sync
sourceHash: bce9231f14209ca1148c1d583841ab362c481ff8b63ed9504a878f56ff470057
translationStatus: translated
generatedBodyHash: 3a4d020b2749f95c95dd86de3041b24972c6717a690f179a609975d11f834aa9
workInfo:
  channels:
    - kind: open-source
      href: https://github.com/MZSH-Tools/P4CaseSync
    - kind: docs
      href: /en/works/p4-case-sync/docs/setup/
websiteCoverUrl: /media/imported/works/p4-case-sync-cover-v2.png
coverAlt: P4CaseSync cover
docIds:
  - p4-case-sync-setup
  - p4-case-sync-check-and-fix
  - p4-case-sync-build-and-environment
  - p4-case-sync-reuse-environment
  - p4-case-sync-updates-2025-10-16
---

## Overview

P4CaseSync checks file path capitalization before a Perforce submit. Select a changelist or use `default`. The tool checks its opened files against their actual paths on disk. Preview the suggestions, adjust them if needed, then apply the corrections.

Its goal is to make the Perforce paths being submitted match the actual directory and file names.

## Background and goals

In a Windows workspace, capitalization differences may not affect local file access, yet can leave inconsistencies in Perforce paths, cross-platform synchronization, or later collaboration. Checking directory levels file by file makes omissions easy.

The tool compares actual local paths with the opened file list so submitters can inspect differences before deciding how to correct them.

## Core capabilities

### Reading files awaiting submission

The tool uses the Perforce CLI to retrieve opened files in a specified changelist or default.

Its scope matches the submission being handled, allowing path checks before the actual submit without scanning the entire repository for unrelated files.

### Checking actual local capitalization

The tool checks capitalization at each level against actual local directories and provides a consolidated preview of suggested paths and manual adjustments.

### Manual adjustment and verification

Users can fine-tune target paths beyond the automatic suggestions. After applying changes, the tool checks consistency again.

Corrections may involve `p4 move`. Verify target paths in the list before execution, then inspect the pending submission through the normal Perforce workflow afterward.

## Use cases

It suits Perforce projects shared between Windows and case-sensitive platforms, or cases where file and directory names differ from Perforce records before submission.

For a changelist with several path changes, a consolidated preview makes omissions easier to spot.

## Scope and limitations

The tool requires an available Perforce CLI, correct workspace mappings, and a valid login.

Path corrections are version control operations and may change opened file records. Check the target list before applying them and review the changelist afterward. The tool handles path consistency; it does not replace content review or submission permission checks.

See the [usage guide](/en/works/p4-case-sync/docs/check-and-fix/) for steps and parameters.

## License

MIT License

## Feedback and Contributions

Thanks to all developers using and providing feedback on **P4CaseSync**. Open an Issue for problems or contribute improvements through a PR.
