---
title: SimpleConfigExclude User Guide
description: Manage default, included, and excluded configuration states in project settings and copy excluded files.
type: doc
slug: simple-config-exclude-guide
categoryId: ue-tools
categoryName: UE Tools
categoryOrder: 0
order: 0
status: Official Documentation
date: 2026-03-25
draft: false
sitePublish: false
tags:
  - SimpleConfigExclude
  - UE Tools
sourcePlatform: CNBlogs
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19770930
links:
  - label: Original CNBlogs article
    href: https://www.cnblogs.com/mengzhishanghun/p/19770930
workIds:
  - simple-config-exclude
lang: en
translationKey: doc:simple-config-exclude-guide:supplement:1
sourceHash: 44dc60aa2d77f0f147308f11b78436c353660700b1aa704861ce8e38801e954e
translationStatus: translated
generatedBodyHash: 4da4e2320e51e018a5bbdbcc146806510453c36b1b5db584a09783fe9bbc7fd6
---

# SimpleConfigExclude User Guide

Choose inclusion/exclusion states for configuration files in project settings and copy excluded files as needed.

## Features and Parameters

### 1.1 Three-State Configuration Selector

The plugin offers three states for each configuration file:

| State | Meaning | Effect |
| --- | --- | --- |
| **Default** | Default | Follow UE's default behavior |
| **Allowed** | Force inclusion | Ensure the configuration file is packaged |
| **Disallowed** | Force exclusion | Ensure the configuration file is not packaged |

Each `.ini` file has a three-state control (`SSegmentedControl`) beside it in project settings; click to switch states.

### 1.2 Automatic Scanning and Application

The plugin's workflow is fully automated:

1.  **At editor startup**, automatically scan all `.ini` files under `Config`
2.  **Read existing rules** from the `[Staging]` section in `DefaultGame.ini`
3.  **Generate the configuration list** in the settings panel
4.  **Changes take effect immediately**: switching a state writes to `DefaultGame.ini` at once

State changes write back to configuration files and handle the relevant files' writable state.

### 1.3 Copy Excluded Files

Excluded configuration files do not appear in the packaged directory. Some scenarios require adding files manually after packaging, such as deployment to different environments.

The plugin provides **one-click copying**:

-   Configure the target directory (default: `/Windows`)
-   Click `Copy`
-   All configuration files marked `Disallowed` are copied to the target directory
-   Optionally clean the target Config folder before copying

Copying can supplement deployment with configuration files for different environments.

### 1.4 Safety Design

-   **Hide the plugin's own configuration**: Hide `DefaultSimpleConfigExclude.ini` by default to prevent accidental loss of plugin configuration
-   **Source control integration**: Automatically check out `DefaultGame.ini` before modifying it, supporting Perforce/Git
-   **Read-only protection**: Automatically remove the read-only attribute when source control is not used

## Installation and Configuration

### Step 1: Install the Plugin

Copy the plugin folder into your project's `Plugins` directory and restart the editor.

### Step 2: Open the Settings Panel

Path: `Edit > Project Settings > Plugins > Simple Config Exclude`

The panel has three areas:

1.  **Settings**: General settings, including hiding plugin configuration and cleaning the target directory before copying
2.  **Copy**: Copy excluded files to the target directory
3.  **Config Exclude Rules**: Configuration file list and three-state selectors

### Step 3: Configure Rules

1.  Find the configuration file to exclude
2.  Click `Disallowed` to exclude it
3.  Click `Allowed` for forced inclusion
4.  Changes take effect immediately; no additional save is needed

### Step 4: Verify Packaging

Package the project normally and check its `Config` output folder to confirm excluded files are absent.

* * *

## Configuration Examples

### Scenario 1: Exclude Debug Configuration

The project has `DefaultDebug.ini` storing debug parameters that production does not need:

```
DefaultDebug.ini → Disallowed
```

### Scenario 2: Multi-Environment Deployment

```
1. Mark test-environment configuration as Disallowed
2. Package a clean base version
3. Use Copy to copy excluded configuration to the test deployment directory
4. Production uses the packaged default configuration
```

### Scenario 3: Protect Sensitive Configuration

```
DefaultEncryption.ini → Disallowed  // 密钥配置不随包发布
DefaultServer.ini → Disallowed      // 服务器配置通过运维单独部署
```

## Notes

Changing configuration states writes to DefaultGame.ini. When copying excluded files, check the target directory and whether cleanup before copying is enabled.

---

Originally published on 2026-03-25 on [CNBlogs](https://www.cnblogs.com/mengzhishanghun/p/19770930).
