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
sourceHash: 1a7aed5a12091dbcca022cf6331806647488aac776db4f7d24a9cbbceaf95f8b
translationStatus: translated
generatedBodyHash: 36bfaa00d679b4b3a01462b31c5a69fc0087102740375e0e14f24497f7bf6f9d
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

The four `CreationMethod` values describe different component origins:

| Value | Creation origin |
| --- | --- |
| `Native` | Components created by native C++ code |
| `SimpleConstructionScript` | Components defined in the Blueprint Components panel |
| `UserConstructionScript` | Components created in the Construction Script |
| `Instance` | Components added to a specific Actor instance |

The check targets the specific abnormality of Blueprint component templates incorrectly marked `Instance`. Manual repair is difficult because the same inheritance relationship may involve both SCS nodes and ICH override records, several parent and child levels may be affected, and the field cannot be changed directly in the Details panel. Assets under source control also require individual writability handling.

Scanning follows `ParentClass` upward to collect parent Blueprints and uses Asset Registry `GetDerivedClassNames()` downward to locate derived classes. Component checks cover SCS `AllNodes` and ICH `CreateRecordIterator()` rather than changing only the currently open template.

Investigation found that this class of abnormalities was associated with component templates whose `CreationMethod` was set to `Instance`. A stable reproduction sequence for the triggering operation was not established, so similar symptoms alone cannot establish the cause; the field state still needs to be checked.

Using the affected Blueprint as an anchor, parent Blueprints were collected upward and derived Blueprints downward. The combined, deduplicated set formed the inspection scope, covering both parent templates and child override records.

SCS and ICH were scanned separately for each Blueprint to locate abnormal component templates with `CreationMethod == Instance`. Once the findings were confirmed, the affected assets were checked out and the corresponding fields restored to `SimpleConstructionScript`.

After modification, the affected Blueprints were marked dirty for the user to review and save. Components dynamically created by the Construction Script require separate assessment and should not automatically receive the same repair.

## Final Summary

The work established a process for collecting the inheritance chain, scanning both storage locations, checking out assets, correcting the field, and marking assets for saving, giving this class of issues a defined inspection and repair scope.

This process targets abnormal component template creation methods. Similar symptoms require inspection of the component records before deciding whether to apply the same repair.
