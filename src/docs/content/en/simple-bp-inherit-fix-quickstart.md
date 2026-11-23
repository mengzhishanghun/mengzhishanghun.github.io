---
title: Install and run the first repair
type: doc
slug: simple-bp-inherit-fix-quickstart
draft: false
sitePublish: true
tags:
  - Blueprint
  - Inheritance
workIds:
  - simple-bp-inherit-fix
docPage:
  work: simple-bp-inherit-fix
  group: getting-started
  slug: quickstart
  order: 1
documentKind: product-manual
websiteRoute: /en/works/simple-bp-inherit-fix/docs/quickstart/
lang: en
translationKey: doc:simple-bp-inherit-fix:quickstart
sourceHash: 735569d4fc5bd12dd680c4a41a83b0f41f838d678347b6100470941715a01335
translationStatus: translated
generatedBodyHash: 06805295300afeba109c0681f45140e982437454ed5723505058dc3fa1aa942d
---

## Install and enable

Install SimpleBPInheritFix through the Epic Games Launcher for the UE version used by your project.

Open the project, find and enable SimpleBPInheritFix in the editor's Plugins window, and restart the editor when prompted.

## Run the first repair

Start from a project version you can restore. Check the symptom: a parent Blueprint's components cannot be cut or deleted, or changes in a child Blueprint affect its parent. These symptoms can have other causes. Read about the [recognizable symptoms](/en/works/simple-bp-inherit-fix/docs/find-components/) first.

1. Right-click the affected Actor Blueprint in the Content Browser and select **Component Repair → Fix Inheritance Pollution**.
2. Filter the Output Log by `LogSBIF` to review affected components and Blueprints, checkout results, and repair results. The repair checks the full inheritance chain and may involve parent and child assets.
3. Review the dirty Blueprints and save them manually. Resolve write permissions if checkout fails; an in-memory repair does not mean the asset has been saved.

## Scope

The plugin handles inheritance pollution where a component template's `CreationMethod` was incorrectly marked as `Instance`. It does not cover non-Actor Blueprints, components created dynamically by a Construction Script, or other Blueprint errors.

See [repair inherited components](/en/works/simple-bp-inherit-fix/docs/repair-components/) for checkout handling and the repair workflow.
