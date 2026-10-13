---
title: Repairing Component State Contamination in Blueprint Inheritance
description: Checking component template CreationMethod values along the inheritance chain to address child property changes affecting the parent.
type: case
slug: blueprint-inheritance-repair
categoryId: ue-projects
categoryName: Unreal Engine Projects
categoryOrder: 0
order: 7
status: Completed
featured: false
draft: false
sitePublish: true
tags:
  - Blueprints
  - Inheritance chain
  - Component repair
coverAlt: Inheritance scanning and CreationMethod correction workflow for parent and child Blueprint component templates
websiteCoverUrl: /assets/cases/blueprint-inheritance-repair.png
lang: en
translationKey: blueprint-inheritance-repair
sourceHash: 0043a545fa8f9881fe873391a091c58a4d052a8a6285a890593e5a8df6019cca
translationStatus: translated
generatedBodyHash: 082f246399b3271267bb353ca85443c2092c5e30ec347dba588b0d4f59442657
---

## Background

While troubleshooting Actor Blueprint inheritance, I recorded a class of abnormal component states: components in a parent Blueprint could not be deleted normally, and changes to component properties in a child Blueprint also affected the parent.

The work centered on component templates and inheritance relationships. Its goal was to identify abnormal records and correct their creation method, avoiding a fix limited to the one Blueprint currently visible.

## Reproduction Environment

The issue involved Actor Blueprints, SimpleConstructionScript (SCS), and InheritableComponentHandler (ICH) in Unreal Engine. SCS stores components directly defined by a Blueprint, while ICH stores child Blueprint overrides of inherited components.

Blueprint assets may also be under source control, so the relevant .uasset files need to be checked for writability before repair.

## Specific Problem

In the parent Blueprint, cut or delete menu actions became unavailable for components that originally belonged to it. In a child Blueprint, even changing a single property could write back to the parent template, breaking the expected isolation of overrides.

## Solution

Investigation found that this class of abnormalities was associated with component templates whose `CreationMethod` was set to `Instance`. A stable reproduction sequence for the triggering operation was not established, so similar symptoms alone cannot establish the cause; the field state still needs to be checked. For the component template and inheritance override investigation, [read the troubleshooting and repair details](https://mzsh.me/blog/cnblogs-20030737/).

Using the affected Blueprint as an anchor, parent Blueprints were collected upward and derived Blueprints downward. The combined, deduplicated set formed the inspection scope, covering both parent templates and child override records.

SCS and ICH were scanned separately for each Blueprint to locate abnormal component templates with `CreationMethod == Instance`. Once the findings were confirmed, the affected assets were checked out and the corresponding fields restored to `SimpleConstructionScript`.

After modification, the affected Blueprints were marked dirty for the user to review and save. Components dynamically created by the Construction Script require separate assessment and should not automatically receive the same repair.

## Final Summary

The work established a process for collecting the inheritance chain, scanning both storage locations, checking out assets, correcting the field, and marking assets for saving, giving this class of issues a defined inspection and repair scope.

This process targets abnormal component template creation methods. Similar symptoms require inspection of the component records before deciding whether to apply the same repair.
