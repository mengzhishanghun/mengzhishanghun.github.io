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
sourceHash: 15b941be28b3415a7f68282e63ccb2c3ac3c7437c1fe67dc8dd88cd790170e0f
translationStatus: translated
generatedBodyHash: 4b7da0c7ad3386676baafe2489a248a36e68d19f470bd28eacc98338e0f28c76
---

## Overview

P4CaseSync checks the path capitalization of opened files before a Perforce submit. Using actual disk paths as its reference, it checks files in a specified changelist or default and provides preview, manual adjustment, and correction actions.

Its goal is to make the Perforce paths being submitted match the actual directory and file names.

## Background and goals

In a Windows workspace, capitalization differences may not affect local file access, yet can leave inconsistencies in Perforce paths, cross-platform synchronization, or later collaboration. Checking directory levels file by file makes omissions easy.

The tool compares actual local paths with the opened file list so submitters can inspect differences before deciding how to correct them.

## Core capabilities

### Reading files awaiting submission

The tool uses the Perforce CLI to retrieve opened files in a specified changelist or default.

Its scope matches the submission being handled, allowing path checks before the actual submit without scanning the entire repository for unrelated files.

### Checking actual local capitalization

Using path mappings and local disk directories, the tool checks actual capitalization at each path level. Colors distinguish unchanged entries, automatic corrections, and manual changes, helping users identify items needing attention and their proposed target paths.

### Manual adjustment and verification

Users can fine-tune target paths beyond the automatic suggestions. After applying changes, the tool checks consistency again.

Corrections may involve `p4 move`. Verify target paths in the list before execution, then inspect the pending submission through the normal Perforce workflow afterward.

## Use cases

It suits Perforce projects shared between Windows and case-sensitive platforms, or cases where file and directory names differ from Perforce records before submission.

For a changelist with several path changes, a consolidated preview makes omissions easier to spot.

## Scope and limitations

The tool requires an available Perforce CLI, correct workspace mappings, and a valid login.

Path corrections are version control operations and may change opened file records. Check the target list before applying them and review the changelist afterward. The tool handles path consistency; it does not replace content review or submission permission checks.
