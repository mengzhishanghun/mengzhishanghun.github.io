---
title: Install and create the first binding
type: doc
slug: simple-auto-enum-quickstart
draft: false
sitePublish: true
tags:
  - Configuration
  - Enums
workIds:
  - simple-auto-enum
docPage:
  work: simple-auto-enum
  group: getting-started
  slug: quickstart
  order: 1
documentKind: product-manual
websiteRoute: /en/works/simple-auto-enum/docs/quickstart/
lang: en
translationKey: doc:simple-auto-enum:quickstart
sourceHash: 7136108c4ab3743b26e7570c4e6500bd9a74373a2d2466c840cd98266a9d2c09
translationStatus: translated
generatedBodyHash: ef47f3037ba2c0f8516c6482cd4912257530097bdfdde3760fed278e9635d54e
---

## Install and prepare

Install SimpleAutoEnum through the Epic Games Launcher for the UE version used by your project.

Find and enable SimpleAutoEnum in the editor's Plugins window, and restart the editor when prompted.

Initial setup requires C++: a configuration class derived from `UDeveloperSettings` with a `TArray<FString>` property, and a target enum with start and end boundaries. These declarations cannot be created using Blueprints alone.

## Create one binding

1. Follow [declare the enum and configuration array](/en/works/simple-auto-enum/docs/config-binding/) to create the configuration class, array, and bounded enum.
2. Use `SIMPLE_BIND_ENUM_TO_CONFIG` to bind the enum type, its boundaries, the configuration class, and the array property.
3. Enter array items in the Project Settings page for that class. For a weapon list, you could start with “Sword”, “Axe”, and “Bow”.
4. Compare the configuration with the runtime result and check that the entries appear between the intended boundaries. If an entry is missing, check empty values, duplicates, and boundaries, then review `LogSimpleAutoEnum`.

## Continue using the enum

Several arrays can fill separate ranges in one enum, and several enums can share an array. See the [enum binding guide](/en/works/simple-auto-enum/docs/config-binding/) for complete code and parameters.

Check enum values used by existing Blueprints and DataAssets separately. Changing names or order may affect existing data; prefer appending entries when compatibility must be preserved. See [use enums in Blueprints and DataAssets](/en/works/simple-auto-enum/docs/blueprints-and-assets/).
