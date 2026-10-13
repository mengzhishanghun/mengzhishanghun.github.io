---
title: MDImageEmbed User Guide
description: Convert local Markdown images to embedded Base64 and copy them in Obsidian.
type: doc
slug: md-image-embed-guide
categoryId: writing-tools
categoryName: Writing Tools
categoryOrder: 1
order: 0
status: Official Documentation
date: 2025-12-21
draft: false
sitePublish: false
tags:
  - MDImageEmbed
  - Writing Tools
sourcePlatform: CNBlogs
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19379394
links:
  - label: Original CNBlogs article
    href: https://www.cnblogs.com/mengzhishanghun/p/19379394
workIds:
  - md-image-embed
lang: en
translationKey: doc:md-image-embed-guide:supplement:1
sourceHash: 89383b3cf836695df9bb57138209d884ea3642b2e57276dbdde9942ffa055d97
translationStatus: translated
generatedBodyHash: d6753d7bff42104d1722d2b9625fcb20bf461e563f82771438208b25cacebade
---

# MDImageEmbed User Guide

MDImageEmbed is an Obsidian plugin that converts local images to embedded Base64 and copies the result through the context menu. This guide preserves the plugin usage described in the original article.

## Installation

**Installation:** Download `main.js`, `manifest.json`, and `styles.css` into `<Vault>/.obsidian/plugins/md-image-embed/`, restart Obsidian, and enable the plugin.

**Supported formats:** PNG, JPG, JPEG, GIF, WebP, SVG, BMP

## Feature Overview

### One-Click Conversion

Right-click a `.md` file → **Copy as Base64 format** → paste into the target platform.

### Smart Path Resolution

Supports standard Markdown and Obsidian Wiki link syntax, automatically recognizing various relative paths.

### Anti-Reposting Protection

Configure prefix/suffix template files to add copyright notices or author information automatically during conversion.

### Smart Filtering

Automatically skips remote images and existing Base64 images.

## Demonstration: Publishing to CNBlogs

**Step 1**: Right-click the file in Obsidian and select **Copy as Base64 format**

![](/media-occurrence/doc%3Amd-image-embed-guide%3Amedia%3A1)

**Step 2**: Paste into the CNBlogs editor and click **Extract Images** in the lower right

![](/media-occurrence/doc%3Amd-image-embed-guide%3Amedia%3A2)

**Step 3**: Base64 is automatically converted to CNBlogs image-hosting links, completing publication

![](/media-occurrence/doc%3Amd-image-embed-guide%3Amedia%3A3)

## Usage Boundaries

The target platform must accept Base64 images or provide a way to extract them into platform image assets. Embedding increases text size; keep separate image files for everyday editing.

---

Originally published on 2025-12-21 on [CNBlogs](https://www.cnblogs.com/mengzhishanghun/p/19379394).
