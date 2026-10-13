---
title: UEPluginManager
description: Browse project, Marketplace, and engine plugins together, inspect dependencies, and manage plugin state.
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
sourceHash: 8274f8b133262f7ed6e1bbf330bf85dca8fcebd4679a21a72c11af10b400b91e
translationStatus: translated
generatedBodyHash: 5a7933b1170ed1d075f38b0c562337eb6963f48be8eb52b6a761c98a048925d4
---

## Overview

UEPluginManager is a desktop tool for viewing and managing UE plugins centrally. It brings project Plugins directories, Marketplace download directories, and bundled engine plugins into one interface, supporting search, dependency inspection, duplicate-name warnings, and enabled-state management.

For actionable project and Marketplace plugins, it also supports moving, sending to the recycle bin, and correcting directory names.

## Background and goals

Plugins may be installed in different project, Marketplace, or engine locations. When names conflict, enabling fails, or dependencies are unclear, inspecting one directory can miss the version actually in effect.

The work first displays plugin sources and relationships, then provides explicit actions for .uproject changes or directory organization, helping users understand the scope before changing it.

## Core capabilities

### Aggregating and searching sources

The tool scans project, Marketplace, and engine plugins automatically and groups them by source. Lists support searches by name, author, category, description, dependencies, and dependents, with multiple keywords narrowing results. Installed and source engines have corresponding detection methods, and duplicate-name conflicts appear in the list.

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
