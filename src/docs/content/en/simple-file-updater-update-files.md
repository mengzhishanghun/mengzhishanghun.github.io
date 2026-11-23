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
sourceHash: 773ef6b79c316b7dbd68910e2c22e26afd1ce3be1d99cc11687c29d3a575a6f6
translationStatus: translated
generatedBodyHash: 1ddfedb802d92b97c1c87da65bac557a88ec11662a99c8ca998985f265fb392f
docPage:
  work: simple-file-updater
  group: features
  slug: update-files
  order: 1
---

## Write the Update List

In the default configuration file, **`.SimpleFileUpdater`**, write one mapping per line. Put the local destination on the left of the equals sign and the download URL on the right:

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

This is a personal utility; you assume the risks of using it. Before running the update, verify that the remote URLs are trustworthy and the destination paths are correct. Back up any files already at those destinations, as the update may overwrite them.
