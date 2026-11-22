---
title: Update Files from a Configuration
type: doc
slug: simple-file-updater-update-files
draft: false
sitePublish: true
tags:
  - File updates
  - Automation
workIds:
  - simple-file-updater
documentKind: product-manual
websiteRoute: /en/works/simple-file-updater/docs/update-files/
lang: en
translationKey: doc:simple-file-updater:update-files
sourceHash: fa703c86f3a212c07c3228580c92db65451442fae3907c1f7c879460a56afc64
translationStatus: translated
generatedBodyHash: 9b250927f9cbb41d93549887d86db57d35a6710a01ab62e76443880fb9401fb1
docPage:
  work: simple-file-updater
  group: updates
  slug: update-files
  order: 1
---

## Write the Update List

The default configuration file is **`.SimpleFileUpdater`**, with the following format:

```
# 每行一个映射：本地路径 = 远程 URL
Tools\MyTool.exe = https://example.com/releases/MyTool.exe
Docs\Manual.pdf  = https://cdn.example.com/docs/Manual.pdf
```
- Supports relative or absolute paths
- Automatically creates the required folders
- Supports comments beginning with `#`

## Run the Update and Check the Results

Place `SimpleFileUpdater.exe` and `.SimpleFileUpdater` in the same directory, then:

- **Double-click `SimpleFileUpdater.exe`** to automatically read the configuration and synchronize the required files
- Or run it from the command line:

```bash
SimpleFileUpdater.exe MyConfig.txt
```
After execution, the program remains in the console and waits for you to press Enter to view the results.

## Before Overwriting Files

This is a personal utility; you assume the risks of using it. Verify the remote URLs and local target paths before running an update. Back up any existing files that it might overwrite.
