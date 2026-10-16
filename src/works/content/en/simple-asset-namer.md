---
title: SimpleAssetNamer
description: Apply automatic and batch asset renaming using asset type and path rules.
type: work
slug: simple-asset-namer
categoryId: ue-plugins
categoryName: UE plugins
categoryOrder: 0
order: 10
status: Official documentation
featured: false
draft: false
sitePublish: false
tags:
  - Asset management
  - Naming conventions
sourcePlatform: CNBlogs
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19770922
links:
  - label: Original article on CNBlogs
    href: https://www.cnblogs.com/mengzhishanghun/p/19770922
docIds:
  - simple-asset-namer-guide
sourceDate: 2026-03-25
lang: en
translationKey: simple-asset-namer
sourceHash: fa8201debf1edec57d54744e68940a1b3d8260e0ab6738128090628bbf6e61e5
translationStatus: translated
generatedBodyHash: 7f9405fef3c5bb76f13196cef851cf0dc9d2752c61aef1f361e6fe1b1a7f2dee
workInfo:
  channels:
    - kind: sale
      href: https://www.fab.com/listings/f7c4474c-9a9d-455a-a948-d46d557b457d
    - kind: docs
      href: /docs/zh/guides/ue-tools/simple-asset-namer-guide/
  compatibility:
    - platforms: []
      requirements:
        - UE 5.2–5.8
---
## Overview

SimpleAssetNamer provides type- and path-based naming rules for UE assets. It checks new names on creation, import, or manual rename, and supports batch renaming of assets in existing directories.

Rules include prefixes, suffixes, separators, and historical affixes. Results distinguish success, skipped items, and errors.

## Background and goals

Blueprints, meshes, materials, and other assets often require different prefixes. Manual naming can mix capitalization, separators, and old conventions, while reorganizing many existing assets individually is time-consuming.

The work places conventions in configurable rules and supplies path filters, letting teams limit where rules apply and handle existing assets gradually.

## Core capabilities

### Generating names by type

Different asset types can have prefixes and suffixes, with a chosen separator. The tool attempts to recognize existing affixes, extract the core name, and apply current rules. Historical affix lists recognize old forms and help prevent duplicate prefixes caused by simple concatenation.

### Automatic and batch processing

Automatic processing checks asset creation, import, and manual rename, while the batch action targets existing folders. Both generate names from current rules, supporting new and existing assets separately without requiring the whole vault of assets to be renamed at once.

### Path and result controls

Included and excluded paths determine scope. After a batch operation, the results dialog lists successful, skipped, and failed entries with reasons, such as an already compliant name, missing rule, or existing target name. Users can adjust rules or narrow scope accordingly.

## Use cases

It suits consistent naming in multi-person projects and migration from old affixes to new rules. Projects introducing conventions gradually can first verify selected content directories before expanding coverage.

## Scope and limitations

Renaming changes asset names and may affect references. Check paths, rules, and version control state before batch operations in particular.

The tool reports naming operation results. Projects must still check references, levels, and scripts. Assets without matching rules or with target name conflicts cannot be assumed to be handled automatically.
