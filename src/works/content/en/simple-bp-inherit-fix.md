---
title: SimpleBPInheritFix
description: Scan and repair component state contamination within Actor Blueprint inheritance chains.
type: work
slug: simple-bp-inherit-fix
categoryId: ue-plugins
categoryName: UE plugins
categoryOrder: 0
order: 13
status: Official documentation
featured: false
draft: false
sitePublish: false
tags:
  - Blueprints
  - Inheritance chains
  - Simple series
links:
  - label: GitHub
    href: https://github.com/MZSH-UEPlugins/SimpleBPInheritFix
lang: en
translationKey: simple-bp-inherit-fix
sourceHash: d41a579e97142f64c894774ba1685cd841003244464955869d17d5bd6ddea765
translationStatus: translated
generatedBodyHash: 974dec6056db37d5159f2674049ffe0882868a5e58bfa73bae46f547fa6b6672
workInfo:
  channels:
    - kind: sale
      href: https://www.fab.com/listings/320c7471-92b8-4a3e-a88a-2a5fcb98d620
    - kind: docs
      href: /en/works/simple-bp-inherit-fix/docs/quickstart/
websiteCoverUrl: /media/covers/works/simple-bp-inherit-fix-20261101.webp
coverAlt: SimpleBPInheritFix cover
docIds:
  - simple-bp-inherit-fix-quickstart
  - simple-bp-inherit-fix-find-components
  - simple-bp-inherit-fix-repair-components
---

## Overview

SimpleBPInheritFix is an editor plugin for abnormal component states in Actor Blueprint inheritance chains.

When a component's creation method is incorrectly marked Instance, the cut and delete actions in the parent Blueprint may be disabled, or a change in a child Blueprint may be written back to its parent. Starting from an affected Blueprint, the plugin examines its inheritance chain, locates this kind of contamination, and corrects the component creation method.

## Background and goals

These problems span several related Blueprints, so inspecting only the current one can make the origin difficult to identify. Repairing only the open asset may also miss similar states in ancestors or descendants.

The tool organizes scanning, checkout, and repair around the complete inheritance chain, allowing component and asset scope to be checked in logs. It targets a specific component state problem rather than general Blueprint troubleshooting.

## Core capabilities

### Inheritance chain scanning and diagnosis

Starting from an affected Actor Blueprint in the chain, it checks component states in ancestors, the current Blueprint, and descendants. Logs list inspection stages, abnormal components found, and their owning Blueprints so users can assess the actual scope.

If the scan finds no incorrect flags, continue looking for the cause of the component issue.

### Targeted repair and asset saving

For matching components, the tool changes CreationMethod from Instance back to SimpleConstructionScript. It attempts version control checkout before repair and marks affected Blueprints for saving afterward. Saving must still be completed in the editor.

If checkout fails, an in-memory repair does not mean disk assets have been updated. Resolve write access first and verify the saved result.

## Use cases

It helps investigate components that become difficult to edit after Actor Blueprint inheritance, or child operations that affect parents.

In projects with several inheritance levels, chain scanning helps locate affected assets. Logs and the pending-save list provide clues for version control checks before and after changes.

## How to use it

Suppose you edit a mesh component in a child Blueprint and the parent's component changes as well. Run the repair from the child, then check the log to see whether it found an issue in the parent's component template.

1. Install the plugin and make sure it compiles. In the Content Browser, right-click the affected Actor Blueprint and choose **Component Repair → Fix Inheritance Pollution**.
2. Filter the Output Log for `LogSBIF` to see what the scan found, which Blueprints were affected, and whether checkout and repair succeeded.
3. Review the Blueprints marked for saving and save them manually. If checkout failed, resolve write access first.

## Scope and limitations

The plugin only handles component contamination where CreationMethod is marked Instance. Components created dynamically by Construction Script and non-Actor Blueprints are outside its scan scope.

Repairs may involve several Blueprint assets. Review logs, checkout status, and final saved content. Other inheritance, compilation, or component problems require separate diagnosis.


See [Repair Inherited Components](/en/works/simple-bp-inherit-fix/docs/repair-components/) for the procedure and checkout troubleshooting.

## Technical Details

See the [user guide](/en/works/simple-bp-inherit-fix/docs/find-components/) for CreationMethod, inheritance chains, and SCS / ICH diagnosis and repair.

## Contact and Support

For usage questions or collaboration inquiries, visit the contact page.

- **Contact:** [Contact and Collaboration](https://mzsh.me/contact/)

## Compatibility

Supports Unreal Engine 5.2–5.8.
