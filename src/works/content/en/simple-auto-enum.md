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
  - simple-auto-enum-guide
sourceDate: 2025-10-12
lang: en
translationKey: simple-auto-enum
sourceHash: 10ee302860ec9a92a9bd9f66663567b0dc988870d15dd42355e21bb941f444fc
translationStatus: translated
generatedBodyHash: a4120017b0b891a65cc3ab64e5627ddc4b3b1f021b4c00a5d1a807c934491b19
workInfo:
  channels:
    - kind: sale
      href: https://www.fab.com/zh-cn/listings/2d104382-60b1-4da6-86c6-ed93997f9c0a
    - kind: docs
      href: /docs/zh/guides/ue-tools/simple-auto-enum-guide/
  compatibility:
    - platforms:
        - Windows (Win64)
        - macOS
        - Linux
        - Android
        - iOS
      requirements:
        - UE 5.2–5.8
---

## Overview

SimpleAutoEnum declares bindings between configuration arrays and UE enums with macros, reducing repeated initialization and configuration change handling for each enum.

It supports one-to-one bindings, multiple arrays in different ranges of one enum, and several enums sharing one configuration array.

## Background and goals

Mapping configuration to enum reflection data in UE normally requires defining configuration classes, initializing enums in a subsystem, and writing similar update logic for configuration changes. As enums and settings grow, this code becomes repetitive and difficult to inspect.

The tool concentrates binding relationships in macro declarations and supplies data validation and logs to help maintain multiple bindings.

## Core capabilities

### Declaring array and enum bindings

For one-to-one cases, a macro maps an array in a specified configuration class to the target enum. New bindings still require target enum and configuration property definitions, but each group no longer needs a complete set of repeated initialization calls.

### Combining ranges and sharing sources

To place several configuration groups in one enum, arrays can receive separate enum ranges. Several enums can also reference the same array. These approaches match bindings to configuration structure without requiring every project to use one array per enum.

### Data validation and logs

The tool handles empty values, duplicates, and range boundaries, and logs binding registration, results, and duplicate values. Callers can inspect whether configuration reached enums as expected, then verify results in the Blueprints and workflows using them.

## Use cases

It suits C++ projects where several UE enums receive entries from Project Settings arrays and bindings or combined sources frequently change. It particularly reduces repeated maintenance of similar enum initialization logic.

## Scope and limitations

Projects must correctly define configuration classes, target enums, and range boundaries, and check that empty and duplicate value handling meets business expectations.

Dynamically changing enum contents may affect existing Blueprint references and persisted data. Projects must validate compatibility; successful binding logs alone do not establish safety.

For operation steps and parameter details, see the [user guide](/en/docs/guides/ue-tools/simple-auto-enum-guide/).
