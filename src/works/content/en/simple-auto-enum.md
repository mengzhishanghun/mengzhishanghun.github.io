---
title: SimpleAutoEnum
description: Bind configuration arrays to enum ranges through macros to reduce repeated initialization code.
type: work
slug: simple-auto-enum
categoryId: ue-plugins
categoryName: UE plugins
categoryOrder: 0
order: 8
status: Official documentation
featured: false
draft: false
sitePublish: false
tags:
  - Configuration management
  - Enums
  - Simple series
sourcePlatform: CNBlogs
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19136345
links:
  - label: Original article on CNBlogs
    href: https://www.cnblogs.com/mengzhishanghun/p/19136345
docIds:
  - simple-auto-enum-config-binding
  - simple-auto-enum-blueprints-and-assets
sourceDate: 2025-10-12
lang: en
translationKey: simple-auto-enum
sourceHash: 109555eb2e93cbfd23ff7ba7e5a1de9435514d4cbf35a2b803d334253a4e51e5
translationStatus: translated
generatedBodyHash: f830144ffe263c8fd3cb96623beb986abd75817118ea102665f8dfbb5b2d7be6
workInfo:
  channels:
    - kind: sale
      href: https://www.fab.com/zh-cn/listings/2d104382-60b1-4da6-86c6-ed93997f9c0a
    - kind: docs
      href: /en/works/simple-auto-enum/docs/config-binding/
  compatibility:
    - platforms:
        - Windows (Win64)
        - macOS
        - Linux
        - Android
        - iOS
      requirements:
        - UE 5.2–5.8
websiteCoverUrl: /media/covers/works/simple-auto-enum-20261101.webp
coverAlt: SimpleAutoEnum cover
---

## Overview

SimpleAutoEnum declares bindings between configuration arrays and UE enums with macros, reducing repeated initialization and configuration change handling for each enum.

It supports one-to-one bindings, multiple arrays in different ranges of one enum, and several enums sharing one configuration array.

## Background and goals

Mapping configuration to enum reflection data in UE normally requires defining configuration classes, initializing enums in a subsystem, and writing similar update logic for configuration changes. As enums and settings grow, this code becomes repetitive and difficult to inspect.

Once the macros declare your bindings, use configuration validation and logs to check that each one behaves as expected.

## Core capabilities

### Declaring array and enum bindings

For one-to-one cases, a macro maps an array in a specified configuration class to the target enum. New bindings still require target enum and configuration property definitions, but each group no longer needs a complete set of repeated initialization calls.

Define the `UDeveloperSettings` class and the target enum in C++. Then use `SIMPLE_BIND_ENUM_TO_CONFIG` to bind the class’s `TArray<FString>` between the specified enum boundaries. These declarations require C++.

### Combining ranges and sharing sources

To place several configuration groups in one enum, arrays can receive separate enum ranges. Several enums can also reference the same array. These approaches match bindings to configuration structure without requiring every project to use one array per enum.

### Data validation and logs

The tool handles empty values, duplicates, and range boundaries, and logs binding registration, results, and duplicate values. Callers can inspect whether configuration reached enums as expected, then verify results in the Blueprints and workflows using them.

The plugin filters out empty and whitespace-only entries, removes duplicates, and prevents configuration values from overriding boundary names. Check `LogSimpleAutoEnum` when a binding produces unexpected results.

## Use cases

It suits C++ projects where several UE enums receive entries from Project Settings arrays and bindings or combined sources frequently change. It particularly reduces repeated maintenance of similar enum initialization logic.

## Workflow

1. Declare the settings array, enum, and its boundaries, then add the macro binding. For example, bind `WeaponsList` between `None` and `MAX` in `EWeaponType`.
2. In Project Settings, add `剑` (sword), `斧` (axe), `弓` (bow), and `法杖` (staff) to `WeaponsList`. The generated entries sit between the two boundaries, which stay in place.
3. Compare the Project Settings input with the runtime result, then check the Blueprints and data assets that use the enum.

![](/media-occurrence/work%3Asimple-auto-enum%3Amedia%3A1)

![](/media-occurrence/work%3Asimple-auto-enum%3Amedia%3A2)

[See the limitations for Blueprints and data assets](/en/works/simple-auto-enum/docs/blueprints-and-assets/)

## Scope and limitations

Projects must correctly define configuration classes, target enums, and range boundaries, and check that empty and duplicate value handling meets business expectations.

Dynamically changing enum contents may affect existing Blueprint references and persisted data. Projects must validate compatibility; successful binding logs alone do not establish safety.

See the [user guide](/en/works/simple-auto-enum/docs/config-binding/) for macro binding, configuration examples, and manual initialization.

After enum names or positions change, values in Blueprint functions may not update automatically. Right-click the function, select **Refresh**, and check the result. Data assets store enum indices, so reordering existing entries may make a saved default point to a different entry. Prefer appending entries when existing data must remain compatible.

## Compatibility, Language, and Support

Supports Unreal Engine 5.2–5.8.

Open **Edit → Project Settings**, go to SimpleAutoEnum settings, and set **Language** to **English** or **Chinese**. English is the default. User-facing interfaces, prompts, notifications, and functional logs update immediately without restarting the editor; public API names and module startup/shutdown logs always remain in English.

For usage questions or collaboration inquiries, visit the contact page.

- **Contact:** [Contact and Collaboration](https://mzsh.me/contact/)

## Documentation Source

The original article was published on [CNBlogs](https://www.cnblogs.com/mengzhishanghun/p/19136345) on 2025-10-12.
