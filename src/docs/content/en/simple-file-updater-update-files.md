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
sourceHash: 9e2aca1fc06b7a61ec1dc2b04636b236ece097309293842ce295fb0efb68aa71
translationStatus: translated
generatedBodyHash: a58bf335db09da39ad064ed1b6507911588506d885df86d6cc029cd8d042d929
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

![SimpleFileUpdater output after updating a file](/media-occurrence/doc%3Asimple-file-updater%3Aupdate-files%3Amedia%3A1)

This run updates settings.json with the downloaded content and reports `已更新` (updated). The download address points to a local demonstration service; use your own download URL in your configuration.

![SimpleFileUpdater output when a file is already current](/media-occurrence/doc%3Asimple-file-updater%3Aupdate-files%3Amedia%3A2)

Run the same list again. When the downloaded content matches the local file, the program reports `已是最新` (already up to date) and keeps the existing file.

## Before Overwriting Files

This is a personal utility; you assume the risks of using it. Before running the update, verify that the remote URLs are trustworthy and the destination paths are correct. Back up any files already at those destinations, as the update may overwrite them.
