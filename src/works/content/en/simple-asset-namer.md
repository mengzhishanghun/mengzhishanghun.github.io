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
  - simple-asset-namer-setup
  - simple-asset-namer-naming-rules
  - simple-asset-namer-rename-assets
sourceDate: 2026-03-25
lang: en
translationKey: simple-asset-namer
sourceHash: bc2b3fcb86446816a063aea77e1528f7e578e1fa6dea7224fd239d5205ee39c4
translationStatus: translated
generatedBodyHash: 6ee83a5644f6076b735c762eb80871c3899161c3dee0a2e08fd398003cb06f72
workInfo:
  channels:
    - kind: sale
      href: https://www.fab.com/listings/f7c4474c-9a9d-455a-a948-d46d557b457d
    - kind: docs
      href: /en/works/simple-asset-namer/docs/setup/
websiteCoverUrl: /media/covers/works/simple-asset-namer-20261101.webp
coverAlt: SimpleAssetNamer cover
---

## Overview

SimpleAssetNamer provides type- and path-based naming rules for UE assets. It checks new names on creation, import, or manual rename, and supports batch renaming of assets in existing directories.

Set prefixes and suffixes, choose separators, and tell the plugin which old affixes to recognize. Rename results list successes, skipped assets, and errors separately.

## Background and goals

Blueprints, meshes, materials, and other assets often require different prefixes. Manual naming can mix capitalization, separators, and old conventions, while reorganizing many existing assets individually is time-consuming.

The work places conventions in configurable rules and supplies path filters, letting teams limit where rules apply and handle existing assets gradually.

## Core capabilities

### Generating names by type

Apply prefix, suffix, and separator rules by asset type. Historical affixes can also be recognized to help migrate from old naming conventions.

### Automatic and batch processing

You can enable automatic renaming on creation or import separately from the check after a manual rename. Apply the same rules in batches to selected assets or a folder in the Content Browser.

### Path and result controls

Path filters limit the scope, and successful, skipped, and failed results are reported separately so users can check assets that were not processed.

## Use cases

It suits consistent naming in multi-person projects and migration from old affixes to new rules. Projects introducing conventions gradually can first verify selected content directories before expanding coverage.

## How to use it

1. [Install the plugin and open its settings](/en/works/simple-asset-namer/docs/setup/). Check the asset types, affixes, and paths. For example, with the default Blueprint prefix `BP`, you can try renaming `MyCharacter` to `BP_MyCharacter`.
2. Start with a small batch of existing assets. Right-click your selection and choose **Simple Asset Namer → Auto Rename**. To process a whole folder, use **Auto Rename All Assets**.
3. Compare the old and new names in the results window, then look at why any assets were skipped or failed. Check asset references after batch renames.

See [automatic and batch renaming](/en/works/simple-asset-namer/docs/rename-assets/) for details.

## Scope and limitations

Renaming changes asset names and may affect references. Check paths, rules, and version control state before batch operations in particular.

The tool reports naming operation results. Projects must still check references, levels, and scripts. Assets without matching rules or with target name conflicts cannot be assumed to be handled automatically.

See the [usage guide](/en/works/simple-asset-namer/docs/naming-rules/) for steps and parameters.

## Compatibility and Support

Supports Unreal Engine 5.2–5.8.

For usage questions or collaboration inquiries, visit the contact page.

- **Contact:** [Contact and Collaboration](https://mzsh.me/contact/)
