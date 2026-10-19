---
title: MDImageEmbed
description: Copy Markdown in Obsidian after converting its local images to embedded Base64.
type: work
slug: md-image-embed
categoryId: obsidian-plugins
categoryName: Obsidian plugins
categoryOrder: 3
order: 1
status: Official documentation
featured: false
draft: false
sitePublish: false
tags:
  - Images
  - Export
sourcePlatform: CNBlogs
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19379394
links:
  - label: Original article on CNBlogs
    href: https://www.cnblogs.com/mengzhishanghun/p/19379394
docIds:
  - md-image-embed-guide
sourceDate: 2025-12-21
lang: en
translationKey: md-image-embed
sourceHash: eb941e4d1ebe7df412c4a3e7fd852b556c2851b6634ebc436782f38f64475ca4
translationStatus: translated
generatedBodyHash: d48af49937a76bb5cfaf1b57e4c599c00ef6fccb429ddb017a11dfba9485cc93
workInfo:
  channels:
    - kind: docs
      href: /docs/zh/guides/writing-tools/md-image-embed-guide/
  compatibility:
    - platforms:
        - Obsidian plugin (operating system to be verified)
      requirements: []
---
## Overview

MDImageEmbed is a local image export plugin for Obsidian.

It converts local images in the Markdown body to embedded Base64 and copies the result to the clipboard, making it easier to repost to platforms that support this format.

## Background and goals

Obsidian notes can reference images within the vault, a convenient arrangement for daily editing. However, copying only Markdown text into an external editor does not carry the image files along, and the original paths usually cannot be resolved there.

The plugin performs the conversion inside Obsidian, generating a copy containing image data from the selected Markdown file for reposting.

## Core capabilities

### Right-click copy action

Process a selected `.md` note from the Obsidian file context menu to generate a copy containing image data.

The original note retains its normal editable image references, while the copied version is used for subsequent pasting and publishing.

### Parsing and filtering two reference formats

The plugin recognizes standard Markdown image syntax and Obsidian Wiki image references, resolving local image paths.

Online images and Base64 images already embedded are skipped, avoiding repeated processing of remote addresses or existing data.

### Publishing text templates

Configurable prefix and suffix templates add copyright notices or author information around the copied result. Templates supply fixed additional text; its presentation still depends on the destination editor and rendering rules.

## Use cases

It suits users who write mainly in Obsidian and occasionally repost articles with local images to blogs or other platforms supporting embedded images. Conversion and copying are available from the file context menu, making it convenient for manual publication of individual articles.

## Scope and limitations

The destination must support Base64 images or provide a feature that extracts embedded images. Check body length and upload size limits as well.

Embedding images makes text substantially larger. Successful copying does not guarantee that a platform can save or display it. Preview the actual result before publishing.

See the [usage guide](/en/docs/guides/writing-tools/md-image-embed-guide/) for steps and parameters.
