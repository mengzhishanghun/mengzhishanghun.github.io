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
  - Simple series
sourcePlatform: CNBlogs
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19770930
links:
  - label: Original article on CNBlogs
    href: https://www.cnblogs.com/mengzhishanghun/p/19770930
docIds:
  - simple-config-exclude-setup
  - simple-config-exclude-staging-rules
  - simple-config-exclude-copy-excluded
sourceDate: 2026-03-25
lang: en
translationKey: simple-config-exclude
sourceHash: 3d007c9b6674776ac409af2f8604f428901059fb661b3746fd2ba83f361e2baa
translationStatus: translated
generatedBodyHash: c077446e9f93cb295bc6ddd5732befb988df06a219e2ce3ad280d48feeb2a168
workInfo:
  channels:
    - kind: sale
      href: https://www.fab.com/listings/05c2cb8f-cabc-45ef-84e0-9eac988b5a35
    - kind: docs
      href: /en/works/simple-config-exclude/docs/setup/
websiteCoverUrl: /media/covers/works/simple-config-exclude-20261101.webp
coverAlt: SimpleConfigExclude cover
---

## Overview

SimpleConfigExclude is an editor plugin for UE project packaging configuration. It lists ini files in the Config directory in Project Settings, allowing each to use default behavior, forced inclusion, or exclusion, and synchronizes those choices to packaging Staging rules.

Excluded files can also be copied to another target directory as needed for later deployment.

## Background and goals

Projects often need different configurations for debugging, testing, and production. Manually maintaining inclusion and exclusion entries in DefaultGame.ini requires attention to file paths, existing rules, and editor caches.

Users can choose, file by file, which configurations ship with a package, then deliver excluded files separately as needed.

## Core capabilities

### Three-state selection

Each file can be Default, Allowed, or Disallowed. Default follows UE's existing behavior; Allowed and Disallowed explicitly request inclusion and exclusion respectively.

The plugin builds the list by scanning `Config`. After adding or deleting INI files, click **Refresh Config List** to update it.

### Synchronizing Staging rules

Changing a file’s state updates the `[Staging]` rules in `DefaultGame.ini`. UE reads those rules when it packages the project.

These changes to project configuration should still receive normal version review.

### Copying excluded files

For ini files omitted from the base package but needed by some deployment environments, the tool supports copying to a specified directory. Users must confirm the destination and whether to clean its Config directory, then check output against the actual deployment environment.

## Use cases

Development configuration, such as debug switches, profiling parameters, test server addresses, and development keys, can be excluded from production packages by file. Internal plugin configuration that does not need to ship can also be managed separately. When testing and production need different configuration sets, projects can first generate a base package without those files, then handle excluded items by environment and review packaging rules and deployment steps separately.

## How to use it

1. [Install the plugin and open its settings](/en/works/simple-config-exclude/docs/setup/). Find `Config/DefaultDebugSettings.ini` and set it to **Disallowed**.
2. Package the project and check the output directory to confirm the debug configuration was left out.
3. If the test environment still needs the file, set the destination and [copy the excluded files](/en/works/simple-config-exclude/docs/copy-excluded/). **Clean Config Before Copy** is on by default. It deletes the destination’s `ProjectName/Config/` directory before copying the files marked **Disallowed**. Turn off cleaning first if the destination contains files you want to keep.

## Scope and limitations

The plugin manages packaging rules and copying for ini files under Config.

Exclusion does not complete sensitive information protection: destination copies still need project access controls. State changes modify DefaultGame.ini. Before release, check actual package contents, copy destinations, and version control diffs.

See the [usage guide](/en/works/simple-config-exclude/docs/staging-rules/) for steps and parameters.

## Language and Support

Open **Edit → Project Settings**, go to SimpleConfigExclude settings, and set **Language** to **English** or **Chinese**. English is the default. User-facing interfaces, prompts, notifications, and functional logs update immediately without restarting the editor; public API names and module startup/shutdown logs always remain in English.

For usage questions or collaboration inquiries, visit the contact page.

- **Contact:** [Contact and Collaboration](https://mzsh.me/contact/)
