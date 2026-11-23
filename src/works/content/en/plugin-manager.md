---
title: UEPluginManager
description: Browse project and engine plugins together, fix garbled directory names, and move plugins between the project and the engine Marketplace directory.
type: work
slug: plugin-manager
categoryId: open-source-tools
categoryName: Open-source tools
categoryOrder: 1
order: 2
status: Official documentation
featured: false
draft: false
sitePublish: false
tags:
  - UnrealEngine
  - Plugins
  - Dependency analysis
links:
  - label: GitHub
    href: https://github.com/MZSH-Tools/UEPluginManager
lang: en
translationKey: plugin-manager
sourceHash: 9b0281407c3d970af01c475cc736d26037a1c0ef93964f3290d611fa3fe25d69
translationStatus: translated
generatedBodyHash: f0f361b48d6c7ee2bffc9e3b40a99321c5fc19f55baea623950a8d3c07230f1f
workInfo:
  channels:
    - kind: open-source
      href: https://github.com/MZSH-Tools/UEPluginManager
    - kind: docs
      href: /en/works/plugin-manager/docs/setup/
websiteCoverUrl: /media/covers/works/plugin-manager-20261101.webp
coverAlt: UEPluginManager cover
docIds:
  - plugin-manager-setup
  - plugin-manager-find
  - plugin-manager-enable-disable
  - plugin-manager-folder-actions
  - plugin-manager-updates-2026-01-10
---

## Overview

UEPluginManager is a desktop tool for browsing and managing local UE plugins. Find a plugin by source (Project, Marketplace, or Engine), check for duplicates and dependencies, then change its enabled state or organize its folder.

You can move project and Marketplace plugins between permitted folders, send them to the Recycle Bin, or fix garbled folder names. You can browse bundled engine plugins and inspect their status.

## Background and goals

Plugins may be installed in different project, Marketplace, or engine locations. When names conflict, enabling fails, or dependencies are unclear, inspecting one directory can miss the version actually in effect.

The work first displays plugin sources and relationships, then provides explicit actions for .uproject changes or directory organization, helping users understand the scope before changing it.

## Core capabilities

### Aggregating and searching sources

The tool brings together project, Marketplace, and engine plugins, supports searching by name, author, dependencies, and other information, and flags duplicate-name conflicts. It can detect installed and source-built engines.

### Dependencies and state management

Users can inspect what a plugin depends on and which plugins depend on it. Enabling or disabling modifies the project's .uproject configuration; the interface asks for confirmation when dependencies cause cascading changes.

Restore defaults removes explicit project settings so plugins return to their default states, useful when reviewing configuration left by temporary toggles.

### Directory organization

Project and Marketplace plugins can move between permitted locations, be sent to the recycle bin, or have garbled directory names corrected. Opening directories and reloading the list help compare with disk state.

Bundled engine plugins are available for browsing and state assessment, not moving or deletion.

## Use cases

It helps investigate why a plugin is ineffective, where a same-named plugin came from, or which dependencies an enable-state change affects. Before adjusting installation directories, users can confirm targets through source and relationship views.

## Scope and limitations

Run the tool in the target UE project directory. Close the editor before moving, deleting, or correcting directories to avoid inconsistencies between an open project and disk state.

Enabled-state changes, read-only attribute handling, and directory operations affect the local project. Inspect .uproject, plugin directories, and project startup afterward.

For operation steps and parameter details, see the [user guide](/en/works/plugin-manager/docs/find/).
