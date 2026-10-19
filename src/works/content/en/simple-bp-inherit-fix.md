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
sourceHash: 3ed6a84109df9d36918dd8188a47ac108a5f7e2194360da1ac51bfc4e43dfdd6
translationStatus: translated
generatedBodyHash: 6fe8b2dc51f66c7d3576cdbc3f98f5d3ce6aef4241a87e97a0d826eacac74265
workInfo:
  channels:
    - kind: sale
      href: https://www.fab.com/listings/320c7471-92b8-4a3e-a88a-2a5fcb98d620
    - kind: docs
      href: /docs/zh/guides/ue-tools/simple-bp-inherit-fix-guide/
  compatibility:
    - platforms:
        - Windows (Win64)
        - macOS
        - Linux
      requirements:
        - UE 5.2–5.8
---

## Overview

SimpleBPInheritFix is an editor plugin for abnormal component states in Actor Blueprint inheritance chains.

When a component's creation method is incorrectly marked Instance, parent components may lose their normal cut and delete actions, and changes in a child may affect its parent. Starting from an affected Blueprint, the plugin examines its inheritance chain, locates this kind of contamination, and corrects the component creation method.

## Background and goals

These problems span several related Blueprints, so inspecting only the current one can make the origin difficult to identify. Repairing only the open asset may also miss similar states in ancestors or descendants.

The tool organizes scanning, checkout, and repair around the complete inheritance chain, allowing component and asset scope to be checked in logs. It targets a specific component state problem rather than general Blueprint troubleshooting.

## Core capabilities

### Inheritance chain scanning and diagnosis

Starting from an affected Actor Blueprint in the chain, it checks component states in ancestors, the current Blueprint, and descendants. Logs list inspection stages, abnormal components found, and their owning Blueprints so users can assess the actual scope.

If the target state is not found, other component failures should not be described as repaired.

### Targeted repair and asset saving

For matching components, the tool changes CreationMethod from Instance back to SimpleConstructionScript. It attempts version control checkout before repair and marks affected Blueprints for saving afterward. Saving must still be completed in the editor.

If checkout fails, an in-memory repair does not mean disk assets have been updated. Resolve write access first and verify the saved result.

## Use cases

It helps investigate components that become difficult to edit after Actor Blueprint inheritance, or child operations that affect parents.

In projects with several inheritance levels, chain scanning helps locate affected assets. Logs and the pending-save list provide clues for version control checks before and after changes.

## Scope and limitations

The plugin only handles component contamination where CreationMethod is marked Instance. Components created dynamically by Construction Script and non-Actor Blueprints are outside its scan scope.

Repairs may involve several Blueprint assets. Review logs, checkout status, and final saved content. Other inheritance, compilation, or component problems require separate diagnosis.

For the principles behind CreationMethod, SCS, and ICH inspection and repair, see [Component State Contamination in Blueprint Inheritance and How to Repair It](/en/blog/cnblogs-20030737/).

See the [usage guide](/en/docs/guides/ue-tools/simple-bp-inherit-fix-guide/) for steps and parameters.
