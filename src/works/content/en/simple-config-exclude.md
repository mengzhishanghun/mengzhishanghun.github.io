---
title: SimpleConfigExclude
description: Manage default, included, and excluded configuration files in Project Settings and copy excluded files.
type: work
slug: simple-config-exclude
categoryId: ue-plugins
categoryName: UE plugins
categoryOrder: 0
order: 11
status: Official documentation
featured: false
draft: false
sitePublish: false
tags:
  - Packaging
  - Configuration management
sourcePlatform: CNBlogs
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19770930
links:
  - label: Original article on CNBlogs
    href: https://www.cnblogs.com/mengzhishanghun/p/19770930
docIds:
  - simple-config-exclude-guide
sourceDate: 2026-03-25
lang: en
translationKey: simple-config-exclude
sourceHash: 564727a75be4a362ed74077b35b9753be17cb7e7d9ca39dd24d61a71bc135033
translationStatus: translated
generatedBodyHash: 85f5062b6cb4ddcae149c7bc8870128c7d4e273c810c0281e22fa7c81f359e80
---

## Overview

SimpleConfigExclude is an editor plugin for UE project packaging configuration. It lists ini files in the Config directory in Project Settings, allowing each to use default behavior, forced inclusion, or exclusion, and synchronizes those choices to packaging Staging rules.

Excluded files can also be copied to another target directory as needed for later deployment.

## Background and goals

Projects often need different configurations for debugging, testing, and production. Manually maintaining inclusion and exclusion entries in DefaultGame.ini requires attention to file paths, existing rules, and editor caches.

The plugin aims to let users choose, file by file, which configurations ship with a package, while providing a separate action for delivering excluded files.

## Core capabilities

### Three-state selection

Each file can be Default, Allowed, or Disallowed. Default follows UE's existing behavior; Allowed and Disallowed explicitly request inclusion and exclusion respectively.

The Project Settings list comes from scanning Config, making it easier to compare with actual files and check for omissions.

### Synchronizing Staging rules

The plugin reads the Staging section in DefaultGame.ini, recognizes existing rules, and writes corresponding entries after state changes. It handles version control checkout or read-only state before writing and reloads configuration afterward so the settings panel matches disk content.

These changes to project configuration should still receive normal version review.

### Copying excluded files

For ini files omitted from the base package but needed by some deployment environments, the tool supports copying to a specified directory. Users must confirm the destination and whether to clean its Config directory, then check output against the actual deployment environment.

## Use cases

It suits excluding debug configuration from production packages or preparing different configuration sets for testing and production. Projects can generate a base package without certain files, then handle excluded items separately by environment, making packaging rules and deployment steps easier to review independently.

## Scope and limitations

The plugin manages packaging rules and copying for ini files under Config.

Exclusion does not complete sensitive information protection: destination copies still need project access controls. State changes modify DefaultGame.ini. Before release, check actual package contents, copy destinations, and version control diffs.
