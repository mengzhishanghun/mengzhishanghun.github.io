---
title: A Toolchain from Plugin Development to Release
description: Turning scattered development operations into dedicated tools for plugin management and multi-version packaging.
type: case
slug: plugin-release-workflow
categoryId: desktop-automation
categoryName: Desktop & Automation
categoryOrder: 1
status: Completed
featured: true
draft: false
sitePublish: true
tags:
  - UnrealEngine
  - Plugins
  - Automation
productIds:
  - plugin-auto-packer
  - plugin-manager
coverAlt: Flowchart of the toolchain from plugin development to release
websiteCoverUrl: /assets/cases/plugin-release-workflow.png
lang: en
translationKey: plugin-release-workflow
sourceHash: c407713a991c6ccbb9e79e7c4a0f570effa79fda8ad093fcc1af1f57d95584be
translationStatus: translated
generatedBodyHash: 51a01a8ca11737338421001e69206c4f1c8881fb563a4632889b43ab1ea6e963
---

## Background

During UE plugin development and release, I turned repeated operations in plugin discovery, dependency analysis, and multi-version packaging into two dedicated tools: UEPluginManager and UEPluginAutoPacker.

During development and release, the plugin manager can first inspect the project environment, then the packaging tool builds against configured engine versions and organizes the output.

## Reproduction Environment

The workflow targets UE plugin development. Plugins may be located in a project, a marketplace download directory, or an engine directory. Release preparation requires separate builds and output checks for different engine versions.

UEPluginAutoPacker currently targets Windows / Win64 and uses a valid .uplugin file and configured engine paths.

## Specific Problem

Plugins are distributed across several locations, and plugins with the same name and their dependencies affect assessment. Checking only one directory can miss the actual objects that need inspection.

Multi-version release preparation also requires repeatedly selecting engines, running builds, inspecting logs, and organizing files. When versions and outputs are mixed together, failure causes and delivery directories become harder to check.

## Solution

UEPluginManager brings together project, marketplace, and engine plugins. It supports search, shows dependency and dependent relationships, and warns about same-name conflicts. Plugin sources and relationships can be checked before changing plugin status or directories as needed.

UEPluginAutoPacker runs plugin builds separately for each configured engine, displays each version's status and logs, and organizes release files according to selected options. Success, failure, and cancellation are shown independently for each engine, making it easier to inspect a specific version.


The two tools can be used independently: the plugin manager checks the environment, and the multi-version packaging tool runs builds and organizes files.

A successful build still requires log review and testing in the target engine to assess compatibility. The packaging tool handles plugin packages; publishing a listing and packaging a complete UE project have their own workflows.

## Discuss your project

If you repeatedly manage UE plugins, package them for multiple engine versions, or organize release files, start with the tools linked to this case. If they do not cover your workflow, we can discuss custom development.

The plugin type, target engine versions, and delivery requirements will help identify which steps need additional support.

If you have a related project, [get in touch](https://mzsh.me/en/contact/) to discuss it.
