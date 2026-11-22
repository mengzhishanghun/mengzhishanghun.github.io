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
  - Simple series
sourcePlatform: CNBlogs
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19770922
links:
  - label: Original article on CNBlogs
    href: https://www.cnblogs.com/mengzhishanghun/p/19770922
docIds:
  - simple-asset-namer-naming-rules
  - simple-asset-namer-rename-assets
sourceDate: 2026-03-25
lang: en
translationKey: simple-asset-namer
sourceHash: c25c9087b7c0af8ca4ab173138a9721d2a37bdd23241b7ce17d325001be32189
translationStatus: translated
generatedBodyHash: 1d84f77ed91c36e855d144198a96f0851bbfce869b16bbe16484c80b7641cd2b
workInfo:
  channels:
    - kind: sale
      href: https://www.fab.com/listings/f7c4474c-9a9d-455a-a948-d46d557b457d
    - kind: docs
      href: /en/works/simple-asset-namer/docs/naming-rules/
  compatibility:
    - platforms:
        - Windows (Win64)
        - macOS
        - Linux
      requirements:
        - UE 5.2–5.8
websiteCoverUrl: /media/covers/works/simple-asset-namer-20261101.webp
coverAlt: SimpleAssetNamer cover
---

## Overview

SimpleAssetNamer provides type- and path-based naming rules for UE assets. It checks new names on creation, import, or manual rename, and supports batch renaming of assets in existing directories.

Rules include prefixes, suffixes, separators, and historical affixes. Results distinguish success, skipped items, and errors.

## Background and goals

Blueprints, meshes, materials, and other assets often require different prefixes. Manual naming can mix capitalization, separators, and old conventions, while reorganizing many existing assets individually is time-consuming.

The work places conventions in configurable rules and supplies path filters, letting teams limit where rules apply and handle existing assets gradually.

## Core capabilities

### Generating names by type

Apply prefix, suffix, and separator rules by asset type. Historical affixes can also be recognized to help migrate from old naming conventions.

### Automatic and batch processing

Automatic processing checks asset creation, import, and manual rename, while the batch action targets existing folders. Both generate names from current rules, supporting new and existing assets separately without requiring the whole vault of assets to be renamed at once.

### Path and result controls

Path filters limit the scope, and successful, skipped, and failed results are reported separately so users can check assets that were not processed.

## Use cases

It suits consistent naming in multi-person projects and migration from old affixes to new rules. Projects introducing conventions gradually can first verify selected content directories before expanding coverage.

## Scope and limitations

Renaming changes asset names and may affect references. Check paths, rules, and version control state before batch operations in particular.

The tool reports naming operation results. Projects must still check references, levels, and scripts. Assets without matching rules or with target name conflicts cannot be assumed to be handled automatically.

See the [usage guide](/en/works/simple-asset-namer/docs/naming-rules/) for steps and parameters.
